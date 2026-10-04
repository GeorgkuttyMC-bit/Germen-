export type UILanguage = 'bilingual' | 'en' | 'de';

export type OrganSystemId =
  | 'head_neuro'
  | 'thorax_cardio'
  | 'abdomen_gi'
  | 'musculoskeletal'
  | 'urology_renal'
  | 'derma_vascular'
  | 'general_surgery';

export type BookSourceId =
  | 'schrimpf'
  | 'thieme_anamnesis'
  | 'elsevier_fsp'
  | 'pschyrembel'
  | 'herold'
  | 'cornelsen';

export interface BookReference {
  id: BookSourceId;
  shortTitle: string;
  fullTitle: string;
  authors: string;
  publisher: string;
  edition: string;
  isbn: string;
  focusArea: string;
  focusAreaEn?: string;
  description: string;
  descriptionEn?: string;
  chapterStructure: string[];
}

export interface MedicalTerm {
  id: string;
  code: string; // e.g., ICD-10-GM or FSP-Cat code
  organSystem: OrganSystemId;
  bookSource: BookSourceId;
  chapterRef: string; // e.g. "Kapitel 4.2 · Kardiologie (S. 84)"
  // Three clinical registers
  fachbegriff: {
    article: 'der' | 'die' | 'das' | 'die (Pl.)';
    term: string;
    plural: string;
    ipa: string;
    latinRoot: string;
  };
  umgangssprache: {
    article: 'der' | 'die' | 'das' | 'die (Pl.)';
    term: string;
    patientPhrasing: string;
    patientPhrasingEn?: string;
  };
  english: string;
  definitionDe: string;
  definitionEn?: string;
  clinicalAbbreviation?: string;
  collocations: {
    german: string;
    english: string;
    register: 'Arztbrief' | 'Anamnese' | 'Klinischer Befund';
  }[];
  anamneseQuestion: {
    doctorDe: string;
    doctorEn: string;
    patientResponseDe: string;
    patientResponseEn: string;
  };
  arztbriefSnippet: string;
  arztbriefSnippetEn?: string;
  fspTip: string;
  fspTipEn?: string;
}

export interface AnamneseCase {
  id: string;
  caseCode: string;
  title: string;
  patientName: string;
  age: number;
  occupation: string;
  chiefComplaintPatient: string;
  suspectedDiagnosisFach: string;
  bookSource: BookSourceId;
  organSystem: OrganSystemId;
  vitalSigns: {
    bp: string;
    hr: string;
    temp: string;
    spo2: string;
  };
  steps: {
    stepNumber: number;
    phase: string; // e.g., "Aktuelle Anamnese", "Vegetative Anamnese"
    patientStatementDe: string;
    patientStatementEn: string;
    highlightedLayTerm: string;
    targetFachbegriff: string;
    options: {
      id: string;
      fachbegriff: string;
      arztbriefFormulation: string;
      isCorrect: boolean;
      explanation: string;
    }[];
  }[];
}

export interface WordBuilderPart {
  id: string;
  part: string;
  type: 'prefix' | 'root' | 'suffix';
  meaningDe: string;
  meaningEn: string;
  examples: string[];
}

export const BOOK_REFERENCES: BookReference[] = [
  {
    id: 'schrimpf',
    shortTitle: 'Schrimpf · Deutsch für Ärztinnen und Ärzte',
    fullTitle: 'Deutsch für Ärztinnen und Ärzte: Kommunikationstraining für Klinik und Praxis',
    authors: 'Ulrike Schrimpf, Markus Bahnemann',
    publisher: 'Springer Medizin Verlag',
    edition: '5. Auflage',
    isbn: '978-3-662-58044-8',
    focusArea: 'FSP Kommunikation, Anamnesegespräch & Arztbrief',
    description:
      'Standardwerk zur Vorbereitung auf die Fachsprachprüfung der Landesärztekammern mit systematischen Übersetzungstabellen (Latein/Griechisch ↔ Deutsche Umgangssprache) und authentischen Fallbeispielen.',
    chapterStructure: [
      'Kap. 1: Das Anamnesegespräch strukturieren',
      'Kap. 2: Schmerzanamnese & Vegetative Anamnese',
      'Kap. 3: Innere Medizin — Kardiologie, Pneumologie, Gastroenterologie',
      'Kap. 4: Chirurgie, Unfallchirurgie & Orthopädie',
      'Kap. 5: Neurologie & Psychiatrie in der Klinik',
    ],
  },
  {
    id: 'thieme_anamnesis',
    shortTitle: 'Thieme · Checkliste Anamnese & Untersuchung',
    fullTitle: 'Checkliste Anamnese und klinische Untersuchung',
    authors: 'Hermann S. Füeßl, Martin Middeke',
    publisher: 'Georg Thieme Verlag',
    edition: '6. Auflage',
    isbn: '978-3-13-241828-8',
    focusArea: 'Klinische Untersuchung, Befunddokumentation & Leitsymptome',
    description:
      'Klinisches Referenzwerk für den strukturierten Untersuchungsbefund, präzise Fachterminologie bei Inspektion, Palpation, Perkussion und Auskultation.',
    chapterStructure: [
      'Teil A: Grundlagen der ärztlichen Gesprächsführung',
      'Teil B: Leitsymptome und Differentialdiagnosen',
      'Teil C: Organsystembezogene Untersuchung (Kopf bis Fuß)',
    ],
  },
  {
    id: 'elsevier_fsp',
    shortTitle: 'Elsevier · Fachsprachprüfung Medizin',
    fullTitle: 'Fälle Fachsprachprüfung Medizin: 60 realistische Prüfungssimulationen',
    authors: 'Dr. med. Lester T. J.rey, Dr. med. Katharina M. Weber',
    publisher: 'Elsevier / Urban & Fischer',
    edition: '3. Auflage',
    isbn: '978-3-437-41622-4',
    focusArea: 'Arzt-Patienten-Aufklärung & Arzt-Arzt-Übergabe',
    description:
      'Prüfungsorientierte Sammlung der häufigsten FSP-Prüfungsfälle aller deutschen Ärztekammern inklusive Abkürzungsverzeichnis und Patientenaufklärungsbögen.',
    chapterStructure: [
      'Sektion I: Häufige Fachbegriffe für den Patienten übersetzen',
      'Sektion II: Medizinische Abkürzungen im Klinikalltag',
      'Sektion III: 60 klinische Fälle nach Fachgebieten',
    ],
  },
  {
    id: 'pschyrembel',
    shortTitle: 'Pschyrembel · Klinisches Wörterbuch',
    fullTitle: 'Pschyrembel Klinisches Wörterbuch',
    authors: 'Pschyrembel Redaktion (Hrsg.)',
    publisher: 'De Gruyter',
    edition: '269. Auflage',
    isbn: '978-3-11-078334-6',
    focusArea: 'Etymologie, Nomenklatur & ICD-10-GM Klassifikation',
    description:
      'Das traditionsreichste medizinische Nachschlagewerk im deutschen Sprachraum für exakte Definitionen, griechisch-lateinische Wortstämme und klinische Klassifikationen.',
    chapterStructure: [
      'Klinische Terminologie A–Z',
      'Präfixe, Suffixe & Wortstämme der medizinischen Nomenklatur',
      'Normwerte & Klinische Scores',
    ],
  },
  {
    id: 'herold',
    shortTitle: 'Herold · Innere Medizin',
    fullTitle: 'Innere Medizin — Eine vorlesungsorientierte Darstellung',
    authors: 'Gerd Herold und Mitarbeiter',
    publisher: 'Eigenverlag Gerd Herold, Köln',
    edition: 'Ausgabe 2026',
    isbn: '978-3-9821166-4-8',
    focusArea: 'Pathophysiologie, Diagnostik & Epikrise-Stil',
    description:
      'Das unverzichtbare Standardwerk der Inneren Medizin für Assistenzärzte in Deutschland. Liefert den präzisen Telegramm- und Nominalstil für den klinischen Entlassungsbrief.',
    chapterStructure: [
      'Kardiologie & Angiologie',
      'Pneumologie',
      'Gastroenterologie & Hepatologie',
      'Nephrologie & Elektrolythaushalt',
    ],
  },
  {
    id: 'cornelsen',
    shortTitle: 'Cornelsen · Menschen im Beruf Medizin',
    fullTitle: 'Menschen im Beruf – Medizin: Deutsch als Fremdsprache B2/C1',
    authors: 'Dorothee Thommes,Alfred Schmidt',
    publisher: 'Cornelsen / Hueber Verlag',
    edition: '2. Auflage',
    isbn: '978-3-19-301190-9',
    focusArea: 'Grammatik im Arztbrief, Konjunktiv I & Redemittel',
    description:
      'Sprachdidaktisches Lehrwerk speziell für internationale Ärztinnen und Ärzte auf Niveau B2–C1 mit Fokus auf indirekte Rede (Konjunktiv I) und höfliche Patientenkommunikation.',
    chapterStructure: [
      'Modul 1: Indirekte Rede im Anamneseteil (Konjunktiv I)',
      'Modul 2: Aufklärungsgespräche über diagnostische Eingriffe',
      'Modul 3: Interprofessionelle Übergabe mit Pflege & Oberarzt',
    ],
  },
];

export const ORGAN_SYSTEMS: {
  id: OrganSystemId;
  nameDe: string;
  nameFach: string;
  nameEn: string;
  coordinates: { x: number; y: number };
}[] = [
  {
    id: 'head_neuro',
    nameDe: 'Kopf, Hals & Nervensystem',
    nameFach: 'Neurologie, HNO & Ophthalmologie',
    nameEn: 'Head, Neck & Neurology',
    coordinates: { x: 50, y: 14 },
  },
  {
    id: 'thorax_cardio',
    nameDe: 'Brustkorb, Herz & Lunge',
    nameFach: 'Kardiologie & Pneumologie',
    nameEn: 'Thorax, Cardiovascular & Pulmonary',
    coordinates: { x: 50, y: 32 },
  },
  {
    id: 'abdomen_gi',
    nameDe: 'Bauchraum & Verdauungstrakt',
    nameFach: 'Gastroenterologie & Viszeralchirurgie',
    nameEn: 'Abdomen & Gastroenterology',
    coordinates: { x: 50, y: 47 },
  },
  {
    id: 'urology_renal',
    nameDe: 'Nieren, Harnwege & Stoffwechsel',
    nameFach: 'Nephrologie, Urologie & Endokrinologie',
    nameEn: 'Renal, Urology & Endocrine',
    coordinates: { x: 58, y: 55 },
  },
  {
    id: 'musculoskeletal',
    nameDe: 'Bewegungsapparat & Knochen',
    nameFach: 'Orthopädie & Unfallchirurgie',
    nameEn: 'Musculoskeletal & Trauma',
    coordinates: { x: 34, y: 68 },
  },
  {
    id: 'derma_vascular',
    nameDe: 'Gefäßsystem, Haut & Lymphe',
    nameFach: 'Angiologie, Phlebologie & Dermatologie',
    nameEn: 'Vascular, Skin & Lymphatics',
    coordinates: { x: 67, y: 74 },
  },
  {
    id: 'general_surgery',
    nameDe: 'Perioperative Medizin & Leitsymptome',
    nameFach: 'Allgemeinmedizin, Anästhesie & Notaufnahme',
    nameEn: 'General Clinical & Emergency Symptoms',
    coordinates: { x: 28, y: 36 },
  },
];

