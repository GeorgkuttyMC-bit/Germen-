import React, { useState } from 'react';
import { Volume2, BookOpen, Check, ArrowRight, User, Stethoscope } from 'lucide-react';
import {
  CLINICAL_WARD_SCENARIOS,
  ClinicalSituationCategory,
  DeepDictionaryWord,
} from '../data/clinicalWardSituations';
import { UILanguage } from '../data/medicalLexicon';
import { t } from '../data/bilingualTranslations';

interface WardSituationsDeepDiveProps {
  uiLang: UILanguage;
  onSpeakGerman: (text: string, slow?: boolean) => void;
  onSpeakEnglish: (text: string) => void;
}

export const WardSituationsDeepDive: React.FC<WardSituationsDeepDiveProps> = ({
  uiLang,
  onSpeakGerman,
  onSpeakEnglish,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<ClinicalSituationCategory>('patient_caregiver');
  const [activeExchangeIndex, setActiveExchangeIndex] = useState<number>(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [slowAudio, setSlowAudio] = useState<boolean>(false);

  const activeScenario =
    CLINICAL_WARD_SCENARIOS.find((s) => s.category === selectedCategory) ||
    CLINICAL_WARD_SCENARIOS[0];

  const activeExchange =
    activeScenario.exchanges[activeExchangeIndex] || activeScenario.exchanges[0];

  const activeWord: DeepDictionaryWord =
    activeExchange.analyzedWords.find((w) => w.id === selectedWordId) ||
    activeExchange.analyzedWords[0];

  const handleSelectCategory = (cat: ClinicalSituationCategory) => {
    setSelectedCategory(cat);
    setActiveExchangeIndex(0);
    setSelectedWordId(null);
  };

  const handleSelectExchange = (idx: number) => {
    setActiveExchangeIndex(idx);
    setSelectedWordId(null);
  };

  const getArticleColor = (article: string) => {
    if (article === 'der') return 'text-[#0284C7] font-bold';
    if (article === 'die' || article === 'die (Pl.)') return 'text-[#DC2626] font-bold';
    if (article === 'das') return 'text-[#059669] font-bold';
    return 'text-amber-700 font-bold';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Situation Type Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular mb-1.5">
            <span className="text-[#0284C7] font-semibold">
              ● REAL-TIME CLINICAL WARD DIALOGUES
            </span>
            <span>·</span>
            <span>PSCHYREMBEL KLINISCHES WÖRTERBUCH ANALYSIS</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            {t(
              uiLang,
              'Echtzeit-Stationssituationen: Patient ↔ Pflege & Arzt ↔ Pflege mit Tiefenanalyse',
              'Real-Time Ward Situations: Patient ↔ Caregiver & Doctor ↔ Caregiver Deep Analysis',
              'Real-Time Clinical Situations · Satz- & Wort-Tiefenanalyse (Pschyrembel)'
            )}
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {t(
              uiLang,
              'Erleben Sie realistische Krankenhaussituationen in Echtzeit. Jeder Satz wird grammatikalisch und klinisch erklärt, und jedes Fachwort wird mit dem Deutschen Medizinischen Wörterbuch (Pschyrembel) tiefgehend aufgeschlüsselt.',
              'Experience real-time hospital conversations between patients, caregivers (nurses), and physicians. Click any dialogue line and clinical word for a deep sentence & German Medical Dictionary (Pschyrembel) breakdown.',
              'Interactive real-time dialogues with deep sentence grammar explanations and Pschyrembel Medical Dictionary word analysis.'
            )}
          </p>
        </div>

        {/* Situation Role Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleSelectCategory('patient_caregiver')}
            className={`px-4 py-3 rounded-xl border text-left transition-colors flex items-center gap-3 cursor-pointer ${
              selectedCategory === 'patient_caregiver'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-[#F8FAFC] text-slate-800 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <User className="w-5 h-5 text-[#0284C7] shrink-0" />
            <div>
              <div className="text-xs font-semibold whitespace-nowrap">
                {t(
                  uiLang,
                  'Situation 1: Patient ↔ Pflegekraft',
                  'Situation 1: Patient ↔ Caregiver (Nurse)',
                  '1. Patient ↔ Caregiver (Pflege)'
                )}
              </div>
              <div
                className={`text-[11px] ${
                  selectedCategory === 'patient_caregiver' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                Post-Op Bedside Care & Mobilization
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectCategory('doctor_caregiver')}
            className={`px-4 py-3 rounded-xl border text-left transition-colors flex items-center gap-3 cursor-pointer ${
              selectedCategory === 'doctor_caregiver'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-[#F8FAFC] text-slate-800 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-5 h-5 text-[#059669] shrink-0" />
            <div>
              <div className="text-xs font-semibold whitespace-nowrap">
                {t(
                  uiLang,
                  'Situation 2: Arzt ↔ Pflegekraft',
                  'Situation 2: Doctor ↔ Caregiver (Nurse)',
                  '2. Doctor ↔ Caregiver (Arzt ↔ Pflege)'
                )}
              </div>
              <div
                className={`text-[11px] ${
                  selectedCategory === 'doctor_caregiver' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                Urgent SBAR Sepsis Escalation & Orders
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Scenario Context Banner */}
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-slate-500">
            <span className="font-semibold text-slate-900">{activeScenario.code}</span>
            <span>·</span>
            <span>
              {uiLang === 'de' ? activeScenario.wardSettingDe : activeScenario.wardSettingEn}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-slate-900 mt-0.5">
            {uiLang === 'de' ? activeScenario.titleDe : activeScenario.titleEn}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {uiLang === 'de' ? activeScenario.summaryDe : activeScenario.summaryEn}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono-tabular text-slate-800">
            <span className="text-slate-500 block text-[10px]">LIVE MONITOR / VITALS</span>
            <span className="font-semibold">{activeScenario.vitalSignsContext}</span>
          </div>

          <button
            type="button"
            onClick={() => setSlowAudio((prev) => !prev)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              slowAudio
                ? 'bg-sky-50 border-[#0284C7] text-[#0284C7]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {slowAudio ? '🐢 Slow Audio: ON (0.75×)' : '🔊 Normal Audio (1.0×)'}
          </button>
        </div>
      </div>

      {/* Main Two-Zone Split: Left = Real-Time Dialogue & Deep Sentence Breakdown | Right = German Medical Dictionary Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone (7 cols): Real-Time Conversation Stream + Deep Sentence Anatomy */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Conversation Step Selector Cards */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-display text-base font-semibold text-slate-900">
                  {t(
                    uiLang,
                    '01. Echtzeit-Dialog auf der Station (Klicken Sie auf einen Satz)',
                    '01. Real-Time Ward Dialogue (Click Any Exchange to Analyze)',
                    '01. Real-Time Ward Dialogue · Echtzeit-Gespräch'
                  )}
                </h4>
                <p className="text-xs text-slate-500">
                  {t(
                    uiLang,
                    'Hören Sie jeden Satz auf Deutsch und klicken Sie auf die blau markierten Wörter für das Medizin-Wörterbuch',
                    'Listen to each spoken turn in German and click any highlighted clinical word to open its German Medical Dictionary entry',
                    'Click any exchange or highlighted term for deep dictionary analysis'
                  )}
                </p>
              </div>
              <span className="text-xs font-mono-tabular text-slate-500">
                Turn {activeExchangeIndex + 1} / {activeScenario.exchanges.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {activeScenario.exchanges.map((ex, idx) => {
                const isSelected = idx === activeExchangeIndex;
                const isPatient = ex.speakerRole === 'Patient';
                const isDoctor = ex.speakerRole.includes('Doctor');

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleSelectExchange(idx)}
                    className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#0284C7] bg-sky-50/35'
                        : 'border-slate-200/90 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            isPatient
                              ? 'text-amber-700'
                              : isDoctor
                              ? 'text-[#059669]'
                              : 'text-[#0284C7]'
                          }`}
                        >
                          ● {ex.speakerRole} — {ex.speakerName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono-tabular text-slate-500">{ex.timestamp}</span>
                      </div>

                      <div
                        className="flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onSpeakGerman(ex.sentenceDe, slowAudio)}
                          className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 hover:border-[#0284C7] text-[#0284C7] rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speak Sentence (DE)</span>
                        </button>
                      </div>
                    </div>

                    {/* German Sentence */}
                    <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                      {ex.sentenceDe}
                    </p>

                    {/* English Translation */}
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      <strong>EN:</strong> {ex.sentenceEn}
                    </p>

                    {/* Interactive Dictionary Word Buttons inside this sentence */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-slate-500 mr-1">
                        {t(
                          uiLang,
                          'Wörterbuch-Analyse (anklicken):',
                          'Click word for Medical Dictionary:',
                          'Medical Dictionary Words:'
                        )}
                      </span>
                      {ex.analyzedWords.map((w) => {
                        const isWordActive = isSelected && activeWord?.id === w.id;
                        return (
                          <button
                            key={w.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveExchangeIndex(idx);
                              setSelectedWordId(w.id);
                              onSpeakGerman(w.baseEntryDe.split('/')[0], slowAudio);
                            }}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                              isWordActive
                                ? 'bg-[#0284C7] text-white border-[#0284C7]'
                                : 'bg-white text-slate-800 border-slate-300 hover:border-[#0284C7] hover:text-[#0284C7]'
                            }`}
                          >
                            {w.article !== 'Verb / Adj.' ? `${w.article} ` : ''}
                            {w.surfaceWordInSentence}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Sentence Grammar, Tone & Clinical Context Analysis Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-display text-base font-semibold text-slate-900">
                  {t(
                    uiLang,
                    `02. Satz-Tiefenanalyse (Turn ${activeExchangeIndex + 1}: ${activeExchange.speakerName})`,
                    `02. Deep Sentence & Grammar Breakdown (Turn ${activeExchangeIndex + 1})`,
                    `02. Deep Sentence & Grammar Analysis (Turn ${activeExchangeIndex + 1})`
                  )}
                </h4>
                <p className="text-xs text-slate-500">
                  {t(
                    uiLang,
                    'Warum dieser Satz in der deutschen Klinik genau so formuliert wird',
                    'How and why this sentence is constructed in authentic German hospital practice',
                    'Sentence structure, clinical tone & hospital communication protocol'
                  )}
                </p>
              </div>

              {activeExchangeIndex + 1 < activeScenario.exchanges.length && (
                <button
                  type="button"
                  onClick={() => handleSelectExchange(activeExchangeIndex + 1)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Turn</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4">
                <span className="font-semibold text-slate-900 block mb-1">
                  {t(
                    uiLang,
                    'Satzbau, Grammatik & Register (DE / EN):',
                    'Sentence Structure, Grammar & Register:',
                    'Grammar & Register Breakdown:'
                  )}
                </span>
                {(uiLang === 'de' || uiLang === 'bilingual') && (
                  <p className="text-slate-800 mb-2">
                    <strong>DE:</strong> {activeExchange.sentenceGrammarAndToneDe}
                  </p>
                )}
                {(uiLang === 'en' || uiLang === 'bilingual') && (
                  <p className="text-slate-600">
                    <strong>EN:</strong> {activeExchange.sentenceGrammarAndToneEn}
                  </p>
                )}
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4">
                <span className="font-semibold text-slate-900 block mb-1">
                  {t(
                    uiLang,
                    'Klinischer Hintergrund & Handlungsprotokoll:',
                    'Clinical Protocol & Bedside Reasoning:',
                    'Clinical Protocol & Reasoning:'
                  )}
                </span>
                <p className="text-slate-700">{activeExchange.clinicalContextExplanation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone (5 cols): German Medical Dictionary (Pschyrembel) Deep Word Inspector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5 sticky top-20">
          <div className="border-b border-slate-200 pb-4 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono-tabular text-[#0284C7] font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>DEUTSCHES MEDIZINISCHES WÖRTERBUCH</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900 mt-1">
                {t(
                  uiLang,
                  '03. Pschyrembel Wort-Tiefenanalyse',
                  '03. German Medical Dictionary Word Inspector',
                  '03. German Medical Dictionary (Pschyrembel)'
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {activeWord.dictionarySource}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onSpeakGerman(activeWord.baseEntryDe.split('/')[0], slowAudio)
                }
                className="px-3 py-1.5 text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-[#0284C7] rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>DE Audio</span>
              </button>
              <button
                type="button"
                onClick={() => onSpeakEnglish(activeWord.englishTranslation)}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                EN
              </button>
            </div>
          </div>

          {/* Selector Tabs for all Analyzed Words in Current Sentence */}
          <div className="flex flex-wrap gap-1.5">
            {activeExchange.analyzedWords.map((w) => {
              const isCurrent = w.id === activeWord.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWordId(w.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {w.surfaceWordInSentence}
                </button>
              );
            })}
          </div>

          {/* Dictionary Headword & 3 Registers */}
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-4 space-y-3">
            <div>
              <div className="text-[11px] font-mono-tabular text-slate-500">
                STICHWORT / DICTIONARY HEADWORD
              </div>
              <h4 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
                {activeWord.article !== 'Verb / Adj.' && (
                  <span className={`${getArticleColor(activeWord.article)} mr-1.5`}>
                    {activeWord.article}
                  </span>
                )}
                {activeWord.baseEntryDe}
              </h4>
              <div className="text-xs font-mono-tabular text-slate-500 mt-1">
                IPA: {activeWord.ipa} · Im Satz: „{activeWord.surfaceWordInSentence}“
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500 block">Clinical English:</span>
                <span className="font-semibold text-[#0284C7] text-sm">
                  {activeWord.englishTranslation}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Lay Patient German (Umgangsdeutsch):</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {activeWord.layGermanEquivalent}
                </span>
              </div>
            </div>
          </div>

          {/* Deep Pschyrembel Clinical Definition (DE + EN) */}
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="border-b border-slate-100 pb-3">
              <span className="font-semibold text-slate-900 block mb-1">
                1. Klinische Definition (Pschyrembel Wörterbuch):
              </span>
              <p className="text-slate-800">
                <strong>DE:</strong> {activeWord.pschyrembelDefinitionDe}
              </p>
              <p className="text-slate-600 mt-1.5">
                <strong>EN:</strong> {activeWord.pschyrembelDefinitionEn}
              </p>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <span className="font-semibold text-slate-900 block mb-1">
                2. Wortbildung, Etymologie & Grammatik:
              </span>
              <p className="text-slate-700">{activeWord.etymologyAndMorphology}</p>
            </div>

            <div>
              <span className="font-semibold text-slate-900 block mb-1">
                3. Verwendung in Arztbrief, Übergabe & Pflegebericht:
              </span>
              <p className="text-slate-700 bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3">
                <Check className="w-3.5 h-3.5 text-[#059669] inline mr-1 -mt-0.5" />
                {activeWord.clinicalUsageNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
