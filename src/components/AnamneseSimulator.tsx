import React, { useState } from 'react';
import { Volume2, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { ANAMNESE_CASES, BOOK_REFERENCES, UILanguage } from '../data/medicalLexicon';
import { t } from '../data/bilingualTranslations';

interface AnamneseSimulatorProps {
  onSpeakGerman: (text: string) => void;
  uiLang: UILanguage;
}

export const AnamneseSimulator: React.FC<AnamneseSimulatorProps> = ({ onSpeakGerman, uiLang }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(ANAMNESE_CASES[0].id);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [selectedOptionByStep, setSelectedOptionByStep] = useState<Record<number, string>>({});

  const activeCase = ANAMNESE_CASES.find((c) => c.id === selectedCaseId) || ANAMNESE_CASES[0];
  const activeStep = activeCase.steps[currentStepIdx] || activeCase.steps[0];
  const book = BOOK_REFERENCES.find((b) => b.id === activeCase.bookSource);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentStepIdx(0);
    setSelectedOptionByStep({});
  };

  const handleChooseOption = (stepNumber: number, optionId: string) => {
    setSelectedOptionByStep((prev) => ({
      ...prev,
      [stepNumber]: optionId,
    }));
  };

  const chosenOptionId = selectedOptionByStep[activeStep.stepNumber];
  const chosenOption = activeStep.options.find((o) => o.id === chosenOptionId);

  const compiledArztbriefSentences = activeCase.steps
    .map((step) => {
      const optId = selectedOptionByStep[step.stepNumber];
      const opt = step.options.find((o) => o.id === optId);
      if (opt && opt.isCorrect) {
        return opt.arztbriefFormulation;
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Case Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {t(
              uiLang,
              '01. Interaktive Anamnese & Arztbrief-Simulation (FSP Teil 1 & 2)',
              '01. Interactive Patient History (Anamnese) & Medical Report (Arztbrief) Simulator',
              '01. Interactive Anamnesis & Arztbrief Simulator (FSP Part 1 & 2)'
            )}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {t(
              uiLang,
              'Übersetzen Sie die umgangssprachlichen Schilderungen der Patientinnen und Patienten Schritt für Schritt in präzise klinische Fachterminologie für den Entlassungsbrief.',
              'Translate everyday German patient statements step by step into formal C1 medical terminology and Konjunktiv I discharge summary sentences.',
              'Translate everyday patient statements (DE/EN) into formal C1 medical terminology for the German Arztbrief.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {ANAMNESE_CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectCase(c.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                c.id === activeCase.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.caseCode}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular">
              <span className="font-semibold text-slate-900">{activeCase.caseCode}</span>
              <span aria-hidden="true">·</span>
              <span>{book?.shortTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{activeCase.suspectedDiagnosisFach}</span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2 mt-1">
              <h3 className="font-display text-xl font-semibold text-slate-900">
                {activeCase.patientName} ({activeCase.age} J., {activeCase.occupation})
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 mt-1 border-t border-slate-100 text-xs font-mono-tabular">
              <div>
                <span className="text-slate-500 block">RR (BP)</span>
                <span className="font-semibold text-slate-900">{activeCase.vitalSigns.bp}</span>
              </div>
              <div>
                <span className="text-slate-500 block">HF (HR)</span>
                <span className="font-semibold text-slate-900">{activeCase.vitalSigns.hr}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Temp</span>
                <span className="font-semibold text-slate-900">{activeCase.vitalSigns.temp}</span>
              </div>
              <div>
                <span className="text-slate-500 block">SpO₂</span>
                <span className="font-semibold text-slate-900">{activeCase.vitalSigns.spo2}</span>
              </div>
            </div>
          </div>

          {/* Step Progression Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {activeCase.steps.map((s, idx) => {
                const answered = Boolean(selectedOptionByStep[s.stepNumber]);
                const isCurrent = idx === currentStepIdx;
                return (
                  <button
                    key={s.stepNumber}
                    type="button"
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0284C7] text-white'
                        : answered
                        ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t(uiLang, `Station ${s.stepNumber}`, `Stage ${s.stepNumber}`, `Stage ${s.stepNumber}`)}:{' '}
                    {s.phase.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedOptionByStep({});
                setCurrentStepIdx(0);
              }}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />{' '}
              {t(uiLang, 'Fall zurücksetzen', 'Reset Case', 'Reset · Zurücksetzen')}
            </button>
          </div>

          {/* Active Patient Statement Box */}
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-lg p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-900">
                {t(uiLang, 'Station', 'Stage', 'Stage')} {activeStep.stepNumber} — {activeStep.phase}
              </span>
              <button
                type="button"
                onClick={() => onSpeakGerman(activeStep.patientStatementDe)}
                className="text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />{' '}
                {t(uiLang, 'Patienten-Aussage (DE)', 'Play Patient Audio (DE)', 'Audio (DE)')}
              </button>
            </div>

            <p className="text-base font-medium text-slate-900 leading-relaxed">
              {activeStep.patientStatementDe}
            </p>
            <p className="text-xs text-slate-600 mt-2">
              <strong>EN Translation:</strong> {activeStep.patientStatementEn}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600">
                {t(
                  uiLang,
                  'Zu übersetzende Patientenaussage:',
                  'Lay German phrase to translate into Medical German:',
                  'Lay Phrase to Translate:'
                )}{' '}
                <strong className="text-slate-900">{activeStep.highlightedLayTerm}</strong>
              </span>
            </div>
          </div>

          {/* FSP Register Translation Options */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-slate-900">
              {t(
                uiLang,
                'Wählen Sie die korrekte Fachterminologie & Arztbrief-Formulierung (Konjunktiv I / Nominalstil):',
                'Select the accurate German medical terminology & Arztbrief formulation (Konjunktiv I / Nominal style):',
                'Select accurate German Medical Terminology & Arztbrief formulation:'
              )}
            </h4>

            {activeStep.options.map((opt) => {
              const isSelected = chosenOptionId === opt.id;
              let borderStyle = 'border-slate-200 bg-white hover:border-slate-300';
              if (isSelected) {
                borderStyle = opt.isCorrect
                  ? 'border-[#059669] bg-emerald-50/40'
                  : 'border-[#DC2626] bg-red-50/40';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChooseOption(activeStep.stepNumber, opt.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer ${borderStyle}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">
                      {opt.fachbegriff}
                    </div>
                    {isSelected && (
                      <span
                        className={`text-xs font-mono-tabular font-semibold shrink-0 ${
                          opt.isCorrect ? 'text-[#059669]' : 'text-[#DC2626]'
                        }`}
                      >
                        {opt.isCorrect
                          ? t(uiLang, '● KORREKT (FSP)', '● CORRECT (FSP)', '● CORRECT · KORREKT')
                          : t(uiLang, '▲ FEHLERHAFT', '▲ INCORRECT REGISTER', '▲ INCORRECT')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    „{opt.arztbriefFormulation}“
                  </p>
                </button>
              );
            })}
          </div>

          {chosenOption && (
            <div
              className={`p-4 rounded-lg border text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                chosenOption.isCorrect
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                  : 'bg-amber-50/70 border-amber-200 text-slate-800'
              }`}
            >
              <div>
                <span className="font-semibold block mb-0.5">
                  {chosenOption.isCorrect
                    ? t(
                        uiLang,
                        '● Ärztliche Bewertung: Korrekte Terminologie',
                        '● Attending Physician Feedback: Correct Terminology',
                        '● Feedback: Correct Terminology'
                      )
                    : t(
                        uiLang,
                        '▲ Ärztliche Korrektur:',
                        '▲ Attending Physician Correction:',
                        '▲ Clinical Correction:'
                      )}
                </span>
                {chosenOption.explanation}
              </div>

              {currentStepIdx < activeCase.steps.length - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStepIdx((i) => i + 1)}
                  className="px-3.5 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{t(uiLang, 'Nächste Station', 'Next Stage', 'Next Stage · Weiter')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Zone (5 cols): Live Compiled Arztbrief / Epikrise */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 pb-4 mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {t(
                    uiLang,
                    '02. Live-Arztbrief Dokumentation',
                    '02. Live German Arztbrief Builder',
                    '02. Live Arztbrief Documentation'
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    uiLang,
                    'Automatische Generierung aus Ihren korrekten FSP-Antworten',
                    'Compiled automatically from your verified FSP selections',
                    'Compiled automatically from verified FSP answers'
                  )}
                </p>
              </div>
              <span className="font-mono-tabular text-xs text-slate-600">
                {compiledArztbriefSentences.length} / {activeCase.steps.length}
              </span>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-4 font-mono-tabular text-xs text-slate-800 space-y-3">
              <div className="border-b border-slate-200 pb-2">
                <div className="font-semibold text-slate-900">
                  VORLÄUFIGER ENTLASSUNGSBRIEF / ZNA-BERICHT
                </div>
                <div className="text-slate-500 mt-0.5">
                  Patient: {activeCase.patientName}, Alter: {activeCase.age} Jahre
                </div>
                <div className="text-slate-700 mt-0.5">
                  Verdachtsdiagnose: {activeCase.suspectedDiagnosisFach}
                </div>
              </div>

              <div>
                <div className="text-slate-500 uppercase text-[11px] mb-1">
                  Anamnese & Aufnahmebefund:
                </div>
                {compiledArztbriefSentences.length === 0 ? (
                  <p className="text-slate-500 italic font-sans">
                    {t(
                      uiLang,
                      'Wählen Sie links die zutreffenden Fachbegriffe aus, um die ärztliche Anamnese im Nominalstil und Konjunktiv I aufzubauen.',
                      'Select the matching German medical terms on the left to build the formal Arztbrief history in Nominalstil and Konjunktiv I.',
                      'Select the matching medical terms on the left to compile the German Arztbrief.'
                    )}
                  </p>
                ) : (
                  <div className="space-y-2.5 font-sans text-xs text-slate-900 leading-relaxed">
                    {compiledArztbriefSentences.map((sentence, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>{sentence}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-900 mb-2">
              {t(
                uiLang,
                'Grammatik-Leitfaden (Cornelsen / Schrimpf):',
                'Arztbrief Grammar Rules (Cornelsen / Schrimpf):',
                'Arztbrief Grammar Rules · Grammatik-Leitfaden:'
              )}
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>
                ·{' '}
                <strong>
                  {t(
                    uiLang,
                    'Konjunktiv I für subjektive Patientenangaben:',
                    'Konjunktiv I (Indirect Speech) for subjective patient history:',
                    'Konjunktiv I for subjective history:'
                  )}
                </strong>{' '}
                „Der Patient gibt an, er leide seit zwei Stunden unter Brustenge (habe Schmerzen).“
              </li>
              <li>
                ·{' '}
                <strong>
                  {t(
                    uiLang,
                    'Indikativ für objektive Untersuchungsbefunde:',
                    'Indicative tense for objective examination findings:',
                    'Indicative for objective findings:'
                  )}
                </strong>{' '}
                „Klinisch zeigt sich ein deutlicher Sklerenikterus.“
              </li>
              <li>
                ·{' '}
                <strong>
                  {t(
                    uiLang,
                    'Verneinungen im Arztbrief:',
                    'Documenting pertinent negatives:',
                    'Pertinent negatives (Verneinungen):'
                  )}
                </strong>{' '}
                „Fieber, Schüttelfrost und Nachtschweiß werden verneint.“
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
