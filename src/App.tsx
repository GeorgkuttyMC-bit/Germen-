import React, { useState, useMemo, useEffect } from 'react';
import { Search, Volume2, Check } from 'lucide-react';
import {
  MEDICAL_TERMS,
  BOOK_REFERENCES,
  MedicalTerm,
  OrganSystemId,
  BookSourceId,
  UILanguage,
} from './data/medicalLexicon';
import { OLESEN_CURRICULUM_WORDS } from './data/olesenCurriculum';
import { TERM_ENGLISH_DATA, t } from './data/bilingualTranslations';
import { AnatomicalStage } from './components/AnatomicalStage';
import { TermInspector } from './components/TermInspector';
import { AnamneseSimulator } from './components/AnamneseSimulator';
import { BookCorpusExplorer } from './components/BookCorpusExplorer';
import { FlashcardTrainer } from './components/FlashcardTrainer';
import { WordByWordGameArena } from './components/WordByWordGameArena';
import { WardSituationsDeepDive } from './components/WardSituationsDeepDive';

type ActiveView = 'game' | 'situations' | 'atlas' | 'books' | 'anamnese' | 'trainer';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('game');
  const [uiLang, setUiLang] = useState<UILanguage>(() => {
    try {
      const savedLang = localStorage.getItem('kliniklexikon_lang_v1') as UILanguage | null;
      if (savedLang === 'bilingual' || savedLang === 'en' || savedLang === 'de') {
        return savedLang;
      }
    } catch {
      // ignore
    }
    return 'bilingual';
  });

  const [terms, setTerms] = useState<MedicalTerm[]>(() => {
    try {
      const savedCustom = localStorage.getItem('kliniklexikon_custom_terms_v1');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom) as MedicalTerm[];
        return [...MEDICAL_TERMS, ...parsed];
      }
    } catch {
      // ignore storage errors
    }
    return MEDICAL_TERMS;
  });

  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kliniklexikon_mastered_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['term-01', 'term-05', 'ol-101'];
  });

  const [selectedSystem, setSelectedSystem] = useState<OrganSystemId | 'all'>('all');
  const [selectedBook, setSelectedBook] = useState<BookSourceId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTermId, setSelectedTermId] = useState<string>(MEDICAL_TERMS[0].id);

  useEffect(() => {
    try {
      localStorage.setItem('kliniklexikon_mastered_v1', JSON.stringify(masteredIds));
    } catch {
      // ignore
    }
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('kliniklexikon_lang_v1', uiLang);
    } catch {
      // ignore
    }
  }, [uiLang]);

  const handleToggleMastered = (termId: string) => {
    setMasteredIds((prev) =>
      prev.includes(termId) ? prev.filter((id) => id !== termId) : [...prev, termId]
    );
  };

  const handleMarkWordMastered = (wordId: string) => {
    setMasteredIds((prev) => (prev.includes(wordId) ? prev : [...prev, wordId]));
  };

  const handleAddCustomTerm = (newTerm: MedicalTerm) => {
    setTerms((prev) => {
      const updated = [newTerm, ...prev];
      const customOnly = updated.filter((tItem) => tItem.id.startsWith('custom-'));
      try {
        localStorage.setItem('kliniklexikon_custom_terms_v1', JSON.stringify(customOnly));
      } catch {
        // ignore
      }
      return updated;
    });
    setSelectedTermId(newTerm.id);
  };

  const handleSpeakGerman = (text: string, slow: boolean = false) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = slow ? 0.72 : 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakEnglish = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.96;
      window.speechSynthesis.speak(utterance);
    }
  };

  const cycleLanguage = () => {
    setUiLang((prev) => {
      if (prev === 'bilingual') return 'en';
      if (prev === 'en') return 'de';
      return 'bilingual';
    });
  };

  const termCountsBySystem = useMemo(() => {
    const counts: Record<OrganSystemId, number> = {
      head_neuro: 0,
      thorax_cardio: 0,
      abdomen_gi: 0,
      urology_renal: 0,
      musculoskeletal: 0,
      derma_vascular: 0,
      general_surgery: 0,
    };
    terms.forEach((tItem) => {
      counts[tItem.organSystem] = (counts[tItem.organSystem] || 0) + 1;
    });
    return counts;
  }, [terms]);

  const termCountByBook = useMemo(() => {
    const counts: Record<BookSourceId, number> = {
      schrimpf: 0,
      thieme_anamnesis: 0,
      elsevier_fsp: 0,
      pschyrembel: 0,
      herold: 0,
      cornelsen: 0,
    };
    terms.forEach((tItem) => {
      counts[tItem.bookSource] = (counts[tItem.bookSource] || 0) + 1;
    });
    return counts;
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter((tItem) => {
      if (selectedSystem !== 'all' && tItem.organSystem !== selectedSystem) return false;
      if (selectedBook !== 'all' && tItem.bookSource !== selectedBook) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const enExtra = TERM_ENGLISH_DATA[tItem.id];
        const matchFach = tItem.fachbegriff.term.toLowerCase().includes(q);
        const matchUmgang = tItem.umgangssprache.term.toLowerCase().includes(q);
        const matchEng = tItem.english.toLowerCase().includes(q);
        const matchDefDe = tItem.definitionDe.toLowerCase().includes(q);
        const matchDefEn = (tItem.definitionEn || enExtra?.definitionEn || '')
          .toLowerCase()
          .includes(q);
        const matchCode = tItem.code.toLowerCase().includes(q);
        return matchFach || matchUmgang || matchEng || matchDefDe || matchDefEn || matchCode;
      }
      return true;
    });
  }, [terms, selectedSystem, selectedBook, searchQuery]);

  const activeTerm = useMemo(() => {
    const found = filteredTerms.find((tItem) => tItem.id === selectedTermId);
    if (found) return found;
    return filteredTerms[0] || terms[0];
  }, [filteredTerms, selectedTermId, terms]);

  const getArticleColor = (article: string) => {
    if (article === 'der') return 'text-[#0284C7] font-semibold';
    if (article === 'die' || article === 'die (Pl.)') return 'text-[#DC2626] font-semibold';
    return 'text-[#059669] font-semibold';
  };

  const masteredGameWords = masteredIds.filter((id) => id.startsWith('ol-'));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: Strictly 1 row, 3 zones (Brand wordmark | 5 nav links | 2 primary actions) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('game');
            }}
            className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            KlinikLexikon
          </a>

          {/* Zone 2: 5 Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveView('game')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'game'
                  ? 'text-slate-900 underline underline-offset-8 decoration-2 decoration-[#0284C7]'
                  : 'hover:text-slate-900'
              }`}
            >
              {t(uiLang, 'Wort-Spiel', 'Word Game', 'Word Game · Spiel')}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('situations')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'situations'
                  ? 'text-slate-900 underline underline-offset-8 decoration-2 decoration-[#0284C7]'
                  : 'hover:text-slate-900'
              }`}
            >
              {t(
                uiLang,
                'Klinik-Dialoge (Pflege & Arzt)',
                'Live Ward Dialogues',
                'Ward Dialogues · Pflege & Arzt'
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('atlas')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'atlas'
                  ? 'text-slate-900 underline underline-offset-8 decoration-2 decoration-[#0284C7]'
                  : 'hover:text-slate-900'
              }`}
            >
              {t(uiLang, 'Klinischer Atlas', 'Clinical Atlas', 'Atlas (EN·DE)')}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('books')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'books'
                  ? 'text-slate-900 underline underline-offset-8 decoration-2 decoration-[#0284C7]'
                  : 'hover:text-slate-900'
              }`}
            >
              {t(uiLang, 'Fachbücher & Wortbau', 'Textbooks', 'Textbooks · Bücher')}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('anamnese')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'anamnese'
                  ? 'text-slate-900 underline underline-offset-8 decoration-2 decoration-[#0284C7]'
                  : 'hover:text-slate-900'
              }`}
            >
              {t(uiLang, 'Anamnese-Labor', 'Anamnesis Lab', 'Anamnesis · Anamnese')}
            </button>
          </nav>

          {/* Zone 3: 2 Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={cycleLanguage}
              className="px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Switch between Bilingual EN+DE, English UI, and German UI"
            >
              {uiLang === 'bilingual'
                ? 'Mode: EN ↔ DE'
                : uiLang === 'en'
                ? 'Mode: English'
                : 'Modus: Deutsch'}
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveView(activeView === 'situations' ? 'game' : 'situations')
              }
              className="px-4 py-2 text-xs font-medium text-white bg-[#0284C7] rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {activeView === 'situations'
                ? t(uiLang, 'Wort-Spiel', 'Play Word Game', 'Play Word Game')
                : t(uiLang, 'Patient & Pflege Dialoge', 'Live Ward Dialogues', 'Ward Dialogues')}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Selector */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-1 overflow-x-auto">
        {(
          [
            { id: 'game', label: 'Word Game' },
            { id: 'situations', label: 'Ward Dialogues' },
            { id: 'atlas', label: 'Atlas' },
            { id: 'books', label: 'Textbooks' },
            { id: 'anamnese', label: 'Anamnesis' },
            { id: 'trainer', label: 'Flashcards' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveView(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeView === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Container (1400px Desktop Presence) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* VIEW 0 (PRIMARY): WORD-BY-WORD MEDICAL GERMAN GAME ARENA */}
        {activeView === 'game' && (
          <WordByWordGameArena
            uiLang={uiLang}
            onSpeakGerman={handleSpeakGerman}
            onSpeakEnglish={handleSpeakEnglish}
            masteredWordIds={masteredGameWords}
            onMarkWordMastered={handleMarkWordMastered}
          />
        )}

        {/* VIEW 0.5: REAL-TIME PATIENT-CAREGIVER & DOCTOR-CAREGIVER SITUATIONS */}
        {activeView === 'situations' && (
          <WardSituationsDeepDive
            uiLang={uiLang}
            onSpeakGerman={handleSpeakGerman}
            onSpeakEnglish={handleSpeakEnglish}
          />
        )}

        {/* VIEW 1: CLINICAL ATLAS & REGISTER TRANSLATOR */}
        {activeView === 'atlas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <AnatomicalStage
                selectedSystem={selectedSystem}
                onSelectSystem={setSelectedSystem}
                termCountsBySystem={termCountsBySystem}
                activeTermOrgan={activeTerm?.organSystem}
                uiLang={uiLang}
              />

              {/* Textbook Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-display text-base font-semibold text-slate-900">
                      {t(
                        uiLang,
                        '02. Nach Deutschem Medizin-Lehrbuch filtern',
                        '02. Filter by German Medical Textbook',
                        '02. Filter by German Medical Textbook · Lehrbuch'
                      )}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t(
                        uiLang,
                        'Wortschatz gezielt nach Standardwerk auswählen',
                        'Isolate vocabulary from specific German clinical reference books',
                        'Select vocabulary by standard German textbook'
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView('books')}
                    className="text-xs font-medium text-[#0284C7] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {t(uiLang, 'Buchdetails', 'Book Details', 'Book Details · Infos')}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedBook('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedBook === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t(uiLang, 'Alle Lehrbücher', 'All Textbooks', 'All Books')} ({terms.length})
                  </button>
                  {BOOK_REFERENCES.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() =>
                        setSelectedBook(selectedBook === book.id ? 'all' : book.id)
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedBook === book.id
                          ? 'bg-[#0284C7] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {book.shortTitle.split(' · ')[0]} ({termCountByBook[book.id] || 0})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Zone (7 cols): Term Inspector + Clinical Lexicon Table */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(
                      uiLang,
                      'Fachbegriff (Dyspnoe), Umgangssprache (Atemnot), Englisch oder ICD-Code suchen...',
                      'Search in English (stroke, heartburn, shortness of breath) or German (Apoplex, Atemnot)...',
                      'Search English (stroke, jaundice) or German (Apoplex, Ikterus, Atemnot)...'
                    )}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#0284C7]"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-tabular shrink-0">
                  <span>
                    {t(uiLang, 'Treffer:', 'Matches:', 'Matches:')} {filteredTerms.length}
                  </span>
                  {(selectedSystem !== 'all' || selectedBook !== 'all' || searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSystem('all');
                        setSelectedBook('all');
                        setSearchQuery('');
                      }}
                      className="text-[#0284C7] hover:underline font-sans font-medium cursor-pointer"
                    >
                      {t(uiLang, 'Zurücksetzen', 'Reset', 'Reset')}
                    </button>
                  )}
                </div>
              </div>

              {activeTerm ? (
                <TermInspector
                  term={activeTerm}
                  isMastered={masteredIds.includes(activeTerm.id)}
                  onToggleMastered={handleToggleMastered}
                  onSpeakGerman={handleSpeakGerman}
                  onSpeakEnglish={handleSpeakEnglish}
                  uiLang={uiLang}
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-slate-600">
                    {t(
                      uiLang,
                      'Keine passenden medizinischen Begriffe für Ihre aktuelle Filterkombination gefunden.',
                      'No matching medical terms found for your current filter selection.',
                      'No matching medical terms found · Keine Begriffe gefunden.'
                    )}
                  </p>
                </div>
              )}

              {/* Synchronized Bilingual Lexicon Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-slate-900">
                      {t(
                        uiLang,
                        '03. Synoptisches Vokabelverzeichnis (Fachsprache ↔ Umgangssprache ↔ Englisch)',
                        '03. Synoptic Bilingual Medical Lexicon (Clinical English ↔ German Specialist & Lay)',
                        '03. Synoptic Bilingual Lexicon (Fachsprache ↔ Umgangssprache ↔ English)'
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t(
                        uiLang,
                        'Wählen Sie eine Zeile zur Anzeige von Arztbrief-Formulierungen, Etymologie und Anamnese-Dialog',
                        'Click any row to inspect bilingual definitions, Arztbrief sentences, and doctor-patient dialogue',
                        'Click any row to inspect bilingual Arztbrief formulations and dialogues'
                      )}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-[#F8FAFC] text-[11px] font-semibold text-slate-600">
                        <th className="py-3 px-4">
                          {t(uiLang, 'Code / Quelle', 'Code / Book', 'Code / Book')}
                        </th>
                        <th className="py-3 px-4">
                          {t(
                            uiLang,
                            'Ärztlicher Fachbegriff (C1)',
                            'Specialist German (Fachbegriff)',
                            'Specialist German (Fachbegriff)'
                          )}
                        </th>
                        <th className="py-3 px-4">
                          {t(
                            uiLang,
                            'Deutsche Umgangssprache',
                            'Lay German (Patient)',
                            'Lay German (Umgangssprache)'
                          )}
                        </th>
                        <th className="py-3 px-4">Clinical English</th>
                        <th className="py-3 px-4 text-right">
                          {t(uiLang, 'Audio / Status', 'Audio / Status', 'Audio / Status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 text-xs">
                      {filteredTerms.map((item) => {
                        const isSelected = activeTerm?.id === item.id;
                        const isMastered = masteredIds.includes(item.id);
                        const bookObj = BOOK_REFERENCES.find((b) => b.id === item.bookSource);

                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedTermId(item.id)}
                            className={`transition-colors cursor-pointer ${
                              isSelected ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 px-4 font-mono-tabular text-slate-500 whitespace-nowrap">
                              <div className="font-medium text-slate-800">{item.code}</div>
                              <div className="text-[11px]">{bookObj?.shortTitle.split(' · ')[0]}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-900">
                                <span className={getArticleColor(item.fachbegriff.article)}>
                                  {item.fachbegriff.article}
                                </span>{' '}
                                {item.fachbegriff.term}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono-tabular">
                                {item.fachbegriff.ipa}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-800">
                                <span className={getArticleColor(item.umgangssprache.article)}>
                                  {item.umgangssprache.article}
                                </span>{' '}
                                {item.umgangssprache.term}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-[#0284C7]">
                              {item.english}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div
                                className="inline-flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSpeakGerman(
                                      `${item.fachbegriff.article} ${item.fachbegriff.term}. ${item.umgangssprache.article} ${item.umgangssprache.term}`
                                    )
                                  }
                                  className="p-1.5 text-slate-500 hover:text-[#0284C7] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                  title="Play German pronunciation"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleMastered(item.id)}
                                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                    isMastered
                                      ? 'text-[#059669] bg-emerald-50'
                                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                  }`}
                                  title="Toggle Mastered"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: GERMAN MEDICAL TEXTBOOKS & MORPHOLOGY BUILDER */}
        {activeView === 'books' && (
          <BookCorpusExplorer
            activeBookFilter={selectedBook}
            onSelectBookFilter={(bookId) => {
              setSelectedBook(bookId);
              if (bookId !== 'all') {
                setActiveView('atlas');
              }
            }}
            onAddCustomTerm={handleAddCustomTerm}
            onSpeakGerman={handleSpeakGerman}
            termCountByBook={termCountByBook}
            uiLang={uiLang}
          />
        )}

        {/* VIEW 3: ANAMNESE & ARZTBRIEF SIMULATOR */}
        {activeView === 'anamnese' && (
          <AnamneseSimulator onSpeakGerman={handleSpeakGerman} uiLang={uiLang} />
        )}

        {/* VIEW 4: FSP FLASHCARD & GENUS TRAINER */}
        {activeView === 'trainer' && (
          <FlashcardTrainer
            terms={terms}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            onSpeakGerman={handleSpeakGerman}
            onSpeakEnglish={handleSpeakEnglish}
            uiLang={uiLang}
          />
        )}
      </main>

      {/* Clean Quiet Editorial Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            KlinikLexikon — Word-by-Word Medical German Game (Olesen Tuition + 6 German Medical Textbooks · FSP Preparation)
          </div>
          <div className="flex items-center gap-4">
            <span>Olesen Tuition · Springer · Thieme · Elsevier · Pschyrembel · Herold</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
