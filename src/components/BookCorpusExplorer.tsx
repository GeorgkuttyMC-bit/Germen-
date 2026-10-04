import React, { useState } from 'react';
import { Plus, Volume2 } from 'lucide-react';
import {
  BOOK_REFERENCES,
  WORD_BUILDER_PARTS,
  BookSourceId,
  OrganSystemId,
  ORGAN_SYSTEMS,
  MedicalTerm,
  UILanguage,
} from '../data/medicalLexicon';
import { BOOK_ENGLISH_DATA, t } from '../data/bilingualTranslations';

interface BookCorpusExplorerProps {
  activeBookFilter: BookSourceId | 'all';
  onSelectBookFilter: (bookId: BookSourceId | 'all') => void;
  onAddCustomTerm: (newTerm: MedicalTerm) => void;
  onSpeakGerman: (text: string) => void;
  termCountByBook: Record<BookSourceId, number>;
  uiLang: UILanguage;
}

export const BookCorpusExplorer: React.FC<BookCorpusExplorerProps> = ({
  activeBookFilter,
  onSelectBookFilter,
  onAddCustomTerm,
  onSpeakGerman,
  termCountByBook,
  uiLang,
}) => {
  const [selectedBuilderType, setSelectedBuilderType] = useState<'all' | 'prefix' | 'root' | 'suffix'>('all');
  const [externalRefUrl, setExternalRefUrl] = useState('');
  const [newFachTerm, setNewFachTerm] = useState('');
  const [newFachArticle, setNewFachArticle] = useState<'der' | 'die' | 'das'>('die');
  const [newUmgangTerm, setNewUmgangTerm] = useState('');
  const [newUmgangArticle, setNewUmgangArticle] = useState<'der' | 'die' | 'das'>('die');
  const [newEnglish, setNewEnglish] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newBookSource, setNewBookSource] = useState<BookSourceId>('schrimpf');
  const [newOrganSystem, setNewOrganSystem] = useState<OrganSystemId>('thorax_cardio');
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  const filteredMorphology = WORD_BUILDER_PARTS.filter(
    (part) => selectedBuilderType === 'all' || part.type === selectedBuilderType
  );

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFachTerm.trim() || !newUmgangTerm.trim() || !newEnglish.trim()) return;

    const created: MedicalTerm = {
      id: `custom-${Date.now()}`,
      code: 'FSP-EIGEN',
      organSystem: newOrganSystem,
      bookSource: newBookSource,
      chapterRef: externalRefUrl.trim()
        ? `Ref: ${externalRefUrl.trim().slice(0, 38)}`
        : 'Custom Textbook Entry',
      fachbegriff: {
        article: newFachArticle,
        term: newFachTerm.trim(),
        plural: `${newFachArticle} ${newFachTerm.trim()} (Pl.)`,
        ipa: '[Clinical Entry]',
        latinRoot: 'Clinical Nomenclature',
      },
      umgangssprache: {
        article: newUmgangArticle,
        term: newUmgangTerm.trim(),
        patientPhrasing: `„Ich leide unter ${newUmgangTerm.trim()}.“`,
        patientPhrasingEn: `"I am suffering from ${newEnglish.trim().toLowerCase()}."`,
      },
      english: newEnglish.trim(),
      definitionDe:
        newDefinition.trim() ||
        `Klinischer Fachbegriff (${newFachTerm.trim()}) mit deutscher Patientenübersetzung (${newUmgangTerm.trim()}).`,
      definitionEn:
        newDefinition.trim() ||
        `Clinical German specialist term (${newFachTerm.trim()}) corresponding to everyday German (${newUmgangTerm.trim()}) and English (${newEnglish.trim()}).`,
      collocations: [
        {
          german: `Verdacht auf ${newFachTerm.trim()}`,
          english: `Suspected ${newEnglish.trim()}`,
          register: 'Arztbrief',
        },
      ],
      anamneseQuestion: {
        doctorDe: `Seit wann bestehen die Beschwerden im Sinne von ${newUmgangTerm.trim()}?`,
        doctorEn: `How long have the symptoms of ${newEnglish.trim()} been present?`,
        patientResponseDe: `Die Beschwerden (${newUmgangTerm.trim()}) haben vor einigen Tagen begonnen.`,
        patientResponseEn: `The symptoms started a few days ago.`,
      },
      arztbriefSnippet: `Anamnestisch und klinisch zeigten sich Hinweise auf ${newFachArticle} ${newFachTerm.trim()}.`,
      arztbriefSnippetEn: `History and clinical exam showed evidence of ${newEnglish.trim()}.`,
      fspTip: `Achten Sie im Aufklärungsgespräch darauf, den Fachbegriff „${newFachTerm.trim()}“ immer als „${newUmgangTerm.trim()}“ zu erklären.`,
      fspTipEn: `In patient consultations, always explain the specialist term "${newFachTerm.trim()}" using the lay German term "${newUmgangTerm.trim()}".`,
    };

    onAddCustomTerm(created);
    setNewFachTerm('');
    setNewUmgangTerm('');
    setNewEnglish('');
    setNewDefinition('');
    setImportSuccessMsg(
      t(
        uiLang,
        `● Begriff „${created.fachbegriff.article} ${created.fachbegriff.term}“ erfolgreich in das klinische Lexikon aufgenommen.`,
        `● Term "${created.fachbegriff.article} ${created.fachbegriff.term}" (${created.english}) successfully added to the clinical lexicon.`,
        `● Added "${created.fachbegriff.article} ${created.fachbegriff.term}" (${created.english}) to lexicon.`
      )
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Section 1: Curated German Medical Textbooks */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              {t(
                uiLang,
                '01. Deutsche Medizinische Standardwerke & Quellenkorpus',
                '01. German Medical Reference Textbooks & Source Corpus',
                '01. German Medical Textbooks & Source Corpus · Standardwerke'
              )}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {t(
                uiLang,
                'Alle Vokabeln, Kollokationen und Arztbrief-Bausteine basieren auf den sechs führenden deutschen Lehrbüchern für Klinik, Anamnese und Fachsprachprüfung (FSP).',
                'All vocabulary, clinical collocations, and Arztbrief templates are curated from the six leading German medical textbooks for clinical practice and the FSP licensing exam.',
                'Curated from the 6 leading German medical textbooks for hospital practice and the FSP licensing exam.'
              )}
            </p>
          </div>
          {activeBookFilter !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectBookFilter('all')}
              className="px-3.5 py-2 text-xs font-medium text-[#0284C7] bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t(
                uiLang,
                'Buchfilter zurücksetzen (Alle Bücher)',
                'Reset Book Filter (All Books)',
                'Reset Filter · Alle Bücher'
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOOK_REFERENCES.map((book) => {
            const isSelected = activeBookFilter === book.id;
            const count = termCountByBook[book.id] || 0;
            const enBook = BOOK_ENGLISH_DATA[book.id];

            return (
              <div
                key={book.id}
                className={`border rounded-xl p-5 flex flex-col justify-between transition-colors ${
                  isSelected
                    ? 'border-[#0284C7] bg-sky-50/25'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono-tabular mb-2">
                    <span>{book.publisher}</span>
                    <span>·</span>
                    <span>{book.edition}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800">
                      {count} {t(uiLang, 'Einträge', 'Entries', 'Entries')}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug">
                    {book.fullTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {book.authors} · ISBN {book.isbn}
                  </p>

                  {uiLang === 'de' && (
                    <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                      {book.description}
                    </p>
                  )}
                  {uiLang === 'en' && (
                    <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                      {enBook?.descriptionEn || book.description}
                    </p>
                  )}
                  {uiLang === 'bilingual' && (
                    <div className="mt-3 space-y-1.5 text-xs leading-relaxed">
                      <p className="text-slate-800">
                        <strong>DE:</strong> {book.description}
                      </p>
                      {enBook?.descriptionEn && (
                        <p className="text-slate-600">
                          <strong>EN:</strong> {enBook.descriptionEn}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                      {t(
                        uiLang,
                        'Enthaltene Kapitel & Schwerpunkte:',
                        'Included Chapters & Clinical Topics:',
                        'Chapters & Clinical Topics · Kapitel:'
                      )}
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {(uiLang === 'en' && enBook
                        ? enBook.chapterStructureEn
                        : book.chapterStructure
                      ).map((chap, idx) => (
                        <li key={idx} className="truncate">
                          · {chap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 truncate pr-2">
                    {uiLang === 'en' && enBook ? enBook.focusAreaEn : book.focusArea}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectBookFilter(isSelected ? 'all' : book.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0284C7] text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isSelected
                      ? t(uiLang, 'Gefiltert im Lexikon', 'Filtered in Lexicon', 'Active Filter')
                      : t(uiLang, 'Vokabeln filtern', 'Filter Vocabulary', 'Filter Terms')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Greco-Latin & German Clinical Word-Formation Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {t(
                uiLang,
                '02. Medizinische Wortbildungslehre (Präfixe, Wortstämme & Suffixe)',
                '02. Medical Word-Formation Matrix (Prefixes, Roots & Suffixes)',
                '02. Medical Morphology Matrix (DE ↔ EN ↔ Greco-Latin)'
              )}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {t(
                uiLang,
                'Systematische Ableitung nach Pschyrembel & Schrimpf: Wie griechisch-lateinische Bausteine ins deutsche Patientenregister übertragen werden.',
                'Systematic derivation from Pschyrembel & Schrimpf: How Greco-Latin medical roots map to everyday German patient language and English.',
                'How Greco-Latin clinical roots map to everyday German patient language and English.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {(
              [
                { id: 'all', label: t(uiLang, 'Alle Bausteine', 'All Morphemes', 'All · Alle') },
                { id: 'prefix', label: t(uiLang, 'Präfixe', 'Prefixes', 'Prefixes · Präfixe') },
                { id: 'root', label: t(uiLang, 'Wortstämme', 'Organ Roots', 'Roots · Wortstämme') },
                { id: 'suffix', label: t(uiLang, 'Suffixe', 'Suffixes', 'Suffixes · Endungen') },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedBuilderType(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedBuilderType === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredMorphology.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono-tabular mb-1">
                  <span>
                    {item.type === 'prefix'
                      ? 'PREFIX / PRÄFIX'
                      : item.type === 'root'
                      ? 'ROOT / WORTSTAMM'
                      : 'SUFFIX / ENDUNG'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSpeakGerman(`${item.part}. ${item.examples.join('. ')}`)}
                    className="text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> DE Audio
                  </button>
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {item.part}
                </h3>
                <p className="text-xs text-slate-800 mt-1 font-medium">
                  DE: {item.meaningDe}
                </p>
                <p className="text-xs text-[#0284C7] mt-0.5 font-medium">
                  EN: {item.meaningEn}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-1">
                {item.examples.map((ex, i) => (
                  <div key={i} className="text-xs text-slate-700 font-mono-tabular">
                    · {ex}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Custom Link / Textbook Entry Importer */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="border-b border-slate-200 pb-4 mb-5">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            {t(
              uiLang,
              '03. Eigenen Lehrbuch-Begriff oder Referenz-Link ergänzen',
              '03. Add Custom Medical Textbook Term or External Reference Link',
              '03. Add Custom Textbook Term or Reference Link · Begriff ergänzen'
            )}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {t(
              uiLang,
              'Fügen Sie weitere Vokabeln aus Ihrem eigenen Lernmaterial, einem Online-Kompendium (z.B. DocCheck Flexikon, Amboss, Pschyrembel Online) oder einem Lehrbuchkapitel direkt hinzu.',
              'Add custom English-German medical vocabulary from your own study materials, online references (DocCheck Flexikon, Amboss, Pschyrembel), or textbook chapters.',
              'Add custom English-German medical vocabulary from your own textbooks or reference links.'
            )}
          </p>
        </div>

        <form onSubmit={handleImportSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t(
                uiLang,
                'Fachbegriff (Latein / Griechisch / C1) *',
                'Specialist German Term (Fachbegriff) *',
                'Specialist Term (Fachbegriff) *'
              )}
            </label>
            <div className="flex gap-2">
              <select
                value={newFachArticle}
                onChange={(e) => setNewFachArticle(e.target.value as 'der' | 'die' | 'das')}
                className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="der">der</option>
                <option value="die">die</option>
                <option value="das">das</option>
              </select>
              <input
                type="text"
                required
                value={newFachTerm}
                onChange={(e) => setNewFachTerm(e.target.value)}
                placeholder="e.g. Epistaxis"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t(
                uiLang,
                'Deutsche Umgangssprache (Patient) *',
                'Lay German Term (Umgangssprache) *',
                'Lay German (Umgangssprache) *'
              )}
            </label>
            <div className="flex gap-2">
              <select
                value={newUmgangArticle}
                onChange={(e) => setNewUmgangArticle(e.target.value as 'der' | 'die' | 'das')}
                className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="das">das</option>
                <option value="der">der</option>
                <option value="die">die</option>
              </select>
              <input
                type="text"
                required
                value={newUmgangTerm}
                onChange={(e) => setNewUmgangTerm(e.target.value)}
                placeholder="e.g. Nasenbluten"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t(
                uiLang,
                'Englische Übersetzung (Clinical English) *',
                'Clinical English Translation *',
                'Clinical English Translation *'
              )}
            </label>
            <input
              type="text"
              required
              value={newEnglish}
              onChange={(e) => setNewEnglish(e.target.value)}
              placeholder="e.g. Nosebleed / Epistaxis"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t(uiLang, 'Quellenbuch / Lehrbuch', 'Textbook Source', 'Textbook Source · Lehrbuch')}
            </label>
            <select
              value={newBookSource}
              onChange={(e) => setNewBookSource(e.target.value as BookSourceId)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            >
              {BOOK_REFERENCES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.shortTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t(uiLang, 'Organsystem / Fachgebiet', 'Organ System / Specialty', 'Organ System')}
            </label>
            <select
              value={newOrganSystem}
              onChange={(e) => setNewOrganSystem(e.target.value as OrganSystemId)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            >
              {ORGAN_SYSTEMS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nameEn} · {o.nameDe}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t(
                uiLang,
                'Referenz-Link / Buchseite (Optional)',
                'Reference URL / Book Page (Optional)',
                'Reference Link / Page (Optional)'
              )}
            </label>
            <input
              type="text"
              value={externalRefUrl}
              onChange={(e) => setExternalRefUrl(e.target.value)}
              placeholder="https://... or p. 124"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="md:col-span-9">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t(
                uiLang,
                'Klinische Kurzdefinition (Deutsch oder Englisch)',
                'Brief Clinical Definition (German or English)',
                'Clinical Definition (DE or EN)'
              )}
            </label>
            <input
              type="text"
              value={newDefinition}
              onChange={(e) => setNewDefinition(e.target.value)}
              placeholder="e.g. Bleeding from the nasal cavity, most commonly Kiesselbach's plexus..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 text-xs font-medium text-white bg-[#0284C7] hover:bg-sky-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {t(uiLang, 'Zum Lexikon hinzufügen', 'Add to Lexicon', 'Add Term · Hinzufügen')}
              </span>
            </button>
          </div>
        </form>

        {importSuccessMsg && (
          <div className="mt-4 text-xs font-medium text-[#059669]">
            {importSuccessMsg}
          </div>
        )}
      </div>
    </div>
  );
};
