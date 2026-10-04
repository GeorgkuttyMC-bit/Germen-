import React, { useState } from 'react';
import { Volume2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { MedicalTerm, BOOK_REFERENCES, ORGAN_SYSTEMS, UILanguage } from '../data/medicalLexicon';
import { TERM_ENGLISH_DATA, t } from '../data/bilingualTranslations';

interface FlashcardTrainerProps {
  terms: MedicalTerm[];
  masteredIds: string[];
  onToggleMastered: (id: string) => void;
  onSpeakGerman: (text: string) => void;
  onSpeakEnglish: (text: string) => void;
  uiLang: UILanguage;
}

type DrillDirection = 'en_to_de' | 'umgang_to_fach' | 'fach_to_en';

export const FlashcardTrainer: React.FC<FlashcardTrainerProps> = ({
  terms,
  masteredIds,
  onToggleMastered,
  onSpeakGerman,
  onSpeakEnglish,
  uiLang,
}) => {
  const [deckMode, setDeckMode] = useState<'all' | 'unmastered'>('all');
  const [direction, setDirection] = useState<DrillDirection>('en_to_de');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedArticleGuess, setSelectedArticleGuess] = useState<'der' | 'die' | 'das' | null>(null);

  const activeDeck =
    deckMode === 'unmastered'
      ? terms.filter((tItem) => !masteredIds.includes(tItem.id))
      : terms;

  const safeIndex = activeDeck.length > 0 ? currentIndex % activeDeck.length : 0;
  const currentCard = activeDeck[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedArticleGuess(null);
    if (activeDeck.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setSelectedArticleGuess(null);
    if (activeDeck.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
    }
  };

  if (!currentCard) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          {t(
            uiLang,
            'Alle Vokabeln im aktuellen Stapel sind als „FSP-Sicher gelernt“ markiert!',
            'All terms in this deck are marked as Mastered!',
            'All terms in this deck are Mastered · Alle Vokabeln gelernt!'
          )}
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          {t(
            uiLang,
            'Wechseln Sie zurück auf „Alle Begriffe“, um den gesamten Wortschatz erneut zu trainieren.',
            'Switch back to "All Terms" to review the complete bilingual deck.',
            'Switch back to "All Terms" to review the full English-German deck.'
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            setDeckMode('all');
            setCurrentIndex(0);
          }}
          className="mt-4 px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {t(
            uiLang,
            `Gesamtes Deck laden (${terms.length} Karten)`,
            `Load Complete Deck (${terms.length} Cards)`,
            `Load Full Deck (${terms.length} Cards)`
          )}
        </button>
      </div>
    );
  }

  const book = BOOK_REFERENCES.find((b) => b.id === currentCard.bookSource);
  const organ = ORGAN_SYSTEMS.find((o) => o.id === currentCard.organSystem);
  const isCardMastered = masteredIds.includes(currentCard.id);
  const enData = TERM_ENGLISH_DATA[currentCard.id];
  const definitionEn = currentCard.definitionEn || enData?.definitionEn;
  const arztbriefSnippetEn = currentCard.arztbriefSnippetEn || enData?.arztbriefSnippetEn;

  const targetArticle = currentCard.fachbegriff.article;
  const normalizedTargetArticle = targetArticle === 'die (Pl.)' ? 'die' : targetArticle;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {t(
              uiLang,
              '01. Aktiver Englisch-Deutsch & FSP-Vokabeltrainer',
              '01. Active English ↔ German Medical Flashcard & Gender Trainer',
              '01. English ↔ German Medical Flashcard & Gender Trainer'
            )}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t(
              uiLang,
              'Trainieren Sie den schnellen Wechsel zwischen Clinical English, deutscher Patientensprache und ärztlicher Fachterminologie inklusive Artikel-Sicherheit.',
              'Drill rapid translation between Clinical English, everyday German patient language (Umgangssprache), and specialist German (Fachsprache) with grammatical gender.',
              'Practice Clinical English ↔ German Specialist (Fachsprache) & Lay German (Umgangssprache).'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 3-Way Direction Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setDirection('en_to_de');
                setIsFlipped(false);
                setSelectedArticleGuess(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                direction === 'en_to_de'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English → Deutsch (Fach & Patient)
            </button>
            <button
              type="button"
              onClick={() => {
                setDirection('umgang_to_fach');
                setIsFlipped(false);
                setSelectedArticleGuess(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                direction === 'umgang_to_fach'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lay DE → Specialist DE
            </button>
            <button
              type="button"
              onClick={() => {
                setDirection('fach_to_en');
                setIsFlipped(false);
                setSelectedArticleGuess(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                direction === 'fach_to_en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deutsch → English
            </button>
          </div>

          {/* Deck Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setDeckMode('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                deckMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t(uiLang, 'Alle', 'All', 'All')} ({terms.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setDeckMode('unmastered');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                deckMode === 'unmastered'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t(uiLang, 'Offen', 'To Review', 'To Review')} ({terms.length - masteredIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between min-h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs text-slate-500 font-mono-tabular">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">
                CARD {safeIndex + 1} / {activeDeck.length}
              </span>
              <span>·</span>
              <span>{currentCard.code}</span>
              <span>·</span>
              <span>{uiLang === 'en' ? organ?.nameEn : organ?.nameDe}</span>
            </div>
            <span>{book?.shortTitle}</span>
          </div>

          <div className="py-8 flex flex-col items-center text-center max-w-xl mx-auto">
            <span className="text-xs text-slate-500 mb-2">
              {direction === 'en_to_de'
                ? 'Clinical English Prompt — Recall both the German Specialist (Fachbegriff) & Lay German (Umgangssprache) terms:'
                : direction === 'umgang_to_fach'
                ? 'Everyday German Patient Term (Umgangssprache) — What is the C1 Medical Specialist Term?'
                : 'German Medical Term (Fachsprache) — What is the Clinical English equivalent & Lay German term?'}
            </span>

            <div className="flex items-center gap-2">
              <h3 className="font-display text-3xl font-semibold text-slate-900 tracking-tight">
                {direction === 'en_to_de'
                  ? currentCard.english
                  : direction === 'umgang_to_fach'
                  ? `${currentCard.umgangssprache.article} ${currentCard.umgangssprache.term}`
                  : `${currentCard.fachbegriff.article} ${currentCard.fachbegriff.term}`}
              </h3>
              <button
                type="button"
                onClick={() =>
                  direction === 'en_to_de'
                    ? onSpeakEnglish(currentCard.english)
                    : onSpeakGerman(
                        direction === 'umgang_to_fach'
                          ? `${currentCard.umgangssprache.article} ${currentCard.umgangssprache.term}`
                          : `${currentCard.fachbegriff.article} ${currentCard.fachbegriff.term}`
                      )
                }
                className="p-1.5 text-slate-500 hover:text-[#0284C7] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Listen to pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {direction === 'en_to_de' && definitionEn && (
              <p className="text-xs text-slate-600 mt-2 max-w-lg">
                {definitionEn}
              </p>
            )}

            {direction === 'umgang_to_fach' && (
              <p className="text-sm text-slate-600 italic mt-3">
                {currentCard.umgangssprache.patientPhrasing} (EN: {currentCard.english})
              </p>
            )}

            {/* Step 1: Interactive Article Guess */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-700">
                {t(
                  uiLang,
                  '1. Welcher Artikel gehört zum deutschen Fachbegriff?',
                  '1. Select the grammatical gender (article) of the German specialist term:',
                  '1. Select the German article for the specialist term (Fachbegriff):'
                )}
              </span>
              <div className="flex items-center gap-2">
                {(['der', 'die', 'das'] as const).map((art) => {
                  const isSelected = selectedArticleGuess === art;
                  const isRight = art === normalizedTargetArticle;
                  let btnStyle = 'bg-slate-100 text-slate-800 hover:bg-slate-200';
                  if (isSelected) {
                    btnStyle = isRight
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#DC2626] text-white';
                  }
                  return (
                    <button
                      key={art}
                      type="button"
                      onClick={() => {
                        setSelectedArticleGuess(art);
                        setIsFlipped(true);
                      }}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${btnStyle}`}
                    >
                      {art}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Revealed Answer Area */}
            {isFlipped ? (
              <div className="mt-6 pt-5 border-t border-slate-200 w-full text-left bg-[#F8FAFC] p-5 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tabular font-semibold text-[#059669]">
                    ● BILINGUAL CLINICAL SOLUTION (DE ↔ EN)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onSpeakGerman(
                        `${currentCard.fachbegriff.article} ${currentCard.fachbegriff.term}. Umgangsdeutsch: ${currentCard.umgangssprache.article} ${currentCard.umgangssprache.term}`
                      )
                    }
                    className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak German
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Specialist (Fachsprache)</span>
                    <span className="font-display text-lg font-semibold text-slate-900">
                      {currentCard.fachbegriff.article} {currentCard.fachbegriff.term}
                    </span>
                    <span className="block text-[11px] font-mono-tabular text-slate-500">
                      {currentCard.fachbegriff.ipa}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Lay German (Umgangssprache)</span>
                    <span className="font-display text-lg font-semibold text-slate-900">
                      {currentCard.umgangssprache.article} {currentCard.umgangssprache.term}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Clinical English</span>
                    <span className="font-display text-lg font-semibold text-[#0284C7]">
                      {currentCard.english}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 pt-2 border-t border-slate-200/70 space-y-1">
                  <p>
                    <strong>DE Arztbrief:</strong> {currentCard.arztbriefSnippet}
                  </p>
                  {arztbriefSnippetEn && (
                    <p className="text-slate-600">
                      <strong>EN Report:</strong> {arztbriefSnippetEn}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="mt-6 px-5 py-2.5 text-xs font-medium bg-[#0284C7] text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
              >
                {t(
                  uiLang,
                  'Lösung & Englisch-Deutsch Vergleich aufdecken',
                  'Reveal English ↔ German Clinical Solution',
                  'Reveal Bilingual Solution · Lösung aufdecken'
                )}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />{' '}
              {t(uiLang, 'Vorherige', 'Previous', 'Prev · Zurück')}
            </button>

            <button
              type="button"
              onClick={() => onToggleMastered(currentCard.id)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                isCardMastered
                  ? 'bg-[#059669] text-white'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {isCardMastered
                  ? t(uiLang, '● FSP-Sicher gelernt', '● Mastered', '● Mastered · Gelernt')
                  : t(uiLang, 'Als gelernt markieren', 'Mark Mastered', 'Mark Mastered')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {t(uiLang, 'Nächste', 'Next', 'Next · Weiter')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Progress & High-Yield Article Rules */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900">
              {t(
                uiLang,
                '02. Lernfortschritt & Artikel-Regeln',
                '02. Mastery Progress & German Gender Rules',
                '02. Mastery & Gender Rules (der/die/das)'
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                uiLang,
                'Grammatikalische Eselsbrücken für medizinische Fachtermini',
                'High-yield grammatical gender rules for English-speaking clinicians',
                'High-yield German gender rules for clinical terms'
              )}
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-4 font-mono-tabular">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span>{t(uiLang, 'Beherrschte Begriffe', 'Mastered Terms', 'Mastered · Gelernt')}</span>
              <span className="font-semibold text-slate-900">
                {masteredIds.length} / {terms.length} (
                {Math.round((masteredIds.length / Math.max(terms.length, 1)) * 100)} %)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#059669] transition-transform duration-150 origin-left"
                style={{
                  transform: `scaleX(${masteredIds.length / Math.max(terms.length, 1)})`,
                }}
              />
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[#DC2626] font-semibold block">
                ● Feminine (die) — 85% of Greco-Latin Clinical Terms:
              </span>
              {uiLang === 'de' ? (
                <span>
                  Endungen auf <strong>-itis</strong> (die Appendizitis), <strong>-ose</strong> (die Thrombose), <strong>-ie</strong> (die Dyspnoe, die Koloskopie), <strong>-ur</strong> (die Fraktur) sind immer feminin.
                </span>
              ) : (
                <span>
                  Words ending in <strong>-itis</strong> (die Appendizitis), <strong>-ose</strong> (die Thrombose, die Arthrose), <strong>-ie</strong> (die Dyspnoe, die Koloskopie, die Appendektomie), and <strong>-ur</strong> (die Fraktur) are always feminine.
                </span>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-[#0284C7] font-semibold block">
                ● Masculine (der):
              </span>
              {uiLang === 'de' ? (
                <span>
                  Begriffe auf <strong>-us</strong> (der Ikterus, der Insult, der Prolaps, der Reflux) sowie deutsche Wörter auf <strong>-schmerz</strong> und <strong>-bruch</strong>.
                </span>
              ) : (
                <span>
                  Latin terms ending in <strong>-us</strong> (der Ikterus, der Insult, der Prolaps, der Reflux) and German nouns ending in <strong>-schmerz</strong> (pain) or <strong>-bruch</strong> (fracture/hernia).
                </span>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-[#059669] font-semibold block">
                ● Neuter (das):
              </span>
              {uiLang === 'de' ? (
                <span>
                  Endungen auf <strong>-om</strong> (das Karzinom, das Hämatom), <strong>-em</strong> (das Ödem, das Emphysem) und <strong>-syndrom</strong> / <strong>-ulkus</strong>.
                </span>
              ) : (
                <span>
                  Terms ending in <strong>-om</strong> (das Karzinom, das Hämatom, das Lymphom), <strong>-em</strong> (das Ödem, das Emphysem), and <strong>-syndrom</strong> / <strong>-ulkus</strong>.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
