import React, { useState, useMemo, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ArrowRight,
  Check,
  HelpCircle,
  Trophy,
  Heart,
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

interface WordByWordGameArenaProps {
  uiLang: UILanguage;
  onSpeakGerman: (text: string) => void;
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
  const [hintTier, setHintTier] = useState<number>(0); // 0..3

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

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    gameAudio.enabled = next;
  };

  const startDeckGame = (deckId: string) => {
    setSelectedDeckId(deckId);
    setWordIndex(0);
    setWordStage('LEARN_CARD');
    setPatientStabilityHp(100);
    setStreakCount(0);
    setHintTier(0);
    setSelectedArticleChoice(null);
    setSelectedMeaningChoice(null);
    setStageFeedback(null);
    setGameState('PLAYING');
    gameAudio.playCardDeal();
    const firstWord = OLESEN_CURRICULUM_WORDS.find((w) => w.deckId === deckId);
    if (firstWord) {
      setTimeout(() => {
        onSpeakGerman(
          firstWord.article === 'Phrase'
            ? firstWord.germanTerm
            : `${firstWord.article} ${firstWord.germanTerm}`
        );
      }, 250);
    }
  };

  const advanceToStage2 = () => {
    gameAudio.playCardDeal();
    setStageFeedback(null);
    setHintTier(0);
    // If the item is a full phrase, skip article challenge directly to clinical context challenge
    if (currentWord.article === 'Phrase') {
      setWordStage('MEANING_CHALLENGE');
    } else {
      setWordStage('GENDER_CHALLENGE');
    }
  };

  const handleSelectArticle = (choice: 'der' | 'die' | 'das' | 'die (Pl.)') => {
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
        message: `● CORRECT GENDER (+${gained} XP): "${currentWord.article} ${currentWord.germanTerm}"`,
      });
      setTimeout(() => {
        setStageFeedback(null);
        setSelectedArticleChoice(null);
        setWordStage('MEANING_CHALLENGE');
      }, 750);
    } else {
      gameAudio.playError();
      setStreakCount(0);
      setPatientStabilityHp((prev) => {
        const next = Math.max(0, prev - 20);
        if (next === 0) {
          setTimeout(() => setGameState('GAME_OVER'), 500);
        }
        return next;
      });
      setStageFeedback({
        isPositive: false,
        message: `▲ INCORRECT ARTICLE (-20 HP): Remember "${currentWord.article} ${currentWord.germanTerm}". ${currentWord.clinicalTip}`,
      });
    }
  };

  const handleSelectMeaning = (optionWord: OlesenWordItem) => {
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
        message: `● WORD MASTERED (+${gained} XP): ${
          currentWord.article === 'Phrase'
            ? currentWord.germanTerm
            : `${currentWord.article} ${currentWord.germanTerm}`
        } = ${currentWord.englishMeaning}`,
      });
      setWordStage('WORD_CLEARED');
    } else {
      gameAudio.playError();
      setStreakCount(0);
      setPatientStabilityHp((prev) => {
        const next = Math.max(0, prev - 20);
        if (next === 0) {
          setTimeout(() => setGameState('GAME_OVER'), 500);
        }
        return next;
      });
      setStageFeedback({
        isPositive: false,
        message: `▲ TRY AGAIN (-20 HP): That option was "${optionWord.germanTerm}" (${optionWord.englishMeaning}). Look for "${currentWord.englishMeaning}".`,
      });
    }
  };

  const handleNextWordInDeck = () => {
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
      if (nextWord) {
        onSpeakGerman(
          nextWord.article === 'Phrase'
            ? nextWord.germanTerm
            : `${nextWord.article} ${nextWord.germanTerm}`
        );
      }
    } else {
      gameAudio.playVictory();
      setGameState('ROUND_SUMMARY');
    }
  };

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
  // STATE 1: TITLE_MENU (Select a Clinical Ward Level to Learn Word-by-Word)
  // ============================================================================
  if (gameState === 'TITLE_MENU') {
    return (
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col gap-8">
        {/* Top Arena Header & Player Telemetry */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-sky-400 font-mono-tabular mb-2">
              <span>● WORD-BY-WORD CLINICAL GAME ARENA</span>
              <span>·</span>
              <span>OLESEN TUITION + 6 GERMAN MEDICAL BOOKS</span>
            </div>
            <h2
              className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {t(
                uiLang,
                'Wort-für-Wort Klinik-Meisterschaft: Lernen, Artikel-Duell & Stations-Einsatz',
                'Word-by-Word Medical German Game: Learn, Gender Duel & Clinical Ward Match',
                'Word-by-Word Medical German Game · Wort-für-Wort Klinik-Training'
              )}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {t(
                uiLang,
                'Jede Runde führt Sie Wort für Wort durch die wichtigsten Begriffe aus Olesen Tuition (Essential Medical German) und den 6 deutschen Standard-Lehrbüchern: 1. Wortkarte & Audio entdecken → 2. Artikel-Duell → 3. Klinischer Patienten-Match.',
                'Master Medical German one word at a time from Olesen Tuition’s Essential Medical German curriculum and 6 German clinical textbooks: Step 1: Discover Word & Native Audio → Step 2: Gender Duel (der/die/das) → Step 3: Clinical Context Match.',
                'Master Medical German one word at a time: Step 1: Word Card & Audio → Step 2: Gender Duel → Step 3: Clinical Context Match.'
              )}
            </p>
          </div>

          {/* Player Rank & Scoreboard HUD */}
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-4 grid grid-cols-3 gap-4 shrink-0 font-mono-tabular">
            <div>
              <span className="text-[11px] text-slate-400 block">CLINICAL RANK</span>
              <span className="text-sm font-semibold text-amber-400">
                {getRankLabel(xpScore)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">TOTAL SCORE</span>
              <span className="text-lg font-semibold text-white">{xpScore} XP</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">WORDS CLEARED</span>
              <span className="text-lg font-semibold text-emerald-400">
                {masteredWordIds.length} / {OLESEN_CURRICULUM_WORDS.length}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Playable Hospital Ward Levels */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">
              {t(
                uiLang,
                'Wählen Sie eine Klinik-Station (5 Level · 32 hochrelevante Wörter & Redemittel):',
                'Select a Clinical Ward Level to Start Word-by-Word Play (5 Decks · 32 Essential Words & Phrases):',
                'Select a Clinical Ward Deck to Play Word-by-Word:'
              )}
            </h3>
            <button
              type="button"
              onClick={handleToggleSound}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
            </button>
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
                  className="bg-white text-slate-900 rounded-xl p-5 border border-slate-200 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-colors"
                >
                  <div>
                    {/* Playing Card Top Rank & Suit Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 font-mono-tabular">
                      <span className="text-xs font-semibold text-slate-800">
                        LEVEL 0{deck.levelNumber} · {wordsInDeck.length} WORDS
                      </span>
                      <span
                        className={`text-base font-bold ${
                          isSuitRed ? 'text-[#DC2626]' : 'text-slate-900'
                        }`}
                      >
                        {deck.suitSymbol} {clearedInDeck}/{wordsInDeck.length} CLEARED
                      </span>
                    </div>

                    <h4 className="font-display text-lg font-semibold text-slate-900">
                      {uiLang === 'de' ? deck.titleDe : deck.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {uiLang === 'de' ? deck.titleEn : deck.titleDe}
                    </p>

                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {uiLang === 'de' ? deck.subtitleDe : deck.subtitleEn}
                    </p>

                    {/* Preview of Words Inside This Level */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Words in this round:
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        {wordsInDeck
                          .map((w) =>
                            w.article === 'Phrase'
                              ? `„${w.germanTerm.slice(0, 24)}…“`
                              : `${w.article} ${w.germanTerm}`
                          )
                          .join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 truncate">
                      {deck.sourceBookOrLink}
                    </span>
                    <button
                      type="button"
                      onClick={() => startDeckGame(deck.id)}
                      className="px-4 py-2 text-xs font-semibold bg-[#0284C7] hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Level {deck.levelNumber}</span>
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
      <div className="bg-[#0F172A] text-white rounded-2xl p-8 border border-slate-800 flex flex-col items-center text-center max-w-3xl mx-auto my-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isVictory ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isVictory ? <Trophy className="w-7 h-7" /> : <Heart className="w-7 h-7" />}
        </div>

        <div className="text-xs font-mono-tabular text-sky-400 mb-1">
          {isVictory
            ? `● LEVEL 0${activeDeck.levelNumber} COMPLETE · WARD SHIFT PASSED`
            : '▲ PATIENT STABILITY DEPLETED · SHIFT PAUSED'}
        </div>

        <h2 className="font-display text-3xl font-semibold text-white">
          {isVictory
            ? `Ward Mastered: ${activeDeck.titleEn}`
            : 'Clinical Shift Needs Review'}
        </h2>

        <p className="text-sm text-slate-300 mt-2 max-w-xl">
          {isVictory
            ? `You learned and verified all ${deckWords.length} essential Medical German words in "${activeDeck.titleDe}" word by word!`
            : 'Take a moment to review the word cards and German articles (der / die / das), then restart the ward shift.'}
        </p>

        {/* Summary Telemetry Grid */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-xl p-4 my-6 font-mono-tabular">
          <div>
            <span className="text-xs text-slate-400 block">TOTAL XP</span>
            <span className="text-xl font-semibold text-amber-400">{xpScore} XP</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">BEST STREAK</span>
            <span className="text-xl font-semibold text-emerald-400">{bestStreak}×</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">PATIENT HP</span>
            <span className="text-xl font-semibold text-sky-400">{patientStabilityHp}%</span>
          </div>
        </div>

        {/* Word Recap List */}
        <div className="w-full bg-[#1E293B]/70 border border-slate-800 rounded-xl p-4 text-left mb-6">
          <div className="text-xs font-semibold text-slate-300 mb-2.5">
            Words Reviewed in Level 0{activeDeck.levelNumber}:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {deckWords.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800"
              >
                <div>
                  <span className="font-semibold text-white">
                    {w.article === 'Phrase' ? w.germanTerm : `${w.article} ${w.germanTerm}`}
                  </span>
                  <span className="text-slate-400 block text-[11px]">{w.englishMeaning}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onSpeakGerman(
                      w.article === 'Phrase' ? w.germanTerm : `${w.article} ${w.germanTerm}`
                    )
                  }
                  className="p-1.5 text-sky-400 hover:bg-slate-800 rounded-md cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => startDeckGame(activeDeck.id)}
            className="px-5 py-2.5 text-xs font-semibold bg-[#0284C7] hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          {activeDeck.levelNumber < GAME_DECKS.length && (
            <button
              type="button"
              onClick={() => {
                const nextDeck = GAME_DECKS[activeDeck.levelNumber];
                if (nextDeck) startDeckGame(nextDeck.id);
              }}
              className="px-5 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Next Ward (Level 0{activeDeck.levelNumber + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setGameState('TITLE_MENU')}
            className="px-5 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            All Ward Levels
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STATE 3: ACTIVE PLAYING TABLE (Word-by-Word 3-Step Interactive Progression)
  // ============================================================================
  return (
    <div className="bg-[#0F172A] text-white rounded-2xl p-5 sm:p-7 border border-slate-800 flex flex-col gap-6">
      {/* Unobtrusive Top Game HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1E293B] border border-slate-700/80 rounded-xl px-4 py-3 font-mono-tabular text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setGameState('TITLE_MENU')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-sans font-medium cursor-pointer"
          >
            ← Ward Map
          </button>
          <span className="text-sky-400 font-semibold">
            LEVEL 0{activeDeck.levelNumber}: {activeDeck.titleEn.toUpperCase()}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-white font-semibold">
            WORD {wordIndex + 1} OF {deckWords.length}
          </span>
        </div>

        {/* Non-Hue-Only Telemetry Meters */}
        <div className="flex flex-wrap items-center gap-5">
          <div>
            <span className="text-slate-400">HP: </span>
            <span
              className={`font-semibold ${
                patientStabilityHp >= 60 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {patientStabilityHp}/100 · {patientStabilityHp >= 60 ? 'STABLE' : 'CAUTION'}
            </span>
          </div>
          <div>
            <span className="text-slate-400">STREAK: </span>
            <span className="text-amber-400 font-semibold">{streakCount}×</span>
          </div>
          <div>
            <span className="text-slate-400">SCORE: </span>
            <span className="text-white font-semibold">{xpScore} XP</span>
          </div>
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 text-slate-300 hover:text-white rounded-md cursor-pointer"
            title="Toggle sound effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Word-by-Word Stepper Progress Bar */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono-tabular">
        <div
          className={`px-3 py-2 rounded-lg border flex items-center justify-between ${
            wordStage === 'LEARN_CARD'
              ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
              : 'bg-slate-900/70 border-slate-800 text-emerald-400'
          }`}
        >
          <span>STEP 1: STUDY WORD CARD</span>
          <span>{wordStage === 'LEARN_CARD' ? '● ACTIVE' : '✓ DONE'}</span>
        </div>
        <div
          className={`px-3 py-2 rounded-lg border flex items-center justify-between ${
            wordStage === 'GENDER_CHALLENGE'
              ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
              : wordStage === 'MEANING_CHALLENGE' || wordStage === 'WORD_CLEARED'
              ? 'bg-slate-900/70 border-slate-800 text-emerald-400'
              : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
          }`}
        >
          <span>STEP 2: GENDER DUEL (DER/DIE/DAS)</span>
          <span>
            {wordStage === 'GENDER_CHALLENGE'
              ? '● ACTIVE'
              : wordStage === 'MEANING_CHALLENGE' || wordStage === 'WORD_CLEARED'
              ? '✓ DONE'
              : 'LOCKED'}
          </span>
        </div>
        <div
          className={`px-3 py-2 rounded-lg border flex items-center justify-between ${
            wordStage === 'MEANING_CHALLENGE'
              ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
              : wordStage === 'WORD_CLEARED'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
              : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
          }`}
        >
          <span>STEP 3: CLINICAL MATCH</span>
          <span>
            {wordStage === 'MEANING_CHALLENGE'
              ? '● ACTIVE'
              : wordStage === 'WORD_CLEARED'
              ? '✓ MASTERED'
              : 'LOCKED'}
          </span>
        </div>
      </div>

      {/* Main Card Table Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left/Center Zone (8 cols): Active Playing Card */}
        <div className="lg:col-span-8 bg-white text-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between min-h-[380px] shadow-md">
          {/* Card Corner Rank & Source Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 text-xs font-mono-tabular text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {activeDeck.suitSymbol} CARD #{wordIndex + 1}
              </span>
              <span>·</span>
              <span>{currentWord.sourceAttribution}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onSpeakGerman(
                    currentWord.article === 'Phrase'
                      ? currentWord.germanTerm
                      : `${currentWord.article} ${currentWord.germanTerm}`
                  )
                }
                className="px-3 py-1.5 text-xs font-sans font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Speak German (DE)</span>
              </button>
              <button
                type="button"
                onClick={() => onSpeakEnglish(currentWord.englishMeaning)}
                className="px-3 py-1.5 text-xs font-sans font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Audio (EN)</span>
              </button>
            </div>
          </div>

          {/* STEP 1: LEARN WORD CARD */}
          {wordStage === 'LEARN_CARD' && (
            <div className="my-6 flex flex-col gap-5">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-mono-tabular uppercase text-slate-400 block mb-1">
                  Word {wordIndex + 1} of {deckWords.length} · Study Before Testing
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
                  {currentWord.ipa} · {currentWord.pluralOrVariant}
                </div>
                <div className="font-display text-xl font-semibold text-[#0284C7] mt-3">
                  EN: {currentWord.englishMeaning}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">
                    Clinical Example (DE & EN):
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    „{currentWord.exampleSentenceDe}“
                  </p>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    "{currentWord.exampleSentenceEn}"
                  </p>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-4 flex flex-col justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">
                      Specialist Equivalent (C1 Fachsprache):
                    </span>
                    <p className="text-[#0284C7] font-medium">
                      {currentWord.specialistEquivalent}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-slate-600">
                    <strong>Memory Tip:</strong> {currentWord.clinicalTip}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GENDER CHALLENGE */}
          {wordStage === 'GENDER_CHALLENGE' && (
            <div className="my-6 flex flex-col items-center text-center max-w-xl mx-auto gap-5">
              <div>
                <span className="text-xs font-mono-tabular text-[#0284C7] font-semibold block mb-1">
                  STEP 2 OF 3 · GERMAN ARTICLE CHALLENGE
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
                  ___ {currentWord.germanTerm}
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  English: <strong>{currentWord.englishMeaning}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-500">
                Select the correct German grammatical article for{' '}
                <strong>{currentWord.germanTerm}</strong>:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {(['der', 'die', 'das', 'die (Pl.)'] as const).map((art) => {
                  const isPicked = selectedArticleChoice === art;
                  const isRight = art === currentWord.article;
                  let btnClass =
                    'bg-[#F8FAFC] border-slate-300 text-slate-900 hover:border-[#0284C7] hover:bg-sky-50/50';
                  if (isPicked) {
                    btnClass = isRight
                      ? 'bg-[#059669] border-[#059669] text-white'
                      : 'bg-[#DC2626] border-[#DC2626] text-white';
                  }

                  return (
                    <button
                      key={art}
                      type="button"
                      onClick={() => handleSelectArticle(art)}
                      className={`py-3.5 px-4 rounded-xl border-2 font-display text-lg font-bold transition-colors cursor-pointer ${btnClass}`}
                    >
                      {art}
                    </button>
                  );
                })}
              </div>

              {/* 3-Tier Progressive Hint Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setHintTier((prev) => Math.min(prev + 1, 2))}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 mx-auto cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Need a grammar hint? (Tier {hintTier}/2)</span>
                </button>
                {hintTier >= 1 && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                    Hint 1: {currentWord.clinicalTip}
                  </p>
                )}
                {hintTier >= 2 && (
                  <p className="text-xs text-sky-800 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5 mt-1.5 font-mono-tabular">
                    Hint 2: The correct article starts with "{currentWord.article.slice(0, 2)}..."
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CLINICAL MEANING & CONTEXT CHALLENGE */}
          {(wordStage === 'MEANING_CHALLENGE' || wordStage === 'WORD_CLEARED') && (
            <div className="my-6 flex flex-col gap-5">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-mono-tabular text-[#0284C7] font-semibold block mb-1">
                  STEP 3 OF 3 · CLINICAL WARD MATCH
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Which German term matches: "{currentWord.englishMeaning}"?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specialist C1 clue: {currentWord.specialistEquivalent}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meaningOptions.map((opt) => {
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
                      className={`p-4 rounded-xl border-2 text-left transition-colors flex flex-col justify-between cursor-pointer ${cardStyle}`}
                    >
                      <div className="font-display text-base font-bold text-slate-900">
                        {opt.article !== 'Phrase' ? `${opt.article} ` : ''}
                        {opt.germanTerm}
                      </div>
                      <div className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                        {opt.ipa}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action & Feedback Bar inside Playing Card */}
          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs">
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
                    ? 'Listen to the pronunciation and review the memory tip before testing.'
                    : 'Answer accurately to build your streak and earn bonus XP.'}
                </span>
              )}
            </div>

            {wordStage === 'LEARN_CARD' && (
              <button
                type="button"
                onClick={advanceToStage2}
                className="px-5 py-2.5 text-xs font-semibold bg-[#0284C7] hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Test This Word (Step 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {wordStage === 'WORD_CLEARED' && (
              <button
                type="button"
                onClick={handleNextWordInDeck}
                className="px-5 py-2.5 text-xs font-semibold bg-[#059669] hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>
                  {wordIndex + 1 < deckWords.length
                    ? `Next Word (${wordIndex + 2}/${deckWords.length})`
                    : 'Complete Ward Shift'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Zone (4 cols): Word-by-Word Deck Ladder */}
        <div className="lg:col-span-4 bg-[#1E293B] border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <div>
                <h4 className="font-display text-sm font-semibold text-white">
                  Ward Word Ladder ({deckWords.length} Words)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Click any word to jump directly to its card
                </p>
              </div>
              <span className="text-xs font-mono-tabular text-sky-400">
                {deckWords.filter((w) => masteredWordIds.includes(w.id)).length}/{deckWords.length}
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
                    </div>
                    <span className="text-[11px] font-mono-tabular shrink-0">
                      {isCleared ? '✓' : isCurrent ? '●' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-200 block mb-0.5">
              Source Attribution:
            </strong>
            Vocabulary curated from Olesen Tuition (Essential Terms for Medical German) & cross-referenced with Springer, Thieme, and Elsevier FSP textbooks.
          </div>
        </div>
      </div>
    </div>
  );
};
