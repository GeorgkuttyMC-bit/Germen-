import React, { useState, useEffect } from 'react';
import { Volume2, Check } from 'lucide-react';
import { MedicalTerm, BOOK_REFERENCES, ORGAN_SYSTEMS, UILanguage } from '../data/medicalLexicon';
import { TERM_ENGLISH_DATA, t } from '../data/bilingualTranslations';

interface TermInspectorProps {
  term: MedicalTerm;
  isMastered: boolean;
  onToggleMastered: (termId: string) => void;
  onSpeakGerman: (text: string) => void;
  onSpeakEnglish: (text: string) => void;
  uiLang: UILanguage;
}

export const TermInspector: React.FC<TermInspectorProps> = ({
  term,
  isMastered,
  onToggleMastered,
  onSpeakGerman,
  onSpeakEnglish,
  uiLang,
}) => {
  const [registerFocus, setRegisterFocus] = useState<'comparison' | 'anamnese' | 'arztbrief'>('comparison');
  const [quizAnswerRevealed, setQuizAnswerRevealed] = useState(false);
  const [userDraftTranslation, setUserDraftTranslation] = useState('');

  const book = BOOK_REFERENCES.find((b) => b.id === term.bookSource);
  const organ = ORGAN_SYSTEMS.find((o) => o.id === term.organSystem);
  const enData = TERM_ENGLISH_DATA[term.id];

  const patientPhrasingEn = term.umgangssprache.patientPhrasingEn || enData?.patientPhrasingEn;
  const definitionEn = term.definitionEn || enData?.definitionEn;
  const arztbriefSnippetEn = term.arztbriefSnippetEn || enData?.arztbriefSnippetEn;
  const fspTipEn = term.fspTipEn || enData?.fspTipEn;

  useEffect(() => {
    setQuizAnswerRevealed(false);
    setUserDraftTranslation('');
  }, [term.id]);

  const getArticleColor = (article: string) => {
    if (article === 'der') return 'text-[#0284C7] font-semibold';
    if (article === 'die' || article === 'die (Pl.)') return 'text-[#DC2626] font-semibold';
    return 'text-[#059669] font-semibold';
  };

  const getArticleLabel = (article: string) => {
    if (article === 'der')
      return t(uiLang, 'MASKULINUM (DER)', 'MASCULINE (DER)', 'MASCULINE · MASKULIN (DER)');
    if (article === 'die')
      return t(uiLang, 'FEMININUM (DIE)', 'FEMININE (DIE)', 'FEMININE · FEMININ (DIE)');
    if (article === 'die (Pl.)') return 'PLURAL (DIE)';
    return t(uiLang, 'NEUTRUM (DAS)', 'NEUTER (DAS)', 'NEUTER · NEUTRUM (DAS)');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
      {/* Unboxed Metadata Row (Zero-Pill Discipline) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular">
          <span className="text-slate-800 font-medium">{term.code}</span>
          <span aria-hidden="true">·</span>
          <span>
            {uiLang === 'en' ? `${organ?.nameEn} (${organ?.nameFach})` : organ?.nameFach}
          </span>
          <span aria-hidden="true">·</span>
          <span>{book?.shortTitle}</span>
          <span aria-hidden="true">·</span>
          <span>{term.chapterRef}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onSpeakGerman(
                `${term.fachbegriff.article} ${term.fachbegriff.term}. Umgangsdeutsch: ${term.umgangssprache.article} ${term.umgangssprache.term}`
              )
            }
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{t(uiLang, 'Aussprache (DE)', 'Audio (DE)', 'Audio (DE)')}</span>
          </button>

          <button
            type="button"
            onClick={() => onSpeakEnglish(term.english)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Audio (EN)</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleMastered(term.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              isMastered
                ? 'bg-[#059669] text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>
              {isMastered
                ? t(uiLang, '● FSP-Sicher gelernt', '● Mastered (FSP)', '● Mastered · Gelernt')
                : t(uiLang, 'Als gelernt markieren', 'Mark as Mastered', 'Mark Mastered · Merken')}
            </span>
          </button>
        </div>
      </div>

      {/* Three-Register Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-slate-200/80">
        {/* Register 1: Fachsprache */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
              <span>
                {t(
                  uiLang,
                  '01. Ärztliche Fachsprache (C1)',
                  '01. Medical Specialist German (Fachsprache)',
                  '01. Medical Specialist (Fachsprache C1)'
                )}
              </span>
              <span className="font-mono-tabular text-[11px] text-slate-400">
                {getArticleLabel(term.fachbegriff.article)}
              </span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">
              <span className={getArticleColor(term.fachbegriff.article)}>
                {term.fachbegriff.article}
              </span>{' '}
              {term.fachbegriff.term}
            </h3>
            <div className="mt-1.5 text-xs text-slate-500 font-mono-tabular">
              {term.fachbegriff.ipa} · Plural: {term.fachbegriff.plural}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-medium text-slate-800">
              {t(uiLang, 'Wortstamm:', 'Etymology / Root:', 'Root / Wortstamm:')}
            </span>{' '}
            {term.fachbegriff.latinRoot}
          </div>
        </div>

        {/* Register 2: Umgangssprache */}
        <div className="flex flex-col justify-between lg:border-l lg:border-r border-slate-200/80 lg:px-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              {t(
                uiLang,
                '02. Deutsche Umgangssprache (Patientengespräch)',
                '02. Everyday Lay German (Umgangssprache)',
                '02. Lay Patient German (Umgangssprache)'
              )}
            </div>
            <h3 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">
              <span className={getArticleColor(term.umgangssprache.article)}>
                {term.umgangssprache.article}
              </span>{' '}
              {term.umgangssprache.term}
            </h3>
            <p className="mt-2 text-xs text-slate-700 italic leading-relaxed">
              {term.umgangssprache.patientPhrasing}
            </p>
            {(uiLang === 'bilingual' || uiLang === 'en') && patientPhrasingEn && (
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                EN: {patientPhrasingEn}
              </p>
            )}
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
            {t(
              uiLang,
              'Register: Aufklärung & Anamnese (Patientenverständnis)',
              'Register: Doctor-to-Patient Anamnesis & Informed Consent',
              'Register: Doctor-to-Patient (Aufklärung & Anamnese)'
            )}
          </div>
        </div>

        {/* Register 3: Clinical English & Bilingual Definition */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
              <span>
                {t(
                  uiLang,
                  '03. Clinical English & Definition',
                  '03. Clinical English Equivalent & Definition',
                  '03. Clinical English & Bilingual Definition'
                )}
              </span>
              {term.clinicalAbbreviation && (
                <span className="font-mono-tabular text-xs font-medium text-slate-700">
                  {t(uiLang, 'Kürzel:', 'Abbrev:', 'Abbrev:')} {term.clinicalAbbreviation}
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-semibold text-[#0284C7]">
              {term.english}
            </h3>

            {uiLang === 'de' && (
              <p className="mt-2 text-xs text-slate-700 leading-relaxed">{term.definitionDe}</p>
            )}
            {uiLang === 'en' && (
              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                {definitionEn || term.definitionDe}
              </p>
            )}
            {uiLang === 'bilingual' && (
              <div className="mt-2 space-y-1.5 text-xs leading-relaxed">
                <p className="text-slate-800">
                  <strong className="text-slate-900">DE:</strong> {term.definitionDe}
                </p>
                {definitionEn && (
                  <p className="text-slate-600">
                    <strong className="text-slate-700">EN:</strong> {definitionEn}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
            {t(uiLang, 'Quelle:', 'Source:', 'Source / Quelle:')} {book?.fullTitle} ({book?.edition})
          </div>
        </div>
      </div>

      {/* Interactive Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setRegisterFocus('comparison')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              registerFocus === 'comparison'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t(
              uiLang,
              'Klinische Kollokationen & FSP-Tipp',
              'Clinical Collocations & FSP Exam Tip',
              'Collocations & FSP Tip · Kollokationen'
            )}
          </button>
          <button
            type="button"
            onClick={() => setRegisterFocus('anamnese')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              registerFocus === 'anamnese'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t(
              uiLang,
              'Arzt-Patienten-Dialog (Anamnese)',
              'Doctor-Patient Dialogue (Anamnesis)',
              'Doctor-Patient Dialogue · Anamnese-Dialog'
            )}
          </button>
          <button
            type="button"
            onClick={() => setRegisterFocus('arztbrief')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              registerFocus === 'arztbrief'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t(
              uiLang,
              'Arztbrief-Formulierung & Selbsttest',
              'Medical Report (Arztbrief) & Recall Quiz',
              'Arztbrief & Self-Test · Arztbrief'
            )}
          </button>
        </div>

        <div className="text-xs text-slate-500">
          {t(uiLang, 'Genus-System:', 'German Gender:', 'Gender / Genus:')}{' '}
          <span className="text-[#0284C7] font-semibold">der (masc)</span> ·{' '}
          <span className="text-[#DC2626] font-semibold">die (fem)</span> ·{' '}
          <span className="text-[#059669] font-semibold">das (neut)</span>
        </div>
      </div>

      {/* Mode 1: Clinical Collocations & FSP Exam Tip */}
      {registerFocus === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-slate-900">
              {t(
                uiLang,
                'Typische Wortverbindungen (Deutsch ↔ Englisch)',
                'High-Yield Clinical Collocations (German ↔ English)',
                'Clinical Collocations (Deutsch ↔ English)'
              )}
            </h4>
            <div className="divide-y divide-slate-200/70 border-t border-b border-slate-200/70">
              {term.collocations.map((col, idx) => (
                <div key={idx} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{col.german}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      EN: <span className="font-medium text-slate-800">{col.english}</span> ·{' '}
                      <span className="text-slate-500">{col.register}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeakGerman(col.german)}
                    className="p-1.5 text-slate-500 hover:text-[#0284C7] hover:bg-slate-100 rounded-md transition-colors shrink-0 cursor-pointer"
                    title="Speak German collocation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              {t(
                uiLang,
                'Prüfungshinweis für die Fachsprachprüfung (FSP)',
                'Clinical Pearl for the German Medical Licensing Exam (FSP)',
                'FSP Exam Pearl · Prüfungshinweis'
              )}
            </div>
            {(uiLang === 'de' || uiLang === 'bilingual') && (
              <p className="text-xs text-slate-800 leading-relaxed">
                <strong>DE:</strong> {term.fspTip}
              </p>
            )}
            {(uiLang === 'en' || uiLang === 'bilingual') && fspTipEn && (
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>EN:</strong> {fspTipEn}
              </p>
            )}
            <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500">
              {book?.shortTitle} · {term.chapterRef}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Bilingual Doctor-Patient Anamnesis Dialogue */}
      {registerFocus === 'anamnese' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-[#0284C7]">
                  {t(
                    uiLang,
                    'Ärztin / Arzt (Fragestellung in der Anamnese)',
                    'Physician Question (Anamnesis Interview)',
                    'Physician / Ärztin · Arzt'
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => onSpeakGerman(term.anamneseQuestion.doctorDe)}
                  className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> DE Audio
                </button>
              </div>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                „{term.anamneseQuestion.doctorDe}“
              </p>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-2.5 border-t border-slate-200/60">
              <strong>EN:</strong> "{term.anamneseQuestion.doctorEn}"
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-800">
                  {t(
                    uiLang,
                    'Patientin / Patient (Umgangssprache)',
                    'Patient Response (Everyday German)',
                    'Patient Response · Patienten-Antwort'
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => onSpeakGerman(term.anamneseQuestion.patientResponseDe)}
                  className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> DE Audio
                </button>
              </div>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                „{term.anamneseQuestion.patientResponseDe}“
              </p>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-2.5 border-t border-slate-200/60">
              <strong>EN:</strong> "{term.anamneseQuestion.patientResponseEn}"
            </p>
          </div>
        </div>
      )}

      {/* Mode 3: Bilingual Arztbrief Snippet & Active Recall Practice */}
      {registerFocus === 'arztbrief' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                {t(
                  uiLang,
                  'Musterformulierung für den Arztbrief / die Epikrise',
                  'Discharge Summary (Arztbrief / Epikrise) Formulation',
                  'Arztbrief Formulation (DE & EN)'
                )}
              </span>
              <button
                type="button"
                onClick={() => onSpeakGerman(term.arztbriefSnippet)}
                className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" /> DE Audio
              </button>
            </div>
            <p className="text-sm text-slate-900 leading-relaxed font-medium">
              {term.arztbriefSnippet}
            </p>
            {arztbriefSnippetEn && (
              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                <strong>EN Translation:</strong> {arztbriefSnippetEn}
              </p>
            )}
          </div>

          <div className="md:col-span-5 flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-900">
              {t(
                uiLang,
                `Schnell-Training: Übersetzen Sie „${term.english}“ (${term.umgangssprache.term}) mit Artikel in die Fachsprache:`,
                `Quick Recall: Translate "${term.english}" (${term.umgangssprache.term}) with German article into Medical German:`,
                `Quick Recall: Write the German specialist term for "${term.english}":`
              )}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userDraftTranslation}
                onChange={(e) => setUserDraftTranslation(e.target.value)}
                placeholder="e.g. die Dyspnoe..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7]"
              />
              <button
                type="button"
                onClick={() => setQuizAnswerRevealed(true)}
                className="px-3.5 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t(uiLang, 'Prüfen', 'Check', 'Check · Prüfen')}
              </button>
            </div>
            {quizAnswerRevealed && (
              <div className="text-xs pt-1 text-slate-700">
                <span className="font-semibold text-[#059669]">
                  ● {t(uiLang, 'Lösung:', 'Answer:', 'Answer / Lösung:')}
                </span>{' '}
                {term.fachbegriff.article} {term.fachbegriff.term} (Lay German:{' '}
                {term.umgangssprache.article} {term.umgangssprache.term})
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
