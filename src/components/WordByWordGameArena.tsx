import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Trophy,
  Check,
} from 'lucide-react';
import {
  GAME_DECKS,
  OLESEN_CURRICULUM_WORDS,
  OlesenWordItem,
  GameDeck,
} from '../data/olesenCurriculum';
import { UILanguage } from '../data/medicalLexicon';
import { t } from '../data/bilingualTranslations';
import { gameAudio } from '../utils/gameAudio';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY' | 'GAME_OVER';
type WordStage = 'LEARN_CARD' | 'GENDER_CHALLENGE' | 'MEANING_CHALLENGE' | 'WORD_CLEARED';
type GameModeStyle = 'relaxed' | 'challenge';

interface WordByWordGameArenaProps {
  uiLang: UILanguage;
  onSpeakGerman: (text: string, slow?: boolean) => void;
  onSpeakEnglish: (text: string) => void;
  masteredWordIds: string[];
  onMarkWordMastered: (wordId: string) => void;
}

export const WordByWordGameArena: React.FC<WordByWordGameArenaProps> = ({
  uiLang,
  onSpeakGerman,
  onSpeakEnglish,
  masteredWordIds,
  onMarkWordMastered,
}) => {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [gameModeStyle, setGameModeStyle] = useState<GameModeStyle>('relaxed');
  const [selectedDeckId, setSelectedDeckId] = useState<string>(GAME_DECKS[0].id);
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [wordStage, setWordStage] = useState<WordStage>('LEARN_CARD');

  // Game HUD Telemetry
  const [xpScore, setXpScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kliniklexikon_xp_v1');
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });
  const [streakCount, setStreakCount] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [patientStabilityHp, setPatientStabilityHp] = useState<number>(100);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [slowAudio, setSlowAudio] = useState<boolean>(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(true);
  const [hintTier, setHintTier] = useState<number>(0);

  // Challenge state
  const [selectedArticleChoice, setSelectedArticleChoice] = useState<string | null>(null);
  const [selectedMeaningChoice, setSelectedMeaningChoice] = useState<string | null>(null);
  const [stageFeedback, setStageFeedback] = useState<{
    isPositive: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kliniklexikon_xp_v1', String(xpScore));
    } catch {
      // ignore
    }
  }, [xpScore]);

  const activeDeck: GameDeck =
    GAME_DECKS.find((d) => d.id === selectedDeckId) || GAME_DECKS[0];

  const deckWords: OlesenWordItem[] = useMemo(
    () => OLESEN_CURRICULUM_WORDS.filter((w) => w.deckId === activeDeck.id),
    [activeDeck.id]
  );

  const currentWord: OlesenWordItem = deckWords[wordIndex] || deckWords[0];

  // Find the first unmastered word in the entire curriculum for "1-Click Resume"
  const nextRecommendedWordInfo = useMemo(() => {
    for (const deck of GAME_DECKS) {
      const words = OLESEN_CURRICULUM_WORDS.filter((w) => w.deckId === deck.id);
      const firstUnmasteredIdx = words.findIndex((w) => !masteredWordIds.includes(w.id));
      if (firstUnmasteredIdx !== -1) {
        return {
          deck,
          word: words[firstUnmasteredIdx],
          indexInDeck: firstUnmasteredIdx,
        };
      }
    }
    return {
      deck: GAME_DECKS[0],
      word: OLESEN_CURRICULUM_WORDS[0],
      indexInDeck: 0,
    };
  }, [masteredWordIds]);

  // Generate 4 deterministic multiple-choice options for the Meaning Challenge
  const meaningOptions = useMemo(() => {
    if (!currentWord) return [];
    const distractors = OLESEN_CURRICULUM_WORDS.filter(
      (w) => w.id !== currentWord.id
    )
      .slice(0, 12)
      .sort((a, b) => a.id.localeCompare(b.id));

    const picked = [
      currentWord,
      distractors[(wordIndex * 2) % distractors.length],
      distractors[(wordIndex * 2 + 3) % distractors.length],
      distractors[(wordIndex * 2 + 6) % distractors.length],
    ];

    return picked.sort((a, b) => a.germanTerm.localeCompare(b.germanTerm));
  }, [currentWord, wordIndex]);

  const speakWord = useCallback(
    (word: OlesenWordItem, forceSlow?: boolean) => {
      const useSlow = forceSlow !== undefined ? forceSlow : slowAudio;
      const text =
        word.article === 'Phrase'
          ? word.germanTerm
          : `${word.article} ${word.germanTerm}`;
      onSpeakGerman(text, useSlow);
    },
    [onSpeakGerman, slowAudio]
  );

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameAudio.enabled = next;
  };

  const startDeckGame = (deckId: string, startIndex: number = 0) => {
    setSelectedDeckId(deckId);
    setWordIndex(startIndex);
    setWordStage('LEARN_CARD');
    setPatientStabilityHp(100);
    setStreakCount(0);
    setHintTier(0);
    setSelectedArticleChoice(null);
    setSelectedMeaningChoice(null);
    setStageFeedback(null);
    setGameState('PLAYING');
    gameAudio.playCardDeal();

    const wordsForDeck = OLESEN_CURRICULUM_WORDS.filter((w) => w.deckId === deckId);
    const targetWord = wordsForDeck[startIndex] || wordsForDeck[0];
    if (targetWord && autoPlayVoice) {
      setTimeout(() => {
        speakWord(targetWord);
      }, 220);
    }
  };

  const advanceToStage2 = useCallback(() => {
    gameAudio.playCardDeal();
    setStageFeedback(null);
    setHintTier(0);
    if (currentWord.article === 'Phrase') {
      setWordStage('MEANING_CHALLENGE');
    } else {
      setWordStage('GENDER_CHALLENGE');
    }
  }, [currentWord]);

  const handleSelectArticle = useCallback(
    (choice: 'der' | 'die' | 'das' | 'die (Pl.)') => {
      setSelectedArticleChoice(choice);
      const isCorrect = choice === currentWord.article;
      if (isCorrect) {
        gameAudio.playCorrect();
        const gained = hintTier === 0 ? 25 : 15;
        setXpScore((prev) => prev + gained);
        setStreakCount((prev) => {
          const next = prev + 1;
          if (next > bestStreak) setBestStreak(next);
          return next;
        });
        setStageFeedback({
          isPositive: true,
          message: `● Correct Gender (+${gained} XP): "${currentWord.article} ${currentWord.germanTerm}"`,
        });
        setTimeout(() => {
          setStageFeedback(null);
          setSelectedArticleChoice(null);
          setWordStage('MEANING_CHALLENGE');
        }, 650);
      } else {
        gameAudio.playError();
        setStreakCount(0);
        if (gameModeStyle === 'challenge') {
          setPatientStabilityHp((prev) => {
            const next = Math.max(0, prev - 20);
            if (next === 0) {
              setTimeout(() => setGameState('GAME_OVER'), 500);
            }
            return next;
          });
        }
        setStageFeedback({
          isPositive: false,
          message: `▲ Try again: "${currentWord.germanTerm}" uses "${currentWord.article}". Tip: ${currentWord.clinicalTip}`,
        });
      }
    },
    [bestStreak, currentWord, gameModeStyle, hintTier]
  );

  const handleSelectMeaning = useCallback(
    (optionWord: OlesenWordItem) => {
      setSelectedMeaningChoice(optionWord.id);
      const isCorrect = optionWord.id === currentWord.id;
      if (isCorrect) {
        gameAudio.playCorrect();
        const gained = 35 + streakCount * 5;
        setXpScore((prev) => prev + gained);
        setStreakCount((prev) => {
          const next = prev + 1;
          if (next > bestStreak) setBestStreak(next);
          return next;
        });
        onMarkWordMastered(currentWord.id);
        setStageFeedback({
          isPositive: true,
          message: `● Word Mastered (+${gained} XP): ${
            currentWord.article === 'Phrase'
              ? currentWord.germanTerm
              : `${currentWord.article} ${currentWord.germanTerm}`
          } = ${currentWord.englishMeaning}`,
        });
        setWordStage('WORD_CLEARED');
      } else {
        gameAudio.playError();
        setStreakCount(0);
        if (gameModeStyle === 'challenge') {
          setPatientStabilityHp((prev) => {
            const next = Math.max(0, prev - 20);
            if (next === 0) {
              setTimeout(() => setGameState('GAME_OVER'), 500);
            }
            return next;
          });
        }
        setStageFeedback({
          isPositive: false,
          message: `▲ Not quite: "${optionWord.germanTerm}" means "${optionWord.englishMeaning}". Try selecting the German match for "${currentWord.englishMeaning}".`,
        });
      }
    },
    [bestStreak, currentWord, gameModeStyle, onMarkWordMastered, streakCount]
  );

  const handleNextWordInDeck = useCallback(() => {
    setSelectedArticleChoice(null);
    setSelectedMeaningChoice(null);
    setStageFeedback(null);
    setHintTier(0);

    if (wordIndex + 1 < deckWords.length) {
      const nextIdx = wordIndex + 1;
      setWordIndex(nextIdx);
      setWordStage('LEARN_CARD');
      gameAudio.playCardDeal();
      const nextWord = deckWords[nextIdx];
      if (nextWord && autoPlayVoice) {
        speakWord(nextWord);
      }
    } else {
      gameAudio.playVictory();
      setGameState('ROUND_SUMMARY');
    }
  }, [autoPlayVoice, deckWords, speakWord, wordIndex]);

  const handlePrevWordInDeck = () => {
    if (wordIndex > 0) {
      const prevIdx = wordIndex - 1;
      setWordIndex(prevIdx);
      setWordStage('LEARN_CARD');
      setSelectedArticleChoice(null);
      setSelectedMeaningChoice(null);
      setStageFeedback(null);
      setHintTier(0);
      gameAudio.playCardDeal();
      const prevWord = deckWords[prevIdx];
      if (prevWord && autoPlayVoice) {
        speakWord(prevWord);
      }
    }
  };

  // Keyboard shortcuts during active play (1-4 for options, Space/Enter to advance, R to repeat audio)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        speakWord(currentWord);
        return;
      }

      if (wordStage === 'LEARN_CARD' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        advanceToStage2();
        return;
      }

      if (wordStage === 'WORD_CLEARED' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNextWordInDeck();
        return;
      }

      if (wordStage === 'GENDER_CHALLENGE') {
        const articles: ('der' | 'die' | 'das' | 'die (Pl.)')[] = [
          'der',
          'die',
          'das',
          'die (Pl.)',
        ];
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < articles.length) {
          e.preventDefault();
          handleSelectArticle(articles[idx]);
        }
      } else if (wordStage === 'MEANING_CHALLENGE') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < meaningOptions.length) {
          e.preventDefault();
          handleSelectMeaning(meaningOptions[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    advanceToStage2,
    currentWord,
    gameState,
    handleNextWordInDeck,
    handleSelectArticle,
    handleSelectMeaning,
    meaningOptions,
    speakWord,
    wordStage,
  ]);

  const getRankLabel = (xp: number) => {
    if (xp < 250) return 'Medizinstudent (PJ)';
    if (xp < 550) return 'Assistenzarzt (Resident)';
    if (xp < 900) return 'Facharzt (Specialist)';
    return 'Oberarzt / Chefarzt (Attending)';
  };

  const getArticleBadgeColor = (article: string) => {
    if (article === 'der') return 'text-[#0284C7]';
    if (article === 'die' || article === 'die (Pl.)') return 'text-[#DC2626]';
    if (article === 'das') return 'text-[#059669]';
    return 'text-amber-600';
  };

  // ============================================================================
  // STATE 1: TITLE_MENU (Friendly Quick-Start + 5 Level Cards)
  // ============================================================================
  if (gameState === 'TITLE_MENU') {
    const progressPercent = Math.round(
      (masteredWordIds.length / Math.max(OLESEN_CURRICULUM_WORDS.length, 1)) * 100
    );

    return (
      <div className="flex flex-col gap-6">
        {/* Friendly Quick-Start Hero Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular mb-2">
              <span className="text-[#0284C7] font-semibold">
                ● INTERACTIVE WORD-BY-WORD COURSE
              </span>
              <span>·</span>
              <span>OLESEN TUITION + 6 GERMAN MEDICAL BOOKS</span>
              <span>·</span>
              <span>{progressPercent}% COMPLETED</span>
            </div>

            <h1
              className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {t(
                uiLang,
                'Lernen Sie Medizinisches Deutsch einfach Wort für Wort',
                'Learn Medical German Effortlessly — One Word at a Time',
                'Learn Medical German Effortlessly · Wort für Wort'
              )}
            </h1>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {t(
                uiLang,
                'Keine langen Wortlisten: Sie hören jedes Wort auf Deutsch, lernen eine einfache Eselsbrücke für den Artikel (der/die/das) und wenden es sofort an.',
                'No overwhelming word lists: listen to each German medical term, learn a quick memory trick for its article (der/die/das), and test yourself right away.',
                'Listen to each German medical term, learn a quick memory trick for der/die/das, and practice it immediately.'
              )}
            </p>

            {/* Primary 1-Click Quick Resume CTA + Comfort Settings */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  startDeckGame(
                    nextRecommendedWordInfo.deck.id,
                    nextRecommendedWordInfo.indexInDeck
                  )
                }
                className="px-5 py-3 text-sm font-semibold bg-[#0284C7] hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {t(
                    uiLang,
                    `Weiterlernen: „${nextRecommendedWordInfo.word.germanTerm}“ (Level ${nextRecommendedWordInfo.deck.levelNumber})`,
                    `Continue Next Word: "${nextRecommendedWordInfo.word.germanTerm}" (Level ${nextRecommendedWordInfo.deck.levelNumber})`,
                    `Continue Word: "${nextRecommendedWordInfo.word.germanTerm}" (Level ${nextRecommendedWordInfo.deck.levelNumber})`
                  )}
                </span>
              </button>

              {/* Relaxed vs Challenge Mode Selector */}
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGameModeStyle('relaxed')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    gameModeStyle === 'relaxed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t(uiLang, 'Entspannt (Kein HP-Verlust)', 'Relaxed Mode (No Penalty)', 'Relaxed Mode')}
                </button>
                <button
                  type="button"
                  onClick={() => setGameModeStyle('challenge')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    gameModeStyle === 'challenge'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t(uiLang, 'Prüfungs-Modus (Mit HP)', 'Exam Challenge (With HP)', 'Exam Mode')}
                </button>
              </div>
            </div>
          </div>

          {/* Clean Progress Summary Box */}
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-5 min-w-[260px] flex flex-col gap-3 shrink-0 font-mono-tabular">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">YOUR RANK</span>
              <span className="font-semibold text-[#0284C7]">{getRankLabel(xpScore)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">TOTAL XP</span>
              <span className="text-base font-bold text-slate-900">{xpScore} XP</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500">WORDS MASTERED</span>
                <span className="font-semibold text-[#059669]">
                  {masteredWordIds.length} / {OLESEN_CURRICULUM_WORDS.length}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#059669] transition-transform duration-200 origin-left"
                  style={{
                    transform: `scaleX(${
                      masteredWordIds.length / Math.max(OLESEN_CURRICULUM_WORDS.length, 1)
                    })`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* How It Works — 3 Simple Steps Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <span className="font-mono-tabular text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-md shrink-0">
              STEP 1
            </span>
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {t(uiLang, 'Wort & Aussprache anhören', 'Listen & Read the Word Card', 'Listen & Read Word Card')}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  uiLang,
                  'Mit normaler oder langsamer (0.75×) deutscher Sprachausgabe und Eselsbrücke.',
                  'Hear normal or slow (0.75×) German audio with an English clinical example.',
                  'Normal or slow (0.75×) German pronunciation + memory trick.'
                )}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <span className="font-mono-tabular text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-md shrink-0">
              STEP 2
            </span>
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {t(uiLang, 'Artikel-Check (der / die / das)', 'Quick Gender Check (der / die / das)', 'Quick Gender Check')}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  uiLang,
                  'Farbcodiertes Artikel-Training mit sofortiger Grammatik-Hilfe bei Bedarf.',
                  'Color-coded article practice with a 1-click grammar hint whenever you need it.',
                  'Color-coded article practice with instant grammar hints.'
                )}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <span className="font-mono-tabular text-xs font-bold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-md shrink-0">
              STEP 3
            </span>
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {t(uiLang, 'Klinischer Bedeutungs-Match', 'Clinical Meaning Match', 'Clinical Meaning Match')}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  uiLang,
                  'Verbinden Sie Englisch, deutsche Patientensprache und den C1-Fachbegriff.',
                  'Connect the English term, everyday patient German, and the C1 specialist term.',
                  'Connect English, everyday German, and C1 specialist terminology.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 5 Playable Hospital Ward Levels */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {t(
                  uiLang,
                  'Alle 5 Klinik-Level (Wählen Sie ein Thema oder klicken Sie auf ein einzelnes Wort)',
                  'Choose a Topic Level (Or Click Any Word Pill to Jump Straight to That Word)',
                  'Choose a Topic Level · Oder direkt ein einzelnes Wort anklicken'
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  uiLang,
                  'Jedes Level enthält 5 bis 7 wichtige Vokabeln aus Olesen Tuition & den deutschen Fachbüchern',
                  'Each bite-sized level contains 5–7 essential words from Olesen Tuition & German medical textbooks',
                  'Each level contains 5–7 essential words from Olesen Tuition & German textbooks'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlowAudio((prev) => !prev)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  slowAudio
                    ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {slowAudio ? '🐢 Slow Audio: ON (0.75×)' : '🔊 Normal Audio Speed (1.0×)'}
              </button>

              <button
                type="button"
                onClick={handleToggleSound}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#0284C7]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>{soundEnabled ? 'Game SFX: ON' : 'Game SFX: OFF'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAME_DECKS.map((deck) => {
              const wordsInDeck = OLESEN_CURRICULUM_WORDS.filter((w) => w.deckId === deck.id);
              const clearedInDeck = wordsInDeck.filter((w) =>
                masteredWordIds.includes(w.id)
              ).length;
              const isSuitRed = deck.suitSymbol === '♥' || deck.suitSymbol === '♦';

              return (
                <div
                  key={deck.id}
                  className="bg-[#F8FAFC] text-slate-900 rounded-xl p-5 border border-slate-200/90 flex flex-col justify-between hover:border-[#0284C7] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5 mb-3 font-mono-tabular">
                      <span className="text-xs font-semibold text-slate-700">
                        LEVEL 0{deck.levelNumber} · {wordsInDeck.length} WORDS
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          clearedInDeck === wordsInDeck.length
                            ? 'text-[#059669]'
                            : isSuitRed
                            ? 'text-[#DC2626]'
                            : 'text-slate-800'
                        }`}
                      >
                        {deck.suitSymbol} {clearedInDeck}/{wordsInDeck.length} MASTERED
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-slate-900">
                      {uiLang === 'de' ? deck.titleDe : deck.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {uiLang === 'de' ? deck.titleEn : deck.titleDe}
                    </p>

                    {/* Clickable Word List to Jump Directly to Any Specific Word */}
                    <div className="mt-3.5 pt-3 border-t border-slate-200/70">
                      <span className="text-[11px] font-medium text-slate-500 block mb-2">
                        {t(
                          uiLang,
                          'Klicken Sie auf ein Wort, um genau dort zu starten:',
                          'Click any word below to jump straight to it:',
                          'Click any word to jump straight to it:'
                        )}
                      </span>
                      <div className="flex flex-col gap-1">
                        {wordsInDeck.map((w, idx) => {
                          const isWordDone = masteredWordIds.includes(w.id);
                          return (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => startDeckGame(deck.id, idx)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200/80 text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer"
                            >
                              <span className="truncate font-medium text-slate-800">
                                {w.article === 'Phrase' ? (
                                  w.germanTerm
                                ) : (
                                  <>
                                    <span className={getArticleBadgeColor(w.article)}>
                                      {w.article}
                                    </span>{' '}
                                    {w.germanTerm}
                                  </>
                                )}
                              </span>
                              <span className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1">
                                <span className="truncate max-w-[110px]">{w.englishMeaning.split('/')[0]}</span>
                                {isWordDone && (
                                  <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 truncate">
                      {deck.sourceBookOrLink.split('·')[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => startDeckGame(deck.id, 0)}
                      className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-[#0284C7] text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Level {deck.levelNumber}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STATE 2: ROUND_SUMMARY OR GAME_OVER MODAL VIEW
  // ============================================================================
  if (gameState === 'ROUND_SUMMARY' || gameState === 'GAME_OVER') {
    const isVictory = gameState === 'ROUND_SUMMARY';

    return (
      <div className="bg-white text-slate-900 rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center max-w-3xl mx-auto my-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isVictory ? 'bg-emerald-50 text-[#059669]' : 'bg-amber-50 text-amber-600'
          }`}
        >
          <Trophy className="w-7 h-7" />
        </div>

        <div className="text-xs font-mono-tabular text-[#0284C7] font-semibold mb-1">
          {isVictory
            ? `● LEVEL 0${activeDeck.levelNumber} COMPLETE · ALL ${deckWords.length} WORDS PRACTICED`
            : '▲ EXAM CHALLENGE PAUSED · REVIEW & RETRY'}
        </div>

        <h2 className="font-display text-3xl font-semibold text-slate-900">
          {isVictory
            ? `Great Job! You Completed ${activeDeck.titleEn}`
            : 'Let’s Review Those Words One More Time'}
        </h2>

        <p className="text-sm text-slate-600 mt-2 max-w-xl">
          {isVictory
            ? `You stepped through all ${deckWords.length} Medical German terms in "${activeDeck.titleDe}". Listen to any word below or continue to the next level!`
            : 'Tip: You can switch to "Relaxed Mode" anytime if you want to practice without losing HP.'}
        </p>

        {/* Summary Telemetry Grid */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 my-6 font-mono-tabular">
          <div>
            <span className="text-xs text-slate-500 block">TOTAL SCORE</span>
            <span className="text-xl font-semibold text-[#0284C7]">{xpScore} XP</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">BEST STREAK</span>
            <span className="text-xl font-semibold text-[#059669]">{bestStreak}×</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">WORDS MASTERED</span>
            <span className="text-xl font-semibold text-slate-900">
              {masteredWordIds.length}/{OLESEN_CURRICULUM_WORDS.length}
            </span>
          </div>
        </div>

        {/* Word Recap List */}
        <div className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-left mb-6">
          <div className="text-xs font-semibold text-slate-700 mb-2.5">
            Words Practiced in Level 0{activeDeck.levelNumber} (Click speaker to hear again):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {deckWords.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200"
              >
                <div>
                  <span className="font-semibold text-slate-900">
                    {w.article === 'Phrase' ? w.germanTerm : `${w.article} ${w.germanTerm}`}
                  </span>
                  <span className="text-slate-500 block text-[11px]">{w.englishMeaning}</span>
                </div>
                <button
                  type="button"
                  onClick={() => speakWord(w)}
                  className="p-1.5 text-[#0284C7] hover:bg-sky-50 rounded-md cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => startDeckGame(activeDeck.id, 0)}
            className="px-5 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Level {activeDeck.levelNumber}</span>
          </button>

          {activeDeck.levelNumber < GAME_DECKS.length && (
            <button
              type="button"
              onClick={() => {
                const nextDeck = GAME_DECKS[activeDeck.levelNumber];
                if (nextDeck) startDeckGame(nextDeck.id, 0);
              }}
              className="px-5 py-2.5 text-xs font-semibold bg-[#0284C7] hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Start Next Level (Level 0{activeDeck.levelNumber + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setGameState('TITLE_MENU')}
            className="px-5 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Back to Level Menu
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STATE 3: ACTIVE PLAYING VIEW (User-Friendly Word-by-Word Learning Table)
  // ============================================================================
  return (
    <div className="bg-[#0F172A] text-white rounded-2xl p-5 sm:p-7 border border-slate-800 flex flex-col gap-5">
      {/* Friendly Top Navigation & Audio Comfort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E293B] border border-slate-700/80 rounded-xl px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setGameState('TITLE_MENU')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Levels</span>
          </button>

          <div className="font-mono-tabular">
            <span className="text-sky-400 font-semibold">
              LEVEL 0{activeDeck.levelNumber}: {activeDeck.titleEn}
            </span>
            <span className="mx-2 text-slate-500">·</span>
            <span className="text-white font-semibold">
              Word {wordIndex + 1} of {deckWords.length}
            </span>
          </div>
        </div>

        {/* User-Friendly Audio & Mode Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono-tabular">
          <button
            type="button"
            onClick={() => setSlowAudio((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md font-sans text-xs font-medium transition-colors cursor-pointer ${
              slowAudio
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Toggle slow pronunciation (0.75x) for clearer German syllables"
          >
            {slowAudio ? '🐢 Slow Audio (0.75×)' : '🔊 Normal Speed (1.0×)'}
          </button>

          {gameModeStyle === 'challenge' && (
            <div>
              <span className="text-slate-400">HP: </span>
              <span
                className={`font-semibold ${
                  patientStabilityHp >= 60 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {patientStabilityHp}/100
              </span>
            </div>
          )}

          <div>
            <span className="text-slate-400">STREAK: </span>
            <span className="text-amber-400 font-semibold">{streakCount}×</span>
          </div>

          <div>
            <span className="text-slate-400">XP: </span>
            <span className="text-white font-semibold">{xpScore}</span>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 text-slate-300 hover:text-white rounded-md cursor-pointer"
            title="Toggle sound effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive Clickable Step Tabs (Users can freely revisit Step 1 at any time!) */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono-tabular">
        <button
          type="button"
          onClick={() => {
            setWordStage('LEARN_CARD');
            setStageFeedback(null);
          }}
          className={`px-3.5 py-2.5 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
            wordStage === 'LEARN_CARD'
              ? 'bg-[#0284C7] border-sky-300 text-white font-semibold'
              : 'bg-slate-900/80 border-slate-700 text-emerald-400 hover:bg-slate-800'
          }`}
        >
          <span>1. STUDY WORD CARD</span>
          <span>{wordStage === 'LEARN_CARD' ? '● CURRENT' : '✓ REVIEW'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (currentWord.article !== 'Phrase') {
              setWordStage('GENDER_CHALLENGE');
              setStageFeedback(null);
            }
          }}
          className={`px-3.5 py-2.5 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
            wordStage === 'GENDER_CHALLENGE'
              ? 'bg-[#0284C7] border-sky-300 text-white font-semibold'
              : wordStage === 'MEANING_CHALLENGE' || wordStage === 'WORD_CLEARED'
              ? 'bg-slate-900/80 border-slate-700 text-emerald-400 hover:bg-slate-800'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span>2. ARTICLE QUIZ (DER/DIE/DAS)</span>
          <span>
            {currentWord.article === 'Phrase'
              ? 'N/A (PHRASE)'
              : wordStage === 'GENDER_CHALLENGE'
              ? '● CURRENT'
              : wordStage === 'MEANING_CHALLENGE' || wordStage === 'WORD_CLEARED'
              ? '✓ DONE'
              : 'PRACTICE'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setWordStage('MEANING_CHALLENGE');
            setStageFeedback(null);
          }}
          className={`px-3.5 py-2.5 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
            wordStage === 'MEANING_CHALLENGE'
              ? 'bg-[#0284C7] border-sky-300 text-white font-semibold'
              : wordStage === 'WORD_CLEARED'
              ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-semibold'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span>3. MEANING MATCH</span>
          <span>
            {wordStage === 'MEANING_CHALLENGE'
              ? '● CURRENT'
              : wordStage === 'WORD_CLEARED'
              ? '✓ MASTERED'
              : 'PRACTICE'}
          </span>
        </button>
      </div>

      {/* Main Card Table Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left/Center Zone (8 cols): Active Playing Card */}
        <div className="lg:col-span-8 bg-white text-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between min-h-[390px] shadow-md">
          {/* Card Corner Rank & Quick Audio Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 text-xs">
            <div className="flex items-center gap-2 font-mono-tabular text-slate-500">
              <span className="font-bold text-slate-900 text-sm">
                {activeDeck.suitSymbol} WORD {wordIndex + 1} OF {deckWords.length}
              </span>
              <span>·</span>
              <span>{currentWord.sourceAttribution}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => speakWord(currentWord, false)}
                className="px-3 py-1.5 text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-[#0284C7] rounded-lg flex items-center gap-1.5 cursor-pointer"
                title="Shortcut: Press R"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen (DE)</span>
              </button>
              <button
                type="button"
                onClick={() => speakWord(currentWord, true)}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                title="Listen slowly at 0.75x speed"
              >
                🐢 Slow (0.75×)
              </button>
              <button
                type="button"
                onClick={() => onSpeakEnglish(currentWord.englishMeaning)}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                EN Audio
              </button>
            </div>
          </div>

          {/* STEP 1: LEARN WORD CARD */}
          {wordStage === 'LEARN_CARD' && (
            <div className="my-5 flex flex-col gap-5">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  {currentWord.article === 'der'
                    ? 'Masculine Noun (der)'
                    : currentWord.article === 'die'
                    ? 'Feminine Noun (die)'
                    : currentWord.article === 'das'
                    ? 'Neuter Noun (das)'
                    : currentWord.article === 'die (Pl.)'
                    ? 'Plural Noun (die)'
                    : 'Clinical Phrase'}
                </span>

                <h3 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  {currentWord.article !== 'Phrase' && (
                    <span className={`${getArticleBadgeColor(currentWord.article)} mr-2`}>
                      {currentWord.article}
                    </span>
                  )}
                  {currentWord.germanTerm}
                </h3>

                <div className="text-xs font-mono-tabular text-slate-500 mt-1.5">
                  Pronunciation: {currentWord.ipa} · {currentWord.pluralOrVariant}
                </div>

                <div className="font-display text-xl sm:text-2xl font-semibold text-[#0284C7] mt-3">
                  {currentWord.englishMeaning}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">
                      Real Hospital Sentence (DE & EN):
                    </span>
                    <button
                      type="button"
                      onClick={() => onSpeakGerman(currentWord.exampleSentenceDe, slowAudio)}
                      className="text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Play Sentence
                    </button>
                  </div>
                  <p className="text-slate-900 font-medium leading-relaxed">
                    „{currentWord.exampleSentenceDe}“
                  </p>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    "{currentWord.exampleSentenceEn}"
                  </p>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-4 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">
                      Doctor-to-Doctor Term (C1 Fachsprache):
                    </span>
                    <p className="text-[#0284C7] font-semibold">
                      {currentWord.specialistEquivalent}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-slate-700">
                    <strong className="text-slate-900">Easy Memory Trick:</strong>{' '}
                    {currentWord.clinicalTip}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GENDER CHALLENGE */}
          {wordStage === 'GENDER_CHALLENGE' && (
            <div className="my-5 flex flex-col items-center text-center max-w-xl mx-auto gap-5">
              <div>
                <span className="text-xs font-mono-tabular text-[#0284C7] font-semibold block mb-1">
                  STEP 2 OF 3 · QUICK ARTICLE CHECK
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
                  ___ {currentWord.germanTerm}
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Meaning: <strong>{currentWord.englishMeaning}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-500">
                Choose the correct German article (or press keys <strong>1–4</strong>):
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {(
                  [
                    { art: 'der', sub: 'Masculine (1)' },
                    { art: 'die', sub: 'Feminine (2)' },
                    { art: 'das', sub: 'Neuter (3)' },
                    { art: 'die (Pl.)', sub: 'Plural (4)' },
                  ] as const
                ).map((item) => {
                  const isPicked = selectedArticleChoice === item.art;
                  const isRight = item.art === currentWord.article;
                  let btnClass =
                    'bg-[#F8FAFC] border-slate-300 text-slate-900 hover:border-[#0284C7] hover:bg-sky-50/50';
                  if (isPicked) {
                    btnClass = isRight
                      ? 'bg-[#059669] border-[#059669] text-white'
                      : 'bg-[#DC2626] border-[#DC2626] text-white';
                  }

                  return (
                    <button
                      key={item.art}
                      type="button"
                      onClick={() => handleSelectArticle(item.art)}
                      className={`py-3.5 px-3 rounded-xl border-2 transition-colors flex flex-col items-center cursor-pointer ${btnClass}`}
                    >
                      <span className="font-display text-xl font-bold">{item.art}</span>
                      <span
                        className={`text-[11px] mt-0.5 ${
                          isPicked ? 'text-white/90' : 'text-slate-500'
                        }`}
                      >
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setWordStage('LEARN_CARD')}
                  className="text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer"
                >
                  ← Peek back at Study Card
                </button>
                <button
                  type="button"
                  onClick={() => setHintTier((prev) => Math.min(prev + 1, 2))}
                  className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Show Grammar Hint ({hintTier}/2)</span>
                </button>
              </div>

              {hintTier >= 1 && (
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2">
                  <strong>Grammar Rule:</strong> {currentWord.clinicalTip}
                </p>
              )}
              {hintTier >= 2 && (
                <p className="text-xs text-sky-900 bg-sky-50 border border-sky-200 rounded-lg px-3.5 py-1.5 font-mono-tabular">
                  <strong>Answer Hint:</strong> Choose "{currentWord.article}"
                </p>
              )}
            </div>
          )}

          {/* STEP 3: CLINICAL MEANING & CONTEXT CHALLENGE */}
          {(wordStage === 'MEANING_CHALLENGE' || wordStage === 'WORD_CLEARED') && (
            <div className="my-5 flex flex-col gap-5">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-mono-tabular text-[#0284C7] font-semibold block mb-1">
                  STEP 3 OF 3 · MATCH THE GERMAN WORD
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  "{currentWord.englishMeaning}"
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specialist C1 clue: {currentWord.specialistEquivalent}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meaningOptions.map((opt, idx) => {
                  const isPicked = selectedMeaningChoice === opt.id;
                  const isRight = opt.id === currentWord.id;
                  let cardStyle =
                    'bg-[#F8FAFC] border-slate-200 text-slate-900 hover:border-[#0284C7]';
                  if (isPicked || wordStage === 'WORD_CLEARED') {
                    if (isRight) {
                      cardStyle = 'bg-emerald-50 border-[#059669] text-slate-900';
                    } else if (isPicked) {
                      cardStyle = 'bg-red-50 border-[#DC2626] text-slate-900';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={wordStage === 'WORD_CLEARED'}
                      onClick={() => handleSelectMeaning(opt)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${cardStyle}`}
                    >
                      <div>
                        <div className="font-display text-base font-bold text-slate-900">
                          <span className="font-mono-tabular text-xs text-slate-400 mr-1.5">
                            {idx + 1}.
                          </span>
                          {opt.article !== 'Phrase' ? `${opt.article} ` : ''}
                          {opt.germanTerm}
                        </div>
                        <div className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                          {opt.ipa}
                        </div>
                      </div>
                      {(isPicked || wordStage === 'WORD_CLEARED') && isRight && (
                        <Check className="w-5 h-5 text-[#059669] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action & Previous/Next Word Controls inside Playing Card */}
          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={wordIndex === 0}
                onClick={handlePrevWordInDeck}
                className={`px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors ${
                  wordIndex === 0
                    ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev Word</span>
              </button>

              <div className="text-xs pl-1">
                {stageFeedback ? (
                  <span
                    className={`font-semibold ${
                      stageFeedback.isPositive ? 'text-[#059669]' : 'text-[#DC2626]'
                    }`}
                  >
                    {stageFeedback.message}
                  </span>
                ) : (
                  <span className="text-slate-500">
                    {wordStage === 'LEARN_CARD'
                      ? 'Tip: Press Space/Enter when ready, or R to hear German audio.'
                      : 'Press 1–4 on your keyboard or click any answer.'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {wordStage === 'LEARN_CARD' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onMarkWordMastered(currentWord.id);
                      handleNextWordInDeck();
                    }}
                    className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Already know this word? Mark mastered and skip to next word"
                  >
                    I Know This →
                  </button>
                  <button
                    type="button"
                    onClick={advanceToStage2}
                    className="px-5 py-2.5 text-xs font-semibold bg-[#0284C7] hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>Practice This Word (Step 2)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {wordStage === 'WORD_CLEARED' && (
                <button
                  type="button"
                  onClick={handleNextWordInDeck}
                  className="px-5 py-2.5 text-xs font-semibold bg-[#059669] hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>
                    {wordIndex + 1 < deckWords.length
                      ? `Next Word (${wordIndex + 2}/${deckWords.length})`
                      : 'Finish Level'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone (4 cols): Word-by-Word Deck Ladder */}
        <div className="lg:col-span-4 bg-[#1E293B] border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <div>
                <h4 className="font-display text-sm font-semibold text-white">
                  Words in Level 0{activeDeck.levelNumber}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Click any word below to jump straight to it
                </p>
              </div>
              <span className="text-xs font-mono-tabular text-emerald-400 font-semibold">
                {deckWords.filter((w) => masteredWordIds.includes(w.id)).length}/{deckWords.length}{' '}
                DONE
              </span>
            </div>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {deckWords.map((item, idx) => {
                const isCurrent = idx === wordIndex;
                const isCleared = masteredWordIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setWordIndex(idx);
                      setWordStage('LEARN_CARD');
                      setStageFeedback(null);
                      if (autoPlayVoice) speakWord(item);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0284C7] border-sky-400 text-white font-semibold'
                        : isCleared
                        ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="font-mono-tabular mr-1.5 opacity-75">
                        0{idx + 1}.
                      </span>
                      <span>
                        {item.article === 'Phrase'
                          ? item.germanTerm
                          : `${item.article} ${item.germanTerm}`}
                      </span>
                      <span
                        className={`block text-[11px] truncate ${
                          isCurrent ? 'text-sky-100' : 'text-slate-400'
                        }`}
                      >
                        {item.englishMeaning}
                      </span>
                    </div>
                    <span className="text-xs font-mono-tabular shrink-0">
                      {isCleared ? '✓' : isCurrent ? '●' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoPlayVoice}
                onChange={(e) => setAutoPlayVoice(e.target.checked)}
                className="rounded border-slate-600"
              />
              <span>Auto-play German voice on new card</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