export const MEDICAL_TERMS: MedicalTerm[] = [
  // HEAD & NEUROLOGY
  {
    id: 'term-01',
    code: 'R55 / FSP-N01',
    organSystem: 'head_neuro',
    bookSource: 'schrimpf',
    chapterRef: 'Kap. 5.1 · Neurologische Leitsymptome (S. 142)',
    fachbegriff: {
      article: 'die',
      term: 'Synkope',
      plural: 'die Synkopen',
      ipa: '[zʏŋˈkoːpə]',
      latinRoot: 'griech. synkopē (Zusammenstoßen, plötzlicher Kraftverlust)',
    },
    umgangssprache: {
      article: 'die',
      term: 'Ohnmacht / der Kreislaufkollaps',
      patientPhrasing: '„Mir ist plötzlich schwarz vor Augen geworden und ich bin kurz umgekippt.“',
    },
    english: 'Syncope / Fainting spell',
    definitionDe:
      'Plötzlich einsetzende, kurz andauernde und spontan reversible Bewusstlosigkeit infolge einer globalen zerebralen Minderperfusion mit Verlust des Haltungstonus.',
    clinicalAbbreviation: 'Z.n. Synkope',
    collocations: [
      {
        german: 'eine vasovagale Synkope erleiden',
        english: 'to suffer a vasovagal syncope',
        register: 'Arztbrief',
      },
      {
        german: 'präsynkopale Prodromi (Schwindel, Schwarzwerden vor den Augen)',
        english: 'presyncopal prodromes (dizziness, vision going black)',
        register: 'Klinischer Befund',
      },
      {
        german: 'Ist Ihnen kurz schwarz vor Augen geworden?',
        english: 'Did your vision briefly go black?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Können Sie sich an den Moment erinnern, bevor Sie das Bewusstsein verloren haben, oder gab es Vorboten?',
      doctorEn: 'Can you remember the moment before you lost consciousness, or were there warning signs?',
      patientResponseDe: 'Mir wurde beim Aufstehen plötzlich schwindelig und schwarz vor Augen, danach bin ich auf dem Flurboden aufgewacht.',
      patientResponseEn: 'I suddenly felt dizzy and my vision went black when standing up; afterwards I woke up on the hallway floor.',
    },
    arztbriefSnippet:
      'Die stationäre Aufnahme erfolgte nach erstmaligem Auftreten einer kurzzeitigen orthostatischen Synkope ohne Hinweis auf ein postiktales Dämmerstadium.',
    fspTip:
      'Im Arztbrief strikt zwischen „Synkope“ (mit komplettem Bewusstseinsverlust) und „Präsynkope / Kollapsneigung“ (ohne Bewusstseinsverlust) differenzieren. Nutzen Sie Konjunktiv I: „Der Patient gibt an, ihm sei schwarz vor Augen geworden.“',
  },
  {
    id: 'term-02',
    code: 'I63.9 / FSP-N02',
    organSystem: 'head_neuro',
    bookSource: 'elsevier_fsp',
    chapterRef: 'Fall 18 · Apoplektischer Insult (S. 96)',
    fachbegriff: {
      article: 'der',
      term: 'Apoplex / der zerebrale Insult',
      plural: 'die Apoplexe / die Insulte',
      ipa: '[apoˈplɛks]',
      latinRoot: 'griech. apoplēxia (Schlag, Lähmung durch Schlag)',
    },
    umgangssprache: {
      article: 'der',
      term: 'Schlaganfall / der Hirnschlag',
      patientPhrasing: '„Mein linker Arm war plötzlich wie taub und ich konnte die Wörter nicht mehr richtig aussprechen.“',
    },
    english: 'Cerebrovascular accident (CVA) / Stroke',
    definitionDe:
      'Akut auftretendes fokales neurologisches Defizit vaskulärer Genese, verursacht durch eine zerebrale Ischämie (ca. 85 %) oder eine intrazerebrale Blutung (ca. 15 %).',
    clinicalAbbreviation: 'MCA-Insult / TIA',
    collocations: [
      {
        german: 'ischämischer Mediainfarkt rechts mit Hemiparese links',
        english: 'right ischemic MCA infarction with left hemiparesis',
        register: 'Arztbrief',
      },
      {
        german: 'systemische Thrombolysetherapie im Lyse-Zeitfenster',
        english: 'systemic thrombolysis within the therapeutic window',
        register: 'Klinischer Befund',
      },
      {
        german: 'Hängt ein Mundwinkel herab oder fällt das Sprechen schwer?',
        english: 'Is one corner of the mouth drooping or is speaking difficult?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Wann genau haben die Sprachstörungen und die Schwäche im linken Arm begonnen?',
      doctorEn: 'When exactly did the speech difficulties and weakness in the left arm begin?',
      patientResponseDe: 'Vor genau einer Stunde beim Frühstück ist mir die Kaffeetasse aus der linken Hand gefallen.',
      patientResponseEn: 'Exactly one hour ago during breakfast, the coffee cup fell out of my left hand.',
    },
    arztbriefSnippet:
      'Klinisch-neurologisch zeigte sich bei Aufnahme eine brachiofazial betonte Hemiparese links (Kraftgrad 3/5) sowie eine mittelgradige Dysarthrie bei V.a. akuten Mediainfarkt.',
    fspTip:
      'Fragen Sie bei Verdacht auf Apoplex oder TIA in der FSP immer nach dem exakten Symptombeginn („Time is Brain“ / Lyse-Zeitfenster < 4,5 Stunden) sowie nach der Einnahme von Antikoagulanzien.',
  },
  {
    id: 'term-03',
    code: 'R42 / FSP-N03',
    organSystem: 'head_neuro',
    bookSource: 'thieme_anamnesis',
    chapterRef: 'Teil B · Leitsymptom Schwindel (S. 64)',
    fachbegriff: {
      article: 'die',
      term: 'Vertigo',
      plural: 'die Vertigines (selten)',
      ipa: '[vɛʁˈtiːɡo]',
      latinRoot: 'lat. vertere (drehen, wenden)',
    },
    umgangssprache: {
      article: 'der',
      term: 'Schwindel (Dreh- oder Schwankschwindel)',
      patientPhrasing: '„Alles dreht sich wie im Karussell, besonders wenn ich den Kopf im Bett umdrehe.“',
    },
    english: 'Vertigo / Dizziness',
    definitionDe:
      'Wahrnehmung einer Scheinbewegung zwischen dem eigenen Körper und der Umwelt oder unangenehme Störung der räumlichen Orientierung (vestibulär vs. nicht-vestibulär).',
    clinicalAbbreviation: 'BPLS',
    collocations: [
      {
        german: 'benigner paroxysmaler Lagerungsschwindel (BPLS)',
        english: 'benign paroxysmal positional vertigo (BPPV)',
        register: 'Arztbrief',
      },
      {
        german: 'Spontannystagmus mit rotatorischer Komponente',
        english: 'spontaneous nystagmus with rotatory component',
        register: 'Klinischer Befund',
      },
      {
        german: 'Ist Ihnen schwindelig wie im Karussell oder wie auf einem Schiff?',
        english: 'Do you feel dizzy like on a carousel or like on a boat?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Empfinden Sie den Schwindel eher als Drehschwindel wie im Karussell oder als Schwankschwindel wie auf einem Boot?',
      doctorEn: 'Do you experience the dizziness more as spinning vertigo like a carousel or swaying like on a boat?',
      patientResponseDe: 'Wie im Karussell! Sobald ich mich im Bett nach rechts drehe, rast das ganze Zimmer für 30 Sekunden.',
      patientResponseEn: 'Like a carousel! As soon as I turn to the right in bed, the whole room spins for 30 seconds.',
    },
    arztbriefSnippet:
      'Der Patient klagt über seit drei Tagen bestehenden, attackenartig auftretenden, lagerungsabhängigen Drehschwindel von Sekunden-Dauer, begleitet von Nausea.',
    fspTip:
      'In der FSP-Prüfung punktet die klassische Differenzierungsfrage: „Karussell (Drehschwindel → oft peripher-vestibulär) oder Boot (Schwankschwindel → oft zentral/kardiovaskulär)?“',
  },
  {
    id: 'term-04',
    code: 'R13 / FSP-N04',
    organSystem: 'head_neuro',
    bookSource: 'pschyrembel',
    chapterRef: 'Nomenklatur D · Dysphagie (S. 418)',
    fachbegriff: {
      article: 'die',
      term: 'Dysphagie',
      plural: 'die Dysphagien',
      ipa: '[dʏsfaˈɡiː]',
      latinRoot: 'griech. dys- (Fehl-/Störung) + phagein (essen, schlucken)',
    },
    umgangssprache: {
      article: 'die',
      term: 'Schluckstörung / die Schluckbeschwerden',
      patientPhrasing: '„Das feste Essen bleibt mir regelrecht hinter dem Brustbein im Hals stecken.“',
    },
    english: 'Dysphagia / Swallowing difficulty',
    definitionDe:
      'Störung des Schluckaktes in der oralen, pharyngealen oder ösophagealen Phase, häufig verbunden mit Regurgitation oder Aspirationsgefahr (mit Schmerzen = Odynophagie).',
    clinicalAbbreviation: 'FEES',
    collocations: [
      {
        german: 'progrediente Dysphagie zunächst für feste, später für flüssige Speisen',
        english: 'progressive dysphagia initially for solids, later for liquids',
        register: 'Arztbrief',
      },
      {
        german: 'Odynophagie (schmerzhaftes Schlucken) bei Tonsillitis',
        english: 'odynophagia (painful swallowing) in tonsillitis',
        register: 'Klinischer Befund',
      },
      {
        german: 'Verschlucken Sie sich häufig beim Trinken oder müssen Sie dabei husten?',
        english: 'Do you frequently choke when drinking or have to cough?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Treten die Schluckbeschwerden eher bei fester Nahrung wie Brot und Fleisch auf, oder auch schon beim Trinken von Wasser?',
      doctorEn: 'Do the swallowing difficulties occur mainly with solid food like bread and meat, or also when drinking water?',
      patientResponseDe: 'Am Anfang ging Fleisch kaum noch herunter, mittlerweile muss ich sogar bei Suppe ständig nachtrinken.',
      patientResponseEn: 'At first meat barely went down, now I even have to constantly drink water with soup.',
    },
    arztbriefSnippet:
      'Anamnestisch besteht seit sechs Wochen eine progrediente Dysphagie für feste Speisen sowie ein ungewollter Gewichtsverlust von 6 kg (B-Symptomatik).',
    fspTip:
      'Unterscheiden Sie präzise: „Dysphagie“ = mechanische oder neurogene Schluckstörung; „Odynophagie“ = Schmerzen beim Schlucken.',
  },

  // THORAX, CARDIOLOGY & PULMONOLOGY
  {
    id: 'term-05',
    code: 'R06.0 / FSP-T01',
    organSystem: 'thorax_cardio',
    bookSource: 'herold',
    chapterRef: 'Kardiologie · Herzinsuffizienz & NYHA-Stadien (S. 214)',
    fachbegriff: {
      article: 'die',
      term: 'Dyspnoe (Belastungs- / Ruhedyspnoe)',
      plural: 'die Dyspnoen',
      ipa: '[dʏsˈpnoːə]',
      latinRoot: 'griech. dys- (schlecht, schwer) + pnoē (Atmung, Hauch)',
    },
    umgangssprache: {
      article: 'die',
      term: 'Atemnot / die Luftnot / die Kurzatmigkeit',
      patientPhrasing: '„Nach einem Stockwerk Treppensteigen bekomme ich kaum noch Luft und muss stehen bleiben.“',
    },
    english: 'Dyspnea / Shortness of breath',
    definitionDe:
      'Subjektives Empfinden einer erschwerten Atmung oder eines Lufthungers, objektiv oft begleitet von Tachypnoe, Einsatz der Atemhilfsmuskulatur oder Orthopnoe.',
    clinicalAbbreviation: 'NYHA I–IV',
    collocations: [
      {
        german: 'progrediente Belastungsdyspnoe (aktuell NYHA-Stadium III)',
        english: 'progressive exertional dyspnea (currently NYHA class III)',
        register: 'Arztbrief',
      },
      {
        german: 'Orthopnoe (Patient schläft mit drei Kopfkissen)',
        english: 'orthopnea (patient sleeps propped up on three pillows)',
        register: 'Klinischer Befund',
      },
      {
        german: 'Wie viele Etagen können Sie ohne Pause die Treppe hinaufsteigen?',
        english: 'How many flights of stairs can you climb without stopping?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Tritt die Luftnot nur bei körperlicher Anstrengung wie beim Treppensteigen auf, oder auch nachts im flachen Liegen?',
      doctorEn: 'Does the shortness of breath occur only during physical exertion like climbing stairs, or also at night when lying flat?',
      patientResponseDe: 'Schon nach einer halben Etage bin ich außer Puste, und nachts brauche ich inzwischen drei Kissen, um Luft zu bekommen.',
      patientResponseEn: 'After just half a flight of stairs I am out of breath, and at night I now need three pillows to breathe.',
    },
    arztbriefSnippet:
      'Die Vorstellung erfolgte bei kardialer Dekompensation mit ausgeprägter Belastungsdyspnoe (NYHA III), nächtlicher Orthopnoe sowie prätibialen Unterschenkelödemen beidseits.',
    fspTip:
      'Erfragen Sie bei „Luftnot“ immer die Anzahl der Kopfkissen beim Schlafen — im Arztbrief wird dies als „Orthopnoe“ dokumentiert.',
  },
  {
    id: 'term-06',
    code: 'I20.0 / FSP-T02',
    organSystem: 'thorax_cardio',
    bookSource: 'schrimpf',
    chapterRef: 'Kap. 3.1 · Kardiologie — Akutes Koronarsyndrom (S. 78)',
    fachbegriff: {
      article: 'die',
      term: 'Angina pectoris (Stenokardie)',
      plural: 'die Stenokardien',
      ipa: '[aŋˈɡiːna ˈpɛktoʁɪs]',
      latinRoot: 'lat. angere (verengen) + pectus (Brust)',
    },
    umgangssprache: {
      article: 'die',
      term: 'Brustenge / das Engegefühl in der Brust',
      patientPhrasing: '„Es fühlt sich an, als würde mir ein schwerer Stein oder ein eiserner Ring auf dem Brustkorb liegen.“',
    },
    english: 'Angina pectoris / Chest tightness',
    definitionDe:
      'Anfallsartiger retrosternaler Schmerz oder vernichtendes Druck- und Engegefühl infolge einer akuten Myokardischämie bei koronarer Herzkrankheit (KHK).',
    clinicalAbbreviation: 'AP / ACS / KHK',
    collocations: [
      {
        german: 'retrosternales Druckgefühl mit Ausstrahlung in den linken Arm und Unterkiefer',
        english: 'retrosternal pressure radiating into the left arm and mandible',
        register: 'Arztbrief',
      },
      {
        german: 'prompte Beschwerdebesserung nach sublingualer Nitroglycerin-Gabe',
        english: 'prompt symptom relief after sublingual nitroglycerin administration',
        register: 'Klinischer Befund',
      },
      {
        german: 'Strahlt der Druck hinter dem Brustbein in die linke Schulter oder den Kiefer aus?',
        english: 'Does the pressure behind the breastbone radiate into your left shoulder or jaw?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Können Sie den Schmerz im Brustkorb genauer beschreiben: Ist er eher stechend und atemabhängig oder drückend und einschnürend?',
      doctorEn: 'Can you describe the pain in your chest more closely: is it stabbing and breathing-dependent, or pressing and constricting?',
      patientResponseDe: 'Es drückt massiv hinter dem Brustbein, wie ein Schraubstock, und zieht bis in die linke Schulter und den Hals.',
      patientResponseEn: 'It presses massively behind the breastbone, like a vise, and pulls into my left shoulder and neck.',
    },
    arztbriefSnippet:
      'Bei Aufnahme schilderte der Patient seit zwei Stunden persistierende, progrediente Stenokardien (NRS 8/10) mit Ausstrahlung in die linke obere Extremität sowie vegetative Begleitsymptomatik (Kaltschweißigkeit, Nausea).',
    fspTip:
      'Nutzen Sie im Arztbrief das Synonym „Stenokardien“ für Angina-pectoris-Beschwerden. Fragen Sie in der Schmerzanamnese immer nach der numerischen Rating-Skala (NRS 0–10).',
  },
  {
    id: 'term-07',
    code: 'R04.2 / FSP-T03',
    organSystem: 'thorax_cardio',
    bookSource: 'elsevier_fsp',
    chapterRef: 'Fall 09 · Bronchialkarzinom & Pneumonie (S. 54)',
    fachbegriff: {
      article: 'die',
      term: 'Hämoptyse (bzw. Hämoptoe)',
      plural: 'die Hämoptysen',
      ipa: '[hɛmoˈptyːzə]',
      latinRoot: 'griech. haima (Blut) + ptyein (spucken)',
    },
    umgangssprache: {
      article: 'der',
      term: 'Bluthusten / der blutige Auswurf',
      patientPhrasing: '„Beim Abhusten heute Morgen waren plötzlich rote Blutstreifen im Schleim.“',
    },
    english: 'Hemoptysis / Coughing up blood',
    definitionDe:
      'Abhusten von blutig tingiertem Sputum (Hämoptyse) oder größeren Mengen reinen Blutes (Hämoptoe) aus den unteren Atemwegen oder dem Lungenparenchym.',
    clinicalAbbreviation: 'Sputum sanguinolent',
    collocations: [
      {
        german: 'produktiver Husten mit sanguinolentem Sputum (Hämoptysen)',
        english: 'productive cough with blood-tinged sputum (hemoptysis)',
        register: 'Arztbrief',
      },
      {
        german: 'Nikotinabusus von kumulativ 40 pack years (py)',
        english: 'nicotine abuse of cumulatively 40 pack years',
        register: 'Klinischer Befund',
      },
      {
        german: 'Haben Sie beim Husten Auswurf, und welche Farbe hat dieser?',
        english: 'Do you bring up phlegm when coughing, and what color is it?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Ist der Husten trocken oder haben Sie Auswurf, und haben Sie darin jemals Blutbeimengungen bemerkt?',
      doctorEn: 'Is the cough dry or do you have sputum, and have you ever noticed blood mixed in it?',
      patientResponseDe: 'Ich huste morgens immer gelblichen Schleim ab, aber seit drei Tagen sind dort hellrote Blutfäden dabei.',
      patientResponseEn: 'I always cough up yellowish mucus in the morning, but for three days there have been bright red threads of blood in it.',
    },
    arztbriefSnippet:
      'Der 62-jährige Patient (Nikotinanamnese: 45 pack years) stellt sich wegen seit zwei Wochen bestehender Hämoptysen, Nachtschweiß und ungewollter Gewichtsabnahme zur bronchoskopischen Abklärung vor.',
    fspTip:
      'Nicht verwechseln: „Hämoptyse“ = Bluthusten (Atemwege/Lunge) vs. „Hämatemesis“ = Bluterbrechen (oberer Gastrointestinaltrakt).',
  },

  // ABDOMEN & GASTROENTEROLOGY
  {
    id: 'term-08',
    code: 'R12 / FSP-G01',
    organSystem: 'abdomen_gi',
    bookSource: 'cornelsen',
    chapterRef: 'Modul 1 · Gastroenterologische Anamnese (S. 38)',
    fachbegriff: {
      article: 'die',
      term: 'Pyrosis (gastroösophagealer Reflux)',
      plural: 'die Pyrosen (selten)',
      ipa: '[pyˈʁoːzɪs]',
      latinRoot: 'griech. pyrōsis (das Brennen, Entzündung durch Feuer)',
    },
    umgangssprache: {
      article: 'das',
      term: 'Sodbrennen / das saure Aufstoßen',
      patientPhrasing: '„Nach fettigem Essen oder Kaffee brennt es mir hinter dem Brustbein bis hoch in den Rachen.“',
    },
    english: 'Pyrosis / Heartburn / Acid reflux',
    definitionDe:
      'Brennender, vom Epigastrium hinter dem Sternum bis in den Pharynx aufsteigender Schmerz durch Rückfluss von saurem Mageninhalt in den Ösophagus.',
    clinicalAbbreviation: 'GERD / ÖGD',
    collocations: [
      {
        german: 'postprandiale Pyrosis und saure Regurgitationen im Liegen',
        english: 'postprandial heartburn and acid regurgitation when lying down',
        register: 'Arztbrief',
      },
      {
        german: 'Ösophagogastroduodenoskopie (ÖGD) zum Ausschluss einer Refluxösophagitis',
        english: 'esophagogastroduodenoscopy (EGD) to rule out reflux esophagitis',
        register: 'Klinischer Befund',
      },
      {
        german: 'Leiden Sie nach dem Essen oder nachts im Liegen unter Sodbrennen?',
        english: 'Do you suffer from heartburn after eating or at night when lying down?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Verstärkt sich das brennende Gefühl hinter dem Brustbein, wenn Sie sich nach dem Essen flach hinlegen oder bücken?',
      doctorEn: 'Does the burning sensation behind the breastbone worsen when you lie flat or bend over after eating?',
      patientResponseDe: 'Ja, besonders abends nach einem späten Essen steigt mir richtig bittere Magensäure in den Mund auf.',
      patientResponseEn: 'Yes, especially in the evening after a late meal, bitter stomach acid rises right into my mouth.',
    },
    arztbriefSnippet:
      'Anamnestisch bestehen seit mehreren Monaten rezidivierende postprandiale Pyrosis sowie nächtliche Regurgitationen; unter probatorischer PPI-Therapie (Pantoprazol 40 mg) zeigte sich eine deutliche Regredienz.',
    fspTip:
      'Erklären Sie dem Patienten in der FSP niemals „Wir machen eine ÖGD“, sondern übersetzen Sie patientengerecht: „Wir führen eine Magenspiegelung mit einer dünnen Kamera über die Speiseröhre durch.“',
  },
  {
    id: 'term-09',
    code: 'K92.1 / FSP-G02',
    organSystem: 'abdomen_gi',
    bookSource: 'herold',
    chapterRef: 'Gastroenterologie · Gastrointestinale Blutung (S. 462)',
    fachbegriff: {
      article: 'die',
      term: 'Meläna',
      plural: 'die Meläna (Singularetantum)',
      ipa: '[meˈlɛːna]',
      latinRoot: 'griech. melaina nosos (schwarze Krankheit)',
    },
    umgangssprache: {
      article: 'der',
      term: 'Teerstuhl / der pechschwarze Stuhlgang',
      patientPhrasing: '„Mein Stuhlgang ist seit gestern glänzend tiefschwarz wie Teer und riecht extrem übel.“',
    },
    english: 'Melena / Tarry black stool',
    definitionDe:
      'Glänzend schwarzer, klebriger und charakteristisch fötid riechender Stuhl durch Hämatinbildung bei Kontakt von Hämoglobin mit Magensäure (obere GI-Blutung).',
    clinicalAbbreviation: 'oGIB',
    collocations: [
      {
        german: 'Absetzen von Meläna bei Verdacht auf obere gastrointestinale Blutung (oGIB)',
        english: 'passage of melena with suspected upper GI bleeding',
        register: 'Arztbrief',
      },
      {
        german: 'Abgrenzung zur Hämatochezie (frisches, hellrotes Blut im Stuhl)',
        english: 'differentiation from hematochezia (fresh, bright red blood in stool)',
        register: 'Klinischer Befund',
      },
      {
        german: 'Haben Sie schwarzen Stuhlgang bemerkt oder nehmen Sie Eisentabletten ein?',
        english: 'Have you noticed black stool or are you taking iron tablets?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Hat sich die Farbe Ihres Stuhlgangs in den letzten Tagen verändert — war er beispielsweise ungewöhnlich dunkel oder schwarz?',
      doctorEn: 'Has the color of your stool changed in recent days — for example, was it unusually dark or black?',
      patientResponseDe: 'Ja, seit zwei Tagen ist der Stuhl pechschwarz, glänzend und riecht ganz streng. Eisentabletten nehme ich keine.',
      patientResponseEn: 'Yes, for two days the stool has been pitch black, shiny, and smells very strong. I do not take iron pills.',
    },
    arztbriefSnippet:
      'Bei langjährigem NSAR-Abusus (Ibuprofen 3×600 mg/d wegen Gonarthrose) stellte sich der Patient mit epigastrischem Druckschmerz, Meläna und einer normozytären Anämie (Hb 8,4 g/dl) vor.',
    fspTip:
      'Wichtige FSP-Fangfrage des Prüfers: „Wann ist schwarzer Stuhl keine Meläna?“ → Nach Einnahme von Eisenpräparaten, Aktivkohle oder großen Mengen Heidelbeeren/Lakritz.',
  },
  {
    id: 'term-10',
    code: 'R17 / FSP-G03',
    organSystem: 'abdomen_gi',
    bookSource: 'thieme_anamnesis',
    chapterRef: 'Teil B · Leitsymptom Ikterus & Cholestase (S. 112)',
    fachbegriff: {
      article: 'der',
      term: 'Ikterus (mit Sklerenikterus)',
      plural: 'die Ikteri (selten)',
      ipa: '[ˈɪktəʁʊs]',
      latinRoot: 'griech. ikteros (Gelbsucht, gelber Vogel Pirol)',
    },
    umgangssprache: {
      article: 'die',
      term: 'Gelbsucht / die Gelbfärbung der Haut und Augen',
      patientPhrasing: '„Meiner Frau ist aufgefallen, dass das Weiße in meinen Augen und meine Haut ganz gelb geworden sind.“',
    },
    english: 'Jaundice / Icterus',
    definitionDe:
      'Gelbfärbung von Haut, Schleimhäuten und zuerst der Skleren (ab Serum-Bilirubin > 2 mg/dl) infolge einer prä-, intra- oder posthepatischen Hyperbilirubinämie.',
    clinicalAbbreviation: 'ERCP / Choledocholithiasis',
    collocations: [
      {
        german: 'schmerzloser Ikterus mit acholischem (entfärbtem) Stuhl und bierbraunem Urin',
        english: 'painless jaundice with acholic (pale) stool and dark beer-brown urine',
        register: 'Arztbrief',
      },
      {
        german: 'deutlicher Sklerenikterus und ausgeprägter Pruritus (Juckreiz)',
        english: 'marked scleral icterus and pronounced pruritus (itching)',
        register: 'Klinischer Befund',
      },
      {
        german: 'Ist Ihr Urin in letzter Zeit dunkler und der Stuhl heller als sonst?',
        english: 'Has your urine recently been darker and your stool lighter than usual?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Ist Ihnen neben der Gelbfärbung der Augen auch aufgefallen, dass Ihr Urin sehr dunkel und Ihr Stuhlgang fast weißlich-hell ist?',
      doctorEn: 'Besides the yellowing of your eyes, have you also noticed that your urine is very dark and your stool is almost whitish-pale?',
      patientResponseDe: 'Genau, der Urin sieht aus wie dunkles Bier und der Stuhl ist lehmfarben. Außerdem juckt meine Haut am ganzen Körper.',
      patientResponseEn: 'Exactly, the urine looks like dark beer and the stool is clay-colored. Also my skin itches all over.',
    },
    arztbriefSnippet:
      'Klinisch imponierte ein ausgeprägter Haut- und Sklerenikterus bei posthepatischer Cholestase (Gesamt-Bilirubin 9,8 mg/dl) infolge einer sonographisch gesicherten Choledocholithiasis.',
    fspTip:
      'Merken Sie sich die klassische Trias bei posthepatischem Verschlussikterus für den Arztbrief: 1. Skleren-/Hautikterus, 2. acholischer (entfärbter) Stuhl, 3. bierbrauner Urin (+ ggf. Pruritus).',
  },
  {
    id: 'term-11',
    code: 'K35.8 / FSP-G04',
    organSystem: 'abdomen_gi',
    bookSource: 'schrimpf',
    chapterRef: 'Kap. 4.1 · Viszeralchirurgie — Akutes Abdomen (S. 108)',
    fachbegriff: {
      article: 'die',
      term: 'Appendizitis',
      plural: 'die Appendizitiden',
      ipa: '[apɛndiˈt͡siːtɪs]',
      latinRoot: 'lat. appendix vermiformis (Wurmfortsatz) + -itis (Entzündung)',
    },
    umgangssprache: {
      article: 'die',
      term: 'Blinddarmentzündung',
      patientPhrasing: '„Der Bauchschmerz hat gestern um den Bauchnabel angefangen und sitzt jetzt messerscharf rechts unten.“',
    },
    english: 'Appendicitis',
    definitionDe:
      'Akute Entzündung des Wurmfortsatzes (Appendix vermiformis) des Zökums mit charakteristischer Schmerzwanderung vom Epigastrium/Periumbilikalbereich in den rechten Unterbauch.',
    clinicalAbbreviation: 'Z.n. Appendektomie (AE)',
    collocations: [
      {
        german: 'Druckschmerz am McBurney- und Lanz-Punkt sowie positiver Loslassschmerz (Blumberg-Zeichen)',
        english: 'tenderness at McBurney and Lanz points plus positive rebound tenderness (Blumberg sign)',
        register: 'Arztbrief',
      },
      {
        german: 'lokale Abwehrspannung im rechten Unterbauch',
        english: 'localized guarding in the right lower quadrant',
        register: 'Klinischer Befund',
      },
      {
        german: 'Ist der Schmerz vom Bauchnabel in den rechten Unterbauch gewandert?',
        english: 'Did the pain migrate from the belly button to the right lower abdomen?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Wo genau haben die Bauchschmerzen gestern begonnen, und hat sich der Ort des Schmerzes seitdem verlagert?',
      doctorEn: 'Where exactly did the abdominal pain begin yesterday, and has the location of the pain shifted since then?',
      patientResponseDe: 'Gestern Morgen war es ein dumpfer Schmerz rund um den Bauchnabel, aber seit heute Nacht sticht es extrem im rechten Unterbauch.',
      patientResponseEn: 'Yesterday morning it was a dull pain around my belly button, but since tonight it stabs extremely in my right lower belly.',
    },
    arztbriefSnippet:
      'Palpatorisch zeigte sich das Abdomen mit lokaler Abwehrspannung im rechten Unterbauch, positivem McBurney-, Lanz- und Rovsing-Zeichen sowie kontralateralem Loslassschmerz nach Blumberg.',
    fspTip:
      'Achtung Anatomie-Prüfungsfrage: Umgangssprachlich sagt jeder „Blinddarmentzündung“, anatomisch entzündet sich aber nicht das Zökum (der Blinddarm), sondern die Appendix vermiformis (der Wurmfortsatz).',
  },

  // UROLOGY, NEPHROLOGY & ENDOCRINE
  {
    id: 'term-12',
    code: 'R30.0 / FSP-U01',
    organSystem: 'urology_renal',
    bookSource: 'elsevier_fsp',
    chapterRef: 'Fall 31 · Urolithiasis & Pyelonephritis (S. 152)',
    fachbegriff: {
      article: 'die',
      term: 'Algurie / die Dysurie (mit Pollakisurie)',
      plural: 'die Dysurien',
      ipa: '[dʏsˈuːʁiː]',
      latinRoot: 'griech. algos (Schmerz) / dys- (erschwert) + ouron (Harn)',
    },
    umgangssprache: {
      article: 'das',
      term: 'Brennen beim Wasserlassen / der ständige Harndrang',
      patientPhrasing: '„Ich muss alle zehn Minuten für ein paar Tropfen auf die Toilette und es brennt beim Wasserlassen wie Feuer.“',
    },
    english: 'Dysuria & Pollakiuria / Painful and frequent urination',
    definitionDe:
      'Erschwerte, schmerzhafte Miktion (Dysurie/Algurie) in Kombination mit gehäuftem Harndrang bei jeweils kleinen Harnportionen ohne erhöhte Gesamtharnmenge (Pollakisurie).',
    clinicalAbbreviation: 'HWI / Miktion',
    collocations: [
      {
        german: 'Algurie, Pollakisurie und imperativer Harndrang bei akuter Zystitis',
        english: 'painful urination, frequency, and urgency in acute cystitis',
        register: 'Arztbrief',
      },
      {
        german: 'beidseits kein Nierenlagerklopfschmerz (NLKS negativ)',
        english: 'no costovertebral angle tenderness bilaterally',
        register: 'Klinischer Befund',
      },
      {
        german: 'Haben Sie Schmerzen oder ein Brennen beim Wasserlassen?',
        english: 'Do you have pain or burning when passing water?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Haben Sie beim Wasserlassen ein Brennen bemerkt oder müssen Sie häufiger als sonst in kleinen Mengen zur Toilette?',
      doctorEn: 'Have you noticed a burning sensation when urinating or do you have to go to the bathroom more frequently in small amounts?',
      patientResponseDe: 'Ja, seit vorgestern brennt es stark beim Wasserlassen und der Urin sah heute Morgen auch leicht rötlich aus.',
      patientResponseEn: 'Yes, since the day before yesterday it burns strongly when urinating and my urine also looked slightly reddish this morning.',
    },
    arztbriefSnippet:
      'In der vegetativen Anamnese berichtet die Patientin über seit drei Tagen bestehende Algurie, Pollakisurie sowie Makrohämaturie; Fieber und Flankenschmerzen werden verneint.',
    fspTip:
      'Unterscheiden Sie im Arztbrief exakt: „Pollakisurie“ (häufiges Wasserlassen kleiner Mengen, z.B. Zystitis), „Polyurie“ (erhöhte Gesamtharnmenge > 2,5 l/Tag, z.B. Diabetes mellitus) und „Nykturie“ (nächtliches Wasserlassen > 2×, z.B. Herzinsuffizienz/BPH).',
  },
  {
    id: 'term-13',
    code: 'N20.1 / FSP-U02',
    organSystem: 'urology_renal',
    bookSource: 'schrimpf',
    chapterRef: 'Kap. 3.4 · Urologische Notfälle (S. 102)',
    fachbegriff: {
      article: 'die',
      term: 'Nephrolithiasis / die Urolithiasis',
      plural: 'die Nephrolithiasen',
      ipa: '[nɛfʁoliˈtiːazɪs]',
      latinRoot: 'griech. nephros (Niere) + lithos (Stein)',
    },
    umgangssprache: {
      article: 'das',
      term: 'Nierensteinleiden / die Nierenkolik',
      patientPhrasing: '„Ich habe wellenartige, unerträgliche Schmerzen in der rechten Flanke, die bis in die Leiste ziehen.“',
    },
    english: 'Nephrolithiasis / Kidney stones & Renal colic',
    definitionDe:
      'Konkrementbildung in den Nierenkelchen, dem Nierenbecken (Nephrolithiasis) oder den ableitenden Harnwegen (Ureterolithiasis), die bei Einklemmen eine akute Kolik auslöst.',
    clinicalAbbreviation: 'NLKS pos. / Harnstau',
    collocations: [
      {
        german: 'kolikartige Flankenschmerzen rechts mit Ausstrahlung in das rechte Labium / Skrotum',
        english: 'colicky right flank pain radiating into the right labium / scrotum',
        register: 'Arztbrief',
      },
      {
        german: 'sonographisch Harnstauungsniere Grad II rechts bei distalem Ureterkonkrement',
        english: 'sonographic grade II hydronephrosis on the right due to distal ureteral calculus',
        register: 'Klinischer Befund',
      },
      {
        german: 'Tritt der Flankenschmerz wellenförmig auf und können Sie dabei kaum ruhig sitzen?',
        english: 'Does the flank pain come in waves and can you barely sit still?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Bleibt der Schmerz in der rechten Flanke konstant gleich, oder kommt und geht er wellenförmig als Kolik?',
      doctorEn: 'Does the pain in the right flank stay constant, or does it come and go in waves like a colic?',
      patientResponseDe: 'Er kommt in extrem starken Wellen bis auf 10 von 10! Ich laufe im Zimmer auf und ab, weil ich nicht still liegen kann.',
      patientResponseEn: 'It comes in extremely strong waves up to 10 out of 10! I pace around the room because I cannot lie still.',
    },
    arztbriefSnippet:
      'Die Aufnahme erfolgte über die zentrale Notaufnahme bei akuter Nierenkolik rechts (NRS 9/10) mit Mikrohämaturie im Urinstatus und sonographischem Nachweis einer Ureterolithiasis.',
    fspTip:
      'Klinisches Unterscheidungsmerkmal für die FSP-Vorstellung: Patienten mit Nieren- oder Gallenkolik sind motorisch unruhig (wandern umher), Patienten mit Peritonitis liegen wegen Erschütterungsschmerz absolut still.',
  },

  // MUSCULOSKELETAL & TRAUMA
  {
    id: 'term-14',
    code: 'S52.50 / FSP-M01',
    organSystem: 'musculoskeletal',
    bookSource: 'elsevier_fsp',
    chapterRef: 'Fall 44 · Unfallchirurgie — Distale Radiusfraktur (S. 204)',
    fachbegriff: {
      article: 'die',
      term: 'distale Radiusfraktur (Colles-Fraktur)',
      plural: 'die Radiusfrakturen',
      ipa: '[dɪsˈtaːlə ˈʁaːdi̯ʊsfʁakˌtuːɐ̯]',
      latinRoot: 'lat. radius (Speiche) + fractura (Bruch)',
    },
    umgangssprache: {
      article: 'der',
      term: 'Speichenbruch am Handgelenk',
      patientPhrasing: '„Ich bin auf dem glatten Gehweg ausgerutscht und habe mich mit der ausgestreckten rechten Hand abgestützt.“',
    },
    english: 'Distal radius fracture (Wrist fracture)',
    definitionDe:
      'Häufigste Fraktur des Menschen am körperfernen Ende der Speiche (Radius), meist als Extensionsfraktur (Colles-Fraktur) durch Sturz auf die dorsalextendierte Hand.',
    clinicalAbbreviation: 'pDMS intakt',
    collocations: [
      {
        german: 'Bajonett-Fehlstellung, Druckschmerz, Schwellung und Hämatom über dem distalen Radius',
        english: 'bayonet deformity, tenderness, swelling, and hematoma over the distal radius',
        register: 'Arztbrief',
      },
      {
        german: 'periphere Durchblutung, Motorik und Sensibilität (pDMS) allseits intakt',
        english: 'distal neurovascular status (circulation, motor, sensory) intact throughout',
        register: 'Klinischer Befund',
      },
      {
        german: 'Haben Sie ein Kribbeln oder Taubheitsgefühl in den Fingerspitzen?',
        english: 'Do you have tingling or numbness in your fingertips?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Können Sie Ihre Finger noch vollständig bewegen, und spüren Sie ein Kribbeln oder Taubheitsgefühl in der Hand?',
      doctorEn: 'Can you still move your fingers completely, and do you feel any tingling or numbness in your hand?',
      patientResponseDe: 'Das Handgelenk ist dick geschwollen und schmerzt bei jeder Bewegung, aber meine Finger spüre ich normal.',
      patientResponseEn: 'My wrist is badly swollen and hurts with every movement, but I can feel my fingers normally.',
    },
    arztbriefSnippet:
      'Nach Sturz auf die dorsalextendierte rechte Hand zeigten sich klinisch eine deutliche Schwellung sowie schmerzhafte Funktionseinschränkung des rechten Handgelenks bei intakter peripherer DMS.',
    fspTip:
      'Bei jeder traumatologischen Fallvorstellung in der FSP müssen Sie unaufgefordert erwähnen: „Die periphere Durchblutung, Motorik und Sensibilität (pDMS) war distal der Verletzung intakt“ sowie nach dem Tetanus-Impfschutz fragen.',
  },
  {
    id: 'term-15',
    code: 'M51.1 / FSP-M02',
    organSystem: 'musculoskeletal',
    bookSource: 'thieme_anamnesis',
    chapterRef: 'Teil C · Wirbelsäule & Neuroorthopädie (S. 248)',
    fachbegriff: {
      article: 'die',
      term: 'Lumbago / die Lumboischialgie (Nucleus-pulposus-Prolaps)',
      plural: 'die Lumboischialgien',
      ipa: '[lʊmboʔɪɕi̯alˈɡiː]',
      latinRoot: 'lat. lumbus (Lende) + griech. ischion (Hüfte) + algos (Schmerz)',
    },
    umgangssprache: {
      article: 'der',
      term: 'Hexenschuss / der Bandscheibenvorfall',
      patientPhrasing: '„Beim Anheben einer schweren Wasserkiste ist es mir plötzlich wie ein Blitz in den unteren Rücken geschossen.“',
    },
    english: 'Lumbago / Sciatica / Lumbar disc herniation',
    definitionDe:
      'Akuter Kreuzschmerz (Lumbago), bei Kompression einer Nervenwurzel durch einen Bandscheibenvorfall (Diskusprolaps) mit radikulärer Schmerzausstrahlung in das Bein (Lumboischialgie).',
    clinicalAbbreviation: 'LWS / Lasègue pos.',
    collocations: [
      {
        german: 'radikuläre Schmerzausstrahlung entsprechend dem Dermatom L5 rechts',
        english: 'radicular pain radiation corresponding to the right L5 dermatome',
        register: 'Arztbrief',
      },
      {
        german: 'positives Lasègue-Zeichen rechts ab 35° sowie abgeschwächter Achillessehnenreflex (ASR)',
        english: 'positive straight-leg raise on the right at 35° and diminished Achilles tendon reflex',
        register: 'Klinischer Befund',
      },
      {
        german: 'Können Sie problemlos auf den Zehenspitzen und auf den Fersen gehen?',
        english: 'Can you walk on your tiptoes and on your heels without difficulty?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Zieht der Rückenschmerz über das Gesäß bis in das Bein oder den Fuß hinunter, und funktionieren Wasserlassen und Stuhlgang normal?',
      doctorEn: 'Does the back pain radiate over the buttocks down into the leg or foot, and are urination and bowel movements normal?',
      patientResponseDe: 'Der Schmerz zieht an der Außenseite vom rechten Bein bis in den großen Zeh, und der Fußheber fühlt sich schwach an.',
      patientResponseEn: 'The pain pulls down the outside of my right leg into the big toe, and lifting my foot feels weak.',
    },
    arztbriefSnippet:
      'Klinisch besteht eine akute Lumboischialgie rechts mit Hypästhesie im Dermatom L5 und Fußheberparese (Kraftgrad 4/5); ein Cauda-equina-Syndrom (Blasen-/Mastdarmstörung, Reithosenanästhesie) liegt nicht vor.',
    fspTip:
      'Red Flags beim Rückenschmerz in der FSP: Fragen Sie zwingend nach Blasen- und Mastdarmstörungen (Harnverhalt/Inkontinenz) sowie „Reithosenanästhesie“ zum Ausschluss eines neurochirurgischen Notfalls (Cauda-equina-Syndrom).',
  },

  // VASCULAR, DERMATOLOGY & LYMPHATICS
  {
    id: 'term-16',
    code: 'I80.2 / FSP-V01',
    organSystem: 'derma_vascular',
    bookSource: 'herold',
    chapterRef: 'Angiologie · Phlebothrombose & Lungenembolie (S. 828)',
    fachbegriff: {
      article: 'die',
      term: 'tiefe Beinvenenthrombose (Phlebothrombose)',
      plural: 'die Phlebothrombosen',
      ipa: '[ˈfleːbotʁɔmˌboːzə]',
      latinRoot: 'griech. phleps (Ader, Vene) + thrombos (Pfropf, Blutgerinnsel)',
    },
    umgangssprache: {
      article: 'das',
      term: 'Blutgerinnsel in der Beinvene',
      patientPhrasing: '„Nach dem langen Langstreckenflug ist meine linke Wade seit gestern prall geschwollen, überwärmt und bläulich-rot.“',
    },
    english: 'Deep vein thrombosis (DVT)',
    definitionDe:
      'Teilweiser oder vollständiger Verschluss einer tiefen Leitvene der unteren Extremität durch einen intravasalen Thrombus mit Gefahr einer sekundären Lungenarterienembolie (LAE).',
    clinicalAbbreviation: 'TVT / LAE',
    collocations: [
      {
        german: 'einseitige Umfangsdifferenz des linken Unterschenkels (+3,5 cm), Überwärmung und Lividität',
        english: 'unilateral circumference difference of the left lower leg (+3.5 cm), warmth, and lividity',
        register: 'Arztbrief',
      },
      {
        german: 'Kompressionssonographie der tiefen Beinvenen und Bestimmung der D-Dimere',
        english: 'compression ultrasonography of the deep leg veins and D-dimer assay',
        register: 'Klinischer Befund',
      },
      {
        german: 'Waren Sie vor Kurzem auf einer langen Flugreise oder längere Zeit bettlägerig?',
        english: 'Were you recently on a long flight or bedridden for a prolonged period?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Ist nur das linke Bein geschwollen und überwärmt, und hatten Sie in den letzten Wochen eine Operation, Ruhigstellung oder lange Reise?',
      doctorEn: 'Is only the left leg swollen and warm, and have you had surgery, immobilization, or a long journey in recent weeks?',
      patientResponseDe: 'Nur die linke Wade ist dick und spannt beim Auftreten. Ich bin vor zwei Tagen zehn Stunden aus Tokio zurückgeflogen.',
      patientResponseEn: 'Only my left calf is thick and tight when stepping down. I flew back ten hours from Tokyo two days ago.',
    },
    arztbriefSnippet:
      'Bei hohem klinischem Wells-Score (einseitige Unterschenkelschwellung links nach Immobilisation, positive Meyer- und Payr-Zeichen) erfolgte die Kompressionssonographie mit Nachweis einer 3-Etagen-Phlebothrombose links.',
    fspTip:
      'Denken Sie bei jedem Patienten mit Verdacht auf TVT an die Virchow-Trias (Immobilisation/Reise, Endothelschaden/OP, Hyperkoagulabilität/Malignom/Kontrazeptiva) und fragen Sie nach Dyspnoe/Thoraxschmerz (Lungenembolie!).',
  },
  {
    id: 'term-17',
    code: 'I70.2 / FSP-V02',
    organSystem: 'derma_vascular',
    bookSource: 'pschyrembel',
    chapterRef: 'Nomenklatur C · Claudicatio intermittens (S. 312)',
    fachbegriff: {
      article: 'die',
      term: 'Claudicatio intermittens (pAVK)',
      plural: 'die Claudicationes',
      ipa: '[klaʊ̯diˈkaːt͡si̯o ɪntɛɐ̯ˈmɪtɛns]',
      latinRoot: 'lat. claudicare (hinken) + intermittere (unterbrechen)',
    },
    umgangssprache: {
      article: 'die',
      term: 'Schaufensterkrankheit / die Durchblutungsstörung der Beine',
      patientPhrasing: '„Nach 150 Metern Gehen krampft meine rechte Wade so stark, dass ich vor jedem Schaufenster kurz stehen bleiben muss.“',
    },
    english: 'Intermittent claudication / Peripheral arterial disease (PAD)',
    definitionDe:
      'Ischämischer, belastungsabhängiger Muskelschmerz (meist in der Wade) bei peripherer arterieller Verschlusskrankheit (pAVK), der den Patienten nach definierter Gehstrecke zum Stehenbleiben zwingt.',
    clinicalAbbreviation: 'pAVK Stadium IIb / ABI',
    collocations: [
      {
        german: 'schmerzfreie Gehstrecke auf unter 150 Meter reduziert (pAVK Stadium IIb nach Fontaine)',
        english: 'pain-free walking distance reduced to under 150 meters (PAD Fontaine stage IIb)',
        register: 'Arztbrief',
      },
      {
        german: 'Fußpulse (A. dorsalis pedis und A. tibialis posterior) rechts nicht palpabel',
        english: 'pedal pulses (dorsalis pedis and posterior tibial arteries) non-palpable on the right',
        register: 'Klinischer Befund',
      },
      {
        german: 'Lässt der Wadenschmerz sofort nach, sobald Sie beim Gehen kurz stehen bleiben?',
        english: 'Does the calf pain subside immediately as soon as you stop walking briefly?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Wie viele Meter können Sie in normalem Tempo auf ebener Strecke gehen, bevor der Schmerz in der Wade Sie zum Stehenbleiben zwingt?',
      doctorEn: 'How many meters can you walk at a normal pace on flat ground before the pain in your calf forces you to stop?',
      patientResponseDe: 'Höchstens noch 150 Meter. Wenn ich dann zwei Minuten stehen bleibe, geht der Krampf weg und ich kann weiterlaufen.',
      patientResponseEn: 'At most 150 meters now. When I stand still for two minutes, the cramp goes away and I can walk on.',
    },
    arztbriefSnippet:
      'Anamnestisch und klinisch präsentiert sich das Bild einer peripheren arteriellen Verschlusskrankheit (pAVK) vom femoropoplitealen Typ rechts im Stadium IIb nach Fontaine mit einem Knöchel-Arm-Index (ABI) von 0,55.',
    fspTip:
      'Die schmerzfreie Gehstrecke entscheidet im deutschen Klinikalltag über das Fontaine-Stadium und die Therapieindikation: > 200 m = Stadium IIa (konservatives Gehtraining), < 200 m = Stadium IIb (interventionelle PTA/Angioplastie).',
  },

  // GENERAL CLINICAL & PERIOPERATIVE
  {
    id: 'term-18',
    code: 'R50.9 / FSP-A01',
    organSystem: 'general_surgery',
    bookSource: 'cornelsen',
    chapterRef: 'Modul 3 · Vegetative Anamnese & B-Symptomatik (S. 72)',
    fachbegriff: {
      article: 'die',
      term: 'Pyrexie (mit Schüttelfrost und B-Symptomatik)',
      plural: 'die Pyrexien',
      ipa: '[pyʁɛˈksiː]',
      latinRoot: 'griech. pyressein (fiebern, heiß sein)',
    },
    umgangssprache: {
      article: 'das',
      term: 'Fieber mit Nachtschweiß und Gewichtsverlust',
      patientPhrasing: '„Ich habe abends bis 39,2 Grad Fieber und schwitze nachts so stark, dass ich das Schlafanzughemd wechseln muss.“',
    },
    english: 'Pyrexia / Fever & B-Symptoms (Night sweats, weight loss)',
    definitionDe:
      'Erhöhung der Körperkerntemperatur > 38,0 °C (subfebril: 37,5–38,0 °C; febril > 38,0 °C). Als onkologische/infektiologische B-Symptomatik gilt die Trias aus Fieber, profusem Nachtschweiß und Gewichtsverlust > 10 % in 6 Monaten.',
    clinicalAbbreviation: 'AZ reduziert / EZ',
    collocations: [
      {
        german: 'positive B-Symptomatik (undulierendes Fieber, drenching night sweats, Gewichtsverlust)',
        english: 'positive B-symptoms (undulating fever, drenching night sweats, weight loss)',
        register: 'Arztbrief',
      },
      {
        german: 'Patient in leicht reduziertem Allgemeinzustand (AZ) und schlankem Ernährungszustand (EZ)',
        english: 'patient in slightly reduced general condition and slender nutritional state',
        register: 'Klinischer Befund',
      },
      {
        german: 'Schwitzen Sie nachts so stark, dass Sie die Bettwäsche oder Kleidung wechseln müssen?',
        english: 'Do you sweat so heavily at night that you have to change bedsheets or clothing?',
        register: 'Anamnese',
      },
    ],
    anamneseQuestion: {
      doctorDe: 'Haben Sie das Fieber mit einem Thermometer gemessen, und haben Sie in den letzten Monaten ungewollt an Gewicht verloren?',
      doctorEn: 'Did you measure the fever with a thermometer, and have you unintentionally lost weight in recent months?',
      patientResponseDe: 'Ja, das Thermometer zeigte 38,9 Grad. Außerdem habe ich in vier Monaten 7 Kilo abgenommen, obwohl ich normal esse.',
      patientResponseEn: 'Yes, the thermometer showed 38.9 degrees. Also I lost 7 kilos in four months even though I eat normally.',
    },
    arztbriefSnippet:
      'Die 54-jährige Patientin stellt sich in reduziertem Allgemeinzustand mit positiver B-Symptomatik (subfebrile Temperaturen bis 38,4 °C, profuser Nachtschweiß mit Wäschewechsel, ungewollter Gewichtsverlust von 7 kg in 4 Monaten) vor.',
    fspTip:
      'Die „vegetative Anamnese“ (Appetit, Gewicht, Schlaf, Fieber/Schüttelfrost, Nachtschweiß, Miktion, Defäkation) darf in keiner FSP-Anamnese fehlen — selbst bei chirurgischen Fällen bringt sie wertvolle Strukturpunkte.',
  },
];

export const ANAMNESE_CASES: AnamneseCase[] = [
  {
    id: 'case-acs',
    caseCode: 'FSP-FALL 01 · KARDIOLOGIE',
    title: 'Akuter Thoraxschmerz in der Zentralen Notaufnahme',
    patientName: 'Herr Klaus-Dieter Lindner',
    age: 61,
    occupation: 'Pensionierter Bauingenieur',
    chiefComplaintPatient: '„Seit heute Morgen um 7 Uhr drückt es mir gewaltig hinter dem Brustbein.“',
    suspectedDiagnosisFach: 'V.a. Akutes Koronarsyndrom (ACS / NSTEMI)',
    bookSource: 'schrimpf',
    organSystem: 'thorax_cardio',
    vitalSigns: {
      bp: '165/95 mmHg',
      hr: '98 /min',
      temp: '36,8 °C',
      spo2: '94 % (Raumluft)',
    },
    steps: [
      {
        stepNumber: 1,
        phase: 'Aktuelle Schmerzanamnese (Lokalisation & Charakter)',
        patientStatementDe:
          '„Herr Doktor, beim Schneeschippen heute Morgen hatte ich plötzlich das Gefühl, als würde mir ein schwerer Stein mitten auf der Brust liegen. Der Schmerz zieht bis in den linken Arm und in den Unterkiefer.“',
        patientStatementEn:
          '"Doctor, while shoveling snow this morning I suddenly felt as if a heavy stone were lying right on my chest. The pain pulls into my left arm and lower jaw."',
        highlightedLayTerm: 'Enge-/Druckgefühl auf der Brust mit Ausstrahlung',
        targetFachbegriff: 'Retrosternale Stenokardien (Angina pectoris)',
        options: [
          {
            id: 'opt-1a',
            fachbegriff: 'Retrosternale Stenokardien mit Ausstrahlung in die linke obere Extremität und Mandibula',
            arztbriefFormulation:
              'Der Patient berichtet über akut unter körperlicher Belastung aufgetretene, vernichtende retrosternale Stenokardien mit Ausstrahlung in den linken Arm sowie den Unterkiefer.',
            isCorrect: true,
            explanation:
              'Exakt! „Stenokardien“ bzw. „Angina pectoris“ bezeichnet das kardiogene retrosternale Druck-/Engegefühl. Der Konjunktiv I bzw. Nominalstil entspricht dem Standard nach Schrimpf / Herold.',
          },
          {
            id: 'opt-1b',
            fachbegriff: 'Postprandiale Pyrosis mit ösophagealer Regurgitation',
            arztbriefFormulation:
              'Der Patient klagt über nahrungsabhängiges Sodbrennen hinter dem Sternum nach dem Frühstück.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: „Pyrosis“ bedeutet Sodbrennen. Hier liegt ein belastungsabhängiger Vernichtungsschmerz mit typischer kardiogener Ausstrahlung vor.',
          },
          {
            id: 'opt-1c',
            fachbegriff: 'Atemabhängige Pleurodynie bei Pneumothorax',
            arztbriefFormulation:
              'Es zeigt sich ein inspiratorisch stechender Flankenschmerz ohne Ausstrahlung.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: Der Patient beschreibt ein dumpfes, drückendes Engegefühl („wie ein schwerer Stein“) und keinen atemabhängigen Pleuraschmerz.',
          },
        ],
      },
      {
        stepNumber: 2,
        phase: 'Begleitsymptome & Vegetative Anamnese',
        patientStatementDe:
          '„Dazu bekomme ich schon im Sitzen schlecht Luft, mir ist total übel geworden und mir steht der kalte Schweiß auf der Stirn. Nachts schlafe ich ohnehin schon seit Monaten mit drei Kissen.“',
        patientStatementEn:
          '"In addition, I can barely breathe even while sitting, I feel very nauseous, and cold sweat is on my forehead. At night I have already been sleeping with three pillows for months."',
        highlightedLayTerm: 'Luftnot im Sitzen, Übelkeit, Schlafen mit drei Kissen',
        targetFachbegriff: 'Ruhedyspnoe, vegetative Begleitsymptomatik (Nausea, Kaltschweißigkeit) & Orthopnoe',
        options: [
          {
            id: 'opt-2a',
            fachbegriff: 'Ruhedyspnoe, Nausea, Kaltschweißigkeit sowie anamnestische Orthopnoe',
            arztbriefFormulation:
              'Begleitend bestehen eine akute Ruhedyspnoe, Nausea und Kaltschweißigkeit; in der vegetativen Anamnese wird zudem eine chronische Orthopnoe (Schlafen mit drei Kopfkissen) angegeben.',
            isCorrect: true,
            explanation:
              'Sehr gut! Schlafen mit erhöhtem Oberkörper/mehreren Kissen wegen Luftnot wird im deutschen Arztbrief prägnant als „Orthopnoe“ dokumentiert.',
          },
          {
            id: 'opt-2b',
            fachbegriff: 'Hämoptysen, Hämatemesis und Nykturie',
            arztbriefFormulation:
              'Begleitend traten Bluthusten sowie rezidivierendes Bluterbrechen auf.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: Weder Bluthusten (Hämoptyse) noch Bluterbrechen (Hämatemesis) wurden vom Patienten geschildert.',
          },
          {
            id: 'opt-2c',
            fachbegriff: 'Paroxysmale Vertigo mit Tinnitus und Synkope',
            arztbriefFormulation:
              'Der Patient erlitt einen kompletten Bewusstseinsverlust mit Drehschwindel.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: Der Patient war jederzeit bei Bewusstsein (keine Synkope) und klagt über Luftnot (Dyspnoe) sowie Übelkeit (Nausea).',
          },
        ],
      },
      {
        stepNumber: 3,
        phase: 'Vorerkrankungen & Risikofaktoren (Eigenanamnese)',
        patientStatementDe:
          '„Ich habe seit zehn Jahren Bluthochdruck, erhöhte Blutfettwerte und die Schaufensterkrankheit im rechten Bein. Außerdem rauche ich seit 30 Jahren eine Schachtel Zigaretten am Tag.“',
        patientStatementEn:
          '"I have had high blood pressure for ten years, high blood lipids, and intermittent claudication in my right leg. I also smoke one pack of cigarettes a day for 30 years."',
        highlightedLayTerm: 'Bluthochdruck, Blutfette, Schaufensterkrankheit, 30 Jahre 1 Schachtel/Tag',
        targetFachbegriff: 'Arterielle Hypertonie, Hyperlipoproteinämie, pAVK & Nikotinabusus (30 pack years)',
        options: [
          {
            id: 'opt-3a',
            fachbegriff: 'Arterielle Hypertonie, Hyperlipoproteinämie, pAVK sowie Nikotinabusus (30 py)',
            arztbriefFormulation:
              'Als kardiovaskuläre Risikofaktoren sind eine langjährige arterielle Hypertonie, eine Hyperlipoproteinämie, eine periphere arterielle Verschlusskrankheit (pAVK) rechts sowie ein fortgesetzter Nikotinabusus (kumulativ 30 pack years) bekannt.',
            isCorrect: true,
            explanation:
              'Perfekt! „Schaufensterkrankheit“ = pAVK (Claudicatio intermittens); 1 Schachtel/Tag × 30 Jahre = 30 pack years (py).',
          },
          {
            id: 'opt-3b',
            fachbegriff: 'Arterielle Hypotonie, Hyperthyreose und tiefe Beinvenenthrombose (TVT)',
            arztbriefFormulation:
              'Vorerkrankungen: niedriger Blutdruck, Schilddrüsenüberfunktion und Phlebothrombose.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: Bluthochdruck = arterielle Hypertonie (nicht Hypotonie), und Schaufensterkrankheit ist die arterielle Verschlusskrankheit (pAVK), keine Venenthrombose.',
          },
          {
            id: 'opt-3c',
            fachbegriff: 'Z.n. Apoplex, Nephrolithiasis und chronische Zystitis',
            arztbriefFormulation:
              'Anamnestisch bestehen ein Hirnschlag sowie Nierensteine.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: Diese Diagnosen passen nicht zu den vom Patienten genannten kardiovaskulären Risikofaktoren.',
          },
        ],
      },
    ],
  },
  {
    id: 'case-gi',
    caseCode: 'FSP-FALL 02 · GASTROENTEROLOGIE',
    title: 'Epigastrischer Schmerz & Schwarzer Stuhlgang',
    patientName: 'Frau Hildegard Schuster',
    age: 68,
    occupation: 'Rentnerin (ehem. Buchhalterin)',
    chiefComplaintPatient: '„Mir drückt der Oberbauch und mein Stuhlgang ist seit zwei Tagen pechschwarz.“',
    suspectedDiagnosisFach: 'V.a. Obere gastrointestinale Blutung (Ulcus ventriculi/duodeni)',
    bookSource: 'elsevier_fsp',
    organSystem: 'abdomen_gi',
    vitalSigns: {
      bp: '105/65 mmHg',
      hr: '108 /min',
      temp: '36,5 °C',
      spo2: '98 % (Raumluft)',
    },
    steps: [
      {
        stepNumber: 1,
        phase: 'Aktuelle Anamnese & Leitsymptom',
        patientStatementDe:
          '„Seit einer Woche habe ich ein dumpfes Brennen im mittleren Oberbauch, direkt unter dem Brustbein. Seit vorgestern ist mein Stuhlgang glänzend tiefschwarz wie Teer und riecht ganz furchtbar.“',
        patientStatementEn:
          '"For a week I have had a dull burning in my middle upper belly, right under the breastbone. Since two days ago my stool has been shiny jet-black like tar and smells terrible."',
        highlightedLayTerm: 'Schmerz im mittleren Oberbauch + tiefschwarzer Teerstuhl',
        targetFachbegriff: 'Epigastrischer Druckschmerz & Meläna (obere GI-Blutung)',
        options: [
          {
            id: 'opt-gi-1a',
            fachbegriff: 'Epigastrischer Schmerz sowie Absetzen von Meläna bei V.a. obere GI-Blutung',
            arztbriefFormulation:
              'Die Aufnahme der Patientin erfolgte bei seit einer Woche bestehenden epigastrischen Schmerzen und seit zwei Tagen beobachteter Meläna unter dem Verdacht auf eine obere gastrointestinale Blutung (oGIB).',
            isCorrect: true,
            explanation:
              'Richtig! „Mittlerer Oberbauch“ = Epigastrium; „pechschwarzer Teerstuhl“ = Meläna (Leitsymptom der oberen gastrointestinalen Blutung).',
          },
          {
            id: 'opt-gi-1b',
            fachbegriff: 'Schmerzen im rechten Unterbauch (McBurney) und Hämatochezie',
            arztbriefFormulation:
              'Die Patientin berichtet über frische hellrote Blutauflagerungen auf dem Stuhl.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: „Hämatochezie“ bezeichnet frisches, hellrotes Blut im Stuhl (meist untere GI-Blutung), während hier klassische Meläna vorliegt.',
          },
          {
            id: 'opt-gi-1c',
            fachbegriff: 'Acholischer Stuhl und bierbrauner Urin bei Choledocholithiasis',
            arztbriefFormulation:
              'Es zeigt sich ein entfärbter, weißlicher Stuhlgang bei Gallengangsverschluss.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: „Acholischer Stuhl“ ist entfärbt/lehmfarben bei Cholestase, nicht glänzend schwarz.',
          },
        ],
      },
      {
        stepNumber: 2,
        phase: 'Medikamentenanamnese & Auslöser',
        patientStatementDe:
          '„Wegen meiner starken Kniegelenksarthrose nehme ich seit vier Wochen dreimal täglich Ibuprofen 600 mg ohne Magenschutztablette ein. Gestern wurde mir beim Aufstehen auch kurz schwarz vor Augen.“',
        patientStatementEn:
          '"Because of my severe knee osteoarthritis I have been taking Ibuprofen 600 mg three times daily for four weeks without a stomach protector pill. Yesterday my vision also went briefly black when standing up."',
        highlightedLayTerm: 'Kniegelenksarthrose, Ibuprofen ohne Magenschutz, Schwarzwerden vor Augen',
        targetFachbegriff: 'Gonarthrose, NSAR-Abusus ohne PPI-Prophylaxe & orthostatische Präsynkope',
        options: [
          {
            id: 'opt-gi-2a',
            fachbegriff: 'NSAR-Einnahme bei Gonarthrose ohne PPI-Schutz sowie orthostatische Präsynkope',
            arztbriefFormulation:
              'Medikamentenanamnestisch besteht eine hochdosierte NSAR-Einnahme (Ibuprofen 3×600 mg/d wegen bekannter Gonarthrose) ohne begleitende Protonenpumpeninhibitor-(PPI-)Prophylaxe; zudem trat eine orthostatische Präsynkope auf.',
            isCorrect: true,
            explanation:
              'Exzellent! „Kniegelenksarthrose“ = Gonarthrose (Hüftgelenksarthrose wäre Koxarthrose); Ibuprofen gehört zu den NSAR und ist eine Hauptursache für gastroduodenale Ulzera.',
          },
          {
            id: 'opt-gi-2b',
            fachbegriff: 'Koxarthrose unter oraler Antikoagulation mit Apoplex',
            arztbriefFormulation:
              'Die Patientin nimmt Blutverdünner wegen Hüftgelenksarthrose und erlitt einen Schlaganfall.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: Kniegelenk = Gonarthrose (griech. gony = Knie), nicht Koxarthrose (lat. coxa = Hüfte).',
          },
          {
            id: 'opt-gi-2c',
            fachbegriff: 'Nephrolithiasis unter antibiotischer Therapie mit Algurie',
            arztbriefFormulation:
              'Die Beschwerden traten nach Antibiotikaeinnahme bei Nierensteinen auf.',
            isCorrect: false,
            explanation:
              'Nicht korrekt: Die Anamnese beschreibt eindeutig ein NSAR-induziertes Ulkusleiden.',
          },
        ],
      },
    ],
  },
];

export const WORD_BUILDER_PARTS: WordBuilderPart[] = [
  {
    id: 'wb-dys',
    part: 'Dys-',
    type: 'prefix',
    meaningDe: 'Fehlfunktion, Störung eines Zustands (Umgangssprache: „...störung / erschwertes ...“)',
    meaningEn: 'Impaired, difficult, or disordered state',
    examples: [
      'die Dyspnoe → die Atemnot / Kurzatmigkeit',
      'die Dysphagie → die Schluckstörung',
      'die Dysurie → das erschwerte/schmerzhafte Wasserlassen',
      'die Dysarthrie → die Sprechstörung',
    ],
  },
  {
    id: 'wb-a-an',
    part: 'A- / An-',
    type: 'prefix',
    meaningDe: 'Fehlen, völlige Abwesenheit (Umgangssprache: „ohne ... / Verlust von ...“)',
    meaningEn: 'Absence of, without',
    examples: [
      'die Apnoe → der Atemstillstand',
      'die Anurie → das Versiegen der Harnausscheidung (< 100 ml/24h)',
      'die Anämie → die Blutarmut',
      'die Aphasie → der Sprachverlust',
    ],
  },
  {
    id: 'wb-hyper-hypo',
    part: 'Hyper- / Hypo-',
    type: 'prefix',
    meaningDe: 'Überfunktion / Erhöhung vs. Unterfunktion / Erniedrigung',
    meaningEn: 'Excessive / above normal vs. Deficient / below normal',
    examples: [
      'die arterielle Hypertonie → der Bluthochdruck',
      'die Hypoglykämie → die Unterzuckerung',
      'die Hyperthyreose → die Schilddrüsenüberfunktion',
      'die Hypästhesie → das verminderte Berührungsempfinden / Taubheitsgefühl',
    ],
  },
  {
    id: 'wb-haem',
    part: 'Häm(at)o-',
    type: 'root',
    meaningDe: 'Blut- (griech. haima)',
    meaningEn: 'Relating to blood',
    examples: [
      'die Hämoptyse → der Bluthusten',
      'die Hämatemesis → das Bluterbrechen',
      'die Hämatochezie → frisches hellrotes Blut im Stuhl',
      'das Hämatom → der Bluterguss / der blaue Fleck',
    ],
  },
  {
    id: 'wb-nephr-cyst',
    part: 'Nephro- / Zysto-',
    type: 'root',
    meaningDe: 'Niere (griech. nephros) / Harnblase (griech. kystis)',
    meaningEn: 'Kidney / Urinary bladder',
    examples: [
      'die Nephrolithiasis → das Nierensteinleiden',
      'die Pyelonephritis → die Nierenbeckenentzündung',
      'die Zystitis → die Harnblasenentzündung',
      'die Zystoskopie → die Blasenspiegelung',
    ],
  },
  {
    id: 'wb-gastr-hepat',
    part: 'Gastro- / Hepato- / Chole-',
    type: 'root',
    meaningDe: 'Magen (gaster) / Leber (hepar) / Galle (cholē)',
    meaningEn: 'Stomach / Liver / Bile',
    examples: [
      'die Gastroenteritis → der Magen-Darm-Infekt',
      'die Hepatomegalie → die Lebervergrößerung',
      'die Cholezystolithiasis → das Gallensteinleiden (in der Gallenblase)',
      'die Cholezystektomie → die operative Entfernung der Gallenblase',
    ],
  },
  {
    id: 'wb-itis',
    part: '-itis',
    type: 'suffix',
    meaningDe: 'Entzündung (immer feminin: die ...-itis, Plural: die ...-itiden)',
    meaningEn: 'Inflammation (always feminine "die" in German)',
    examples: [
      'die Appendizitis → die Blinddarmentzündung (Pl. die Appendizitiden)',
      'die Tonsillitis → die Mandelentzündung',
      'die Phlebitis → die Venenentzündung',
      'die Meningitis → die Hirnhautentzündung',
    ],
  },
  {
    id: 'wb-ektomie-skopie',
    part: '-ektomie / -skopie',
    type: 'suffix',
    meaningDe: 'Operative Entfernung vs. Optische Spiegelung (beide immer feminin: die)',
    meaningEn: 'Surgical removal vs. Endoscopic examination',
    examples: [
      'die Appendektomie → die Blinddarmentfernung',
      'die Koloskopie → die Darmspiegelung',
      'die Gastroskopie (ÖGD) → die Magenspiegelung',
      'die Bronchoskopie → die Lungenspiegelung',
    ],
  },
  {
    id: 'wb-algie-pathie',
    part: '-algie / -pathie',
    type: 'suffix',
    meaningDe: 'Schmerzzustand (griech. algos) vs. Allgemeines Leiden/Erkrankung',
    meaningEn: 'Pain condition vs. Disease/disorder',
    examples: [
      'die Lumboischialgie → der in das Bein ausstrahlende Kreuzschmerz',
      'diezephalgie (Kephalgie) → der Kopfschmerz',
      'dieMyalgie → der Muskelschmerz',
      'die Polyneuropathie → die Erkrankung mehrerer peripherer Nerven',
    ],
  },
];
