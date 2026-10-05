export type ClinicalSituationCategory =
  | 'patient_caregiver'
  | 'doctor_caregiver';

export interface DeepDictionaryWord {
  id: string;
  surfaceWordInSentence: string;
  baseEntryDe: string;
  article: 'der' | 'die' | 'das' | 'die (Pl.)' | 'Verb / Adj.';
  ipa: string;
  englishTranslation: string;
  layGermanEquivalent: string;
  pschyrembelDefinitionDe: string;
  pschyrembelDefinitionEn: string;
  etymologyAndMorphology: string;
  clinicalUsageNote: string;
  dictionarySource: string;
}

export interface DialogueExchange {
  id: string;
  timestamp: string;
  speakerRole: 'Patient' | 'Pflegefachkraft (Caregiver/Nurse)' | 'Stationsarzt / Oberarzt (Doctor)';
  speakerName: string;
  sentenceDe: string;
  sentenceEn: string;
  sentenceGrammarAndToneDe: string;
  sentenceGrammarAndToneEn: string;
  clinicalContextExplanation: string;
  analyzedWords: DeepDictionaryWord[];
}

export interface ClinicalWardScenario {
  id: string;
  category: ClinicalSituationCategory;
  code: string;
  wardSettingDe: string;
  wardSettingEn: string;
  titleDe: string;
  titleEn: string;
  summaryDe: string;
  summaryEn: string;
  sourceBooks: string;
  vitalSignsContext: string;
  exchanges: DialogueExchange[];
}

export const CLINICAL_WARD_SCENARIOS: ClinicalWardScenario[] = [
  // ==========================================================================
  // CATEGORY 1: PATIENT ↔ CAREGIVER (PFLEGEFACHKRAFT) REAL-TIME SITUATIONS
  // ==========================================================================
  {
    id: 'scen-pc-postop',
    category: 'patient_caregiver',
    code: 'STATION 4A · VISZERALCHIRURGIE (PATIENT ↔ PFLEGE)',
    wardSettingDe: 'Chirurgische Normalstation · 1. Postoperativer Tag nach laparoskopischer Cholezystektomie',
    wardSettingEn: 'Surgical Ward · Post-Op Day 1 after Laparoscopic Cholecystectomy',
    titleDe: 'Postoperative Schmerzerfassung, Wundkontrolle & Frühmobilisation am Krankenbett',
    titleEn: 'Post-Operative Pain Assessment, Wound Inspection & Early Mobilization at the Bedside',
    summaryDe:
      'Echtzeit-Situation zwischen Patientin und Pflegefachkraft bei der Morgenrunde: Erfassung von Wundschmerz, postoperativer Übelkeit (PONV), Verbandskontrolle und Kreislaufüberwachung beim ersten Aufstehen.',
    summaryEn:
      'Real-time bedside interaction between a post-op patient and a registered nursing caregiver: assessing surgical wound pain, post-operative nausea (PONV), dressing inspection, and orthostatic circulation during first mobilization.',
    sourceBooks: 'Pschyrembel Klinisches Wörterbuch (269. Aufl.) · Cornelsen Menschen im Beruf Pflege/Medizin · Olesen Tuition',
    vitalSignsContext: 'RR 115/70 mmHg · HF 84/min · Temp 37,2 °C · NRS 6/10 in Bewegung',
    exchanges: [
      {
        id: 'ex-pc-1',
        timestamp: '07:15 Uhr · Zimmer 402',
        speakerRole: 'Patient',
        speakerName: 'Frau Erika Hartmann (59 J.)',
        sentenceDe:
          '„Schwester Jonas, seit dem Aufwachen zieht die Operationsnaht am rechten Oberbauch extrem, und beim Aufrichten wird mir sofort flau im Magen und schwindelig.“',
        sentenceEn:
          '"Nurse Jonas, since waking up the surgical suture on my right upper belly has been pulling extremely, and whenever I sit up I immediately feel queasy in my stomach and dizzy."',
        sentenceGrammarAndToneDe:
          'Umgangssprachliche Schilderung subjektiver Beschwerden: „es zieht“ (ziehender Wundschmerz), „flau im Magen werden“ (idiomatisch für beginnende Nausea/Übelkeit) sowie lageabhängiger Schwindel.',
        sentenceGrammarAndToneEn:
          'Everyday patient register: "es zieht" describes pulling wound pain; "flau im Magen werden" is a classic German idiom for feeling queasy/faint/nauseous; "beim Aufrichten" (nominalized infinitive) indicates positional trigger.',
        clinicalContextExplanation:
          'When a post-operative patient reports dizziness and queasiness upon sitting up ("beim Aufrichten"), the caregiver must immediately suspect orthostatic dysregulation (orthostatische Hypotonie) or post-operative nausea and vomiting (PONV).',
        analyzedWords: [
          {
            id: 'dw-operationsnaht',
            surfaceWordInSentence: 'Operationsnaht',
            baseEntryDe: 'Operationsnaht / Sutura chirurgica',
            article: 'die',
            ipa: '[opəʁaˈt͡si̯oːnsˌnaːt]',
            englishTranslation: 'Surgical suture / Stitch line',
            layGermanEquivalent: 'die genähte Wunde / die Fäden',
            pschyrembelDefinitionDe:
              'Chirurgische Wundverschlussnaht (Sutura) zur spannungsfreien Adaptation der Wundränder mittels resorbierbarem oder nicht-resorbierbarem Nahtmaterial oder Hautklammern.',
            pschyrembelDefinitionEn:
              'Surgical wound closure (suture) for tension-free approximation of wound edges using absorbable/non-absorbable thread or skin staples.',
            etymologyAndMorphology:
              'Kompositum aus lat. operatio (Verrichtung, Eingriff) + ahd. nāt (Naht, zu nähen; Plural: die Nähte).',
            clinicalUsageNote:
              'Im Arztbrief und Pflegebericht heißt es bei reizloser Naht: „Operationswunde (OP-Naht) reizlos, trocken, adaptiert, kein Anhalt für Wunddehiszenz.“',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Wundnaht / Sutura“',
          },
          {
            id: 'dw-oberbauch',
            surfaceWordInSentence: 'Oberbauch',
            baseEntryDe: 'Oberbauch / Epigastrium & Hypochondrium',
            article: 'der',
            ipa: '[ˈoːbɐˌbaʊ̯x]',
            englishTranslation: 'Upper abdomen (Right upper quadrant = RUQ)',
            layGermanEquivalent: 'der obere Bauch',
            pschyrembelDefinitionDe:
              'Klinisch-topographische Region des Abdomens oberhalb der Nabelhorizontale; unterteilt in Epigastrium (Mitte) sowie rechtes und linkes Hypochondrium.',
            pschyrembelDefinitionEn:
              'Topographical region of the abdomen cranial to the umbilical plane; subdivided into the epigastrium (midline) and right/left hypochondriac regions.',
            etymologyAndMorphology:
              'Deutsch: ober- (kranial) + der Bauch (Abdomen). Fachsprachlich: Regio epigastrica / Regio hypochondriaca dextra.',
            clinicalUsageNote:
              '„Rechter Oberbauch (re. OB)“ ist die typische Projektionsstelle für Leber- und Gallenwegserkrankungen (Murphy-Zeichen positiv bei Cholezystitis).',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Abdomen / Epigastrium“',
          },
          {
            id: 'dw-flau',
            surfaceWordInSentence: 'flau im Magen',
            baseEntryDe: 'flaues Gefühl / Nausea & Präsynkope',
            article: 'Verb / Adj.',
            ipa: '[flaʊ̯ ɪm ˈmaːɡn̩]',
            englishTranslation: 'Queasy in the stomach / Lightheaded & nauseous',
            layGermanEquivalent: 'flau / mulmig / leicht übel',
            pschyrembelDefinitionDe:
              'Umgangssprachliche Bezeichnung für ein prodromales vegetatives Unwohlsein im Epigastrium, oft als Vorbote einer Nausea (Übelkeit) oder vasovagalen Synkope.',
            pschyrembelDefinitionEn:
              'Colloquial German expression for prodromal autonomic discomfort in the epigastrium, frequently preceding nausea or vasovagal syncope.',
            etymologyAndMorphology:
              'Aus dem Niederdeutschen „flau“ = schwach, matt, kraftlos. Klinisches Äquivalent: vegetative Begleitsymptomatik / Nausea.',
            clinicalUsageNote:
              'Wenn Patienten sagen „Mir ist ganz flau“, dokumentieren Ärzte und Pflegekräfte dies als „Nausea“ oder „orthostatische Kollapsneigung“.',
            dictionarySource: 'Schrimpf · Deutsch für Ärztinnen und Ärzte & Pschyrembel',
          },
        ],
      },
      {
        id: 'ex-pc-2',
        timestamp: '07:17 Uhr · Zimmer 402',
        speakerRole: 'Pflegefachkraft (Caregiver/Nurse)',
        speakerName: 'Jonas Bergmann (Gesundheits- und Krankenpfleger)',
        sentenceDe:
          '„Bleiben Sie bitte noch ganz ruhig auf dem Rücken liegen, Frau Hartmann. Ich kontrolliere zuerst den Wundverband auf Nachblutungen und verabreiche Ihnen über die Venenverweilkanüle ein Schmerzmittel sowie ein Mittel gegen die Übelkeit.“',
        sentenceEn:
          '"Please stay lying calmly on your back for now, Ms. Hartmann. First I will check the wound dressing for any secondary bleeding and administer a painkiller and an anti-nausea medication through your IV cannula."',
        sentenceGrammarAndToneDe:
          'Empathische, strukturierte Handlungsankündigung der Pflegekraft im Höflichkeitsimperativ („Bleiben Sie bitte... liegen“) gefolgt vom Präsens zur Beruhigung („Ich kontrolliere zuerst... und verabreiche Ihnen...“).',
        sentenceGrammarAndToneEn:
          'Empathetic, structured bedside nursing reassurance: uses polite imperative ("Bleiben Sie bitte...") followed by clear step-by-step action announcements in the present tense.',
        clinicalContextExplanation:
          'Notice how the caregiver uses clear, patient-understandable German terms ("Wundverband", "Nachblutungen", "Venenverweilkanüle", "Mittel gegen die Übelkeit") rather than overwhelming the patient with Latin jargon ("Sekundärhämorrhagie", "Antiemetikum").',
        analyzedWords: [
          {
            id: 'dw-wundverband',
            surfaceWordInSentence: 'Wundverband',
            baseEntryDe: 'Wundverband / steriler Pflasterverband',
            article: 'der',
            ipa: '[ˈvʊntfɛɐ̯ˌbant]',
            englishTranslation: 'Wound dressing / Surgical bandage',
            layGermanEquivalent: 'das große Pflaster / der Verband',
            pschyrembelDefinitionDe:
              'Keimarme oder sterile Abdeckung einer traumatischen oder operativen Wunde zum Schutz vor Sekundärinfektion, zur Sekretaufnahme und zur Kompression.',
            pschyrembelDefinitionEn:
              'Sterile covering applied to a traumatic or surgical wound to prevent secondary infection, absorb exudate, and provide mechanical protection.',
            etymologyAndMorphology:
              'die Wunde (Vulnus) + der Verband (zu verbinden; Plural: die Wundverbände).',
            clinicalUsageNote:
              'Wichtige Pflegemaßnahme: „der Verbandwechsel (VW)“ unter aseptischen Kautelen (sterile Bedingungen).',
            dictionarySource: 'Pschyrembel Pflege & Klinisches Wörterbuch',
          },
          {
            id: 'dw-nachblutung',
            surfaceWordInSentence: 'Nachblutungen',
            baseEntryDe: 'Nachblutung / postoperative Hämorrhagie',
            article: 'die',
            ipa: '[ˈnaːxˌbluːtʊŋ]',
            englishTranslation: 'Secondary / Post-operative bleeding (Hemorrhage)',
            layGermanEquivalent: 'das erneute Bluten nach der OP',
            pschyrembelDefinitionDe:
              'Postoperativ oder posttraumatisch nach primärer Blutstillung erneut auftretende Blutung (Hämorrhagie) nach außen oder in eine Körperhöhle.',
            pschyrembelDefinitionEn:
              'Recurrent bleeding occurring post-operatively or post-traumatically after initial hemostasis, either externally into dressings or internally.',
            etymologyAndMorphology:
              'Präfix nach- (post-) + die Blutung (-ung = feminin). Fachbegriff: postoperative Hämorrhagie / Hämatombildung.',
            clinicalUsageNote:
              'Bei jedem Verbandscheck prüft die Pflege, ob der Verband „blutig durchgeschlagen“ (soaked through with blood) oder „trocken“ ist.',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Nachblutung“',
          },
          {
            id: 'dw-venenverweilkanuele',
            surfaceWordInSentence: 'Venenverweilkanüle',
            baseEntryDe: 'periphere Venenverweilkanüle (pVK / Viggo / Braunüle)',
            article: 'die',
            ipa: '[ˈveːnənfɛɐ̯ˈvaɪ̯lkaˌnyːlə]',
            englishTranslation: 'Peripheral venous cannula / IV line',
            layGermanEquivalent: 'der Tropf / der Zugang am Arm / die Nadel',
            pschyrembelDefinitionDe:
              'In eine periphere Vene eingeführter flexibler Kunststoffkatheter zur intermittierenden oder kontinuierlichen intravenösen Applikation von Infusionen und Medikamenten.',
            pschyrembelDefinitionEn:
              'Flexible plastic catheter inserted into a peripheral vein for intermittent or continuous intravenous administration of fluids and medications.',
            etymologyAndMorphology:
              'die Vene + verweilen (bleiben) + die Kanüle (frz. canule = kleines Röhrchen). Klinik-Synonyme: pVK, Viggo, Braunüle, Flexüle.',
            clinicalUsageNote:
              'Pflegekräfte prüfen täglich die Einstichstelle auf Rötung (Rubor), Schwellung (Tumor) und Schmerz (Dolor) zum Ausschluss einer Thrombophlebitis.',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Venenverweilkanüle“',
          },
        ],
      },
      {
        id: 'ex-pc-3',
        timestamp: '07:40 Uhr · Zimmer 402',
        speakerRole: 'Pflegefachkraft (Caregiver/Nurse)',
        speakerName: 'Jonas Bergmann (Gesundheits- und Krankenpfleger)',
        sentenceDe:
          '„So, das Schmerzmittel wirkt jetzt. Wir setzen uns nun langsam an die Bettkante zur Frühmobilisation, um einer Thrombose und einer Lungenentzündung vorzubeugen.“',
        sentenceEn:
          '"Now that the painkiller is working, we will sit up slowly on the edge of the bed for early mobilization to prevent a blood clot (thrombosis) and pneumonia."',
        sentenceGrammarAndToneDe:
          'Motivierender „Wir“-Stil in der Pflege („Wir setzen uns langsam...“) kombiniert mit einer um + zu-Finalsatzkonstruktion („um ... vorzubeugen“ + Dativ) zur Patientenaufklärung.',
        sentenceGrammarAndToneEn:
          'Collaborative nursing "We" form ("Wir setzen uns...") combined with an "um ... zu" purpose clause explaining WHY mobilization is medically essential ("vorbeugen" takes the Dative case: einer Thrombose vorbeugen).',
        clinicalContextExplanation:
          'Explaining the medical purpose of post-op mobilization ("Thromboseprophylaxe" and "Pneumonieprophylaxe") significantly increases patient compliance despite post-op soreness.',
        analyzedWords: [
          {
            id: 'dw-fruehmobilisation',
            surfaceWordInSentence: 'Frühmobilisation',
            baseEntryDe: 'postoperative Frühmobilisation',
            article: 'die',
            ipa: '[ˈfʁyːmobilizaˌt͡si̯oːn]',
            englishTranslation: 'Early post-operative mobilization',
            layGermanEquivalent: 'das erste Aufstehen und Bewegen nach der OP',
            pschyrembelDefinitionDe:
              'Frühzeitige, meist noch am Operationstag oder ersten postoperativen Tag beginnende aktive und passive Bewegungsförderung zur Vermeidung immobilisationsbedingter Komplikationen.',
            pschyrembelDefinitionEn:
              'Early initiation of active and passive movement on the day of surgery or post-op day 1 to prevent immobilization-related complications.',
            etymologyAndMorphology:
              'früh- + lat. mobilis (beweglich) + -ation (feminin).',
            clinicalUsageNote:
              'Stufenweise Mobilisation: 1. im Bett aufrichten → 2. an die Bettkante setzen (Kreislaufkontrolle!) → 3. vor dem Bett stehen → 4. auf dem Flur gehen.',
            dictionarySource: 'Pschyrembel Pflege & Thieme Checkliste Chirurgie',
          },
          {
            id: 'dw-vorbeugen',
            surfaceWordInSentence: 'vorzubeugen',
            baseEntryDe: 'vorbeugen (+ Dativ) / Prophylaxe betreiben',
            article: 'Verb / Adj.',
            ipa: '[ˈfoːɐ̯ˌbɔɪ̯ɡn̩]',
            englishTranslation: 'To prevent / To take prophylactic measures against',
            layGermanEquivalent: 'verhindern / schützen vor',
            pschyrembelDefinitionDe:
              'Präventive Maßnahme (Prophylaxe) zur Verhütung von Begleiterkrankungen wie tiefer Beinvenenthrombose (TVT), Dekubitus oder nosokomialer Pneumonie.',
            pschyrembelDefinitionEn:
              'Preventive clinical measure (prophylaxis) to avert secondary hospital complications such as DVT, pressure ulcers, or pneumonia.',
            etymologyAndMorphology:
              'Trennbares deutsches Verb mit Dativ-Objekt: „Ich beuge einer Thrombose vor.“ Substantiv: die Vorbeugung / die Prophylaxe.',
            clinicalUsageNote:
              'In der Pflegeplanung: Thromboseprophylaxe, Pneumonieprophylaxe, Dekubitusprophylaxe (Wundliegen), Sturzprophylaxe.',
            dictionarySource: 'Cornelsen · Menschen im Beruf Medizin & Pschyrembel',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // CATEGORY 2: DOCTOR ↔ CAREGIVER (ARZT ↔ PFLEGE) REAL-TIME SITUATIONS
  // ==========================================================================
  {
    id: 'scen-dc-sepsis',
    category: 'doctor_caregiver',
    code: 'INTERDISZIPLINÄRE ÜBERGABE · SBAR-PROTOKOLL (ARZT ↔ PFLEGE)',
    wardSettingDe: 'Innere Medizin / Überwachungsstation (IMC) · Akute Verschlechterung bei Urosepsis',
    wardSettingEn: 'Internal Medicine / Intermediate Care (IMC) · Acute Deterioration in Urosepsis',
    titleDe: 'Akute Dienstübergabe & Ärztliche Anordnung bei beginnender Urosepsis',
    titleEn: 'Urgent Nurse-to-Doctor Escalation & Physician Orders in Incipient Urosepsis',
    summaryDe:
      'Interprofessionelle Echtzeit-Kommunikation zwischen Pflegefachkraft und Stationsärztin: Meldung kritischer Vitalparameter (Vigilanzminderung, Tachykardie, Hypotonie, Oligurie) und präzise ärztliche Therapieanordnung.',
    summaryEn:
      'Real-time interprofessional SBAR communication between a ward nurse and the attending resident physician: reporting critical vital signs (altered mental status, tachycardia, hypotension, oliguria) and issuing immediate clinical orders.',
    sourceBooks: 'Herold Innere Medizin (2026) · Pschyrembel Klinisches Wörterbuch · Elsevier FSP Fälle',
    vitalSignsContext: 'RR 88/54 mmHg · HF 118/min · Temp 39,3 °C · AF 26/min · SpO₂ 91% · qSOFA 3/3',
    exchanges: [
      {
        id: 'ex-dc-1',
        timestamp: '14:20 Uhr · Stationsstützpunkt IMC',
        speakerRole: 'Pflegefachkraft (Caregiver/Nurse)',
        speakerName: 'Schwester Miriam (Fachgesundheits- und Krankenpflegerin)',
        sentenceDe:
          '„Frau Dr. Novak, Herr Baumann in Zimmer 12 mit der akuten Pyelonephritis verschlechtert sich akut: Er ist zunehmend somnolent, tachykard mit 118 Schlägen pro Minute, hypoton bei 88 zu 54, und im Blasenkatheter-Beutel zeigt sich seit vier Stunden eine ausgeprägte Oligurie.“',
        sentenceEn:
          '"Dr. Novak, Mr. Baumann in Room 12 with acute pyelonephritis is deteriorating acutely: he is increasingly somnolent (drowsy), tachycardic at 118 bpm, hypotensive at 88/54, and his urinary catheter bag shows marked oliguria over the past four hours."',
        sentenceGrammarAndToneDe:
          'Prägnante interprofessionelle Übergabe nach dem SBAR-Schema (Situation, Background, Assessment, Recommendation) unter Verwendung exakter klinischer Adjektive („somnolent, tachykard, hypoton“) und Fachtermini.',
        sentenceGrammarAndToneEn:
          'Concise interprofessional SBAR handover using high-density clinical German predicate adjectives ("somnolent, tachykard, hypoton") and precise pathophysiological nouns ("Pyelonephritis, Oligurie").',
        clinicalContextExplanation:
          'Between nurses and doctors in German hospitals, clinical adjectives are used predicatively without endings ("er ist somnolent, tachykard und hypoton"). This signals all 3 qSOFA sepsis criteria within one sentence.',
        analyzedWords: [
          {
            id: 'dw-somnolent',
            surfaceWordInSentence: 'somnolent',
            baseEntryDe: 'Somnolenz / somnolent (Vigilanzminderung)',
            article: 'die',
            ipa: '[zɔmnoˈlɛnt]',
            englishTranslation: 'Somnolent / Pathologically drowsy (arousable by voice/touch)',
            layGermanEquivalent: 'schläfrig / benommen / schwer erweckbar',
            pschyrembelDefinitionDe:
              'Leichteste Form der quantitativen Bewusstseinsstörung (Vigilanzminderung) mit abnormer Schläfrigkeit, aus der der Patient durch äußere Ansprache oder leichte Schmerzreize noch weckbar ist.',
            pschyrembelDefinitionEn:
              'Mildest grade of quantitative consciousness impairment characterized by abnormal drowsiness from which the patient can still be aroused by verbal stimuli.',
            etymologyAndMorphology:
              'lat. somnolentus (schläfrig, zu somnus = Schlaf). Abstufung der Vigilanz: klar/wach → somnolent → soporös (nur durch starken Schmerzreiz weckbar) → komatös (nicht weckbar).',
            clinicalUsageNote:
              'Eine neu aufgetretene Somnolenz bei Infektion ist ein Warnsymptom für eine septische Enzephalopathie (qSOFA-Kriterium!).',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Somnolenz / Vigilanz“',
          },
          {
            id: 'dw-tachykard-hypoton',
            surfaceWordInSentence: 'tachykard ... hypoton',
            baseEntryDe: 'Tachykardie & arterielle Hypotonie (Schockindex > 1)',
            article: 'die',
            ipa: '[taxʏˈkaʁt / hypɔˈtoːn]',
            englishTranslation: 'Tachycardic (HR > 100/min) & Hypotensive (Systolic BP < 90–100 mmHg)',
            layGermanEquivalent: 'Herzrasen und zu niedriger Blutdruck',
            pschyrembelDefinitionDe:
              'Gleichzeitiges Vorliegen einer erhöhten Herzfrequenz (> 100/min) und eines erniedrigten arteriellen Blutdrucks (< 100/60 mmHg) als Ausdruck einer hämodynamischen Instabilität (positiver Schockindex = HF/RRsys > 1,0).',
            pschyrembelDefinitionEn:
              'Simultaneous presence of elevated heart rate (> 100 bpm) and low arterial blood pressure, indicating hemodynamic instability (positive shock index = HR/SBP > 1.0).',
            etymologyAndMorphology:
              'griech. tachys (schnell) + kardia (Herz); griech. hypo (unter) + tonos (Spannung, Druck).',
            clinicalUsageNote:
              'Hier beträgt der Schockindex 118 / 88 = 1,34 (Norm: 0,5–0,7) → akuter septischer Schock droht!',
            dictionarySource: 'Herold Innere Medizin & Pschyrembel · Stichwort „Schockindex“',
          },
          {
            id: 'dw-oligurie',
            surfaceWordInSentence: 'Oligurie',
            baseEntryDe: 'Oligurie (verminderte Diurese)',
            article: 'die',
            ipa: '[oliɡuˈʁiː]',
            englishTranslation: 'Oliguria (Decreased urine output < 500 mL/24h or < 0.5 mL/kg/h)',
            layGermanEquivalent: 'kaum noch Urinausscheidung',
            pschyrembelDefinitionDe:
              'Pathologische Verminderung der Harnausscheidung (Diurese) auf weniger als 500 ml pro 24 Stunden bzw. < 0,5 ml/kg KG/Stunde, meist infolge prärenaler Minderperfusion oder akuter Nierenschädigung (AKI).',
            pschyrembelDefinitionEn:
              'Pathological reduction of urine output to < 500 mL/24h or < 0.5 mL/kg/h, typically due to prerenal hypoperfusion or acute kidney injury (AKI).',
            etymologyAndMorphology:
              'griech. oligos (wenig) + ouron (Harn). Abgrenzung: Anurie = < 100 ml/24h; Polyurie = > 2500 ml/24h.',
            clinicalUsageNote:
              'Die Stunden-Diurese über den transurethralen Dauerkatheter (DK) ist einer der sensitivsten Parameter für die Organperfusion im Schock.',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Oligurie“',
          },
        ],
      },
      {
        id: 'ex-dc-2',
        timestamp: '14:21 Uhr · Stationsstützpunkt IMC',
        speakerRole: 'Stationsarzt / Oberarzt (Doctor)',
        speakerName: 'Dr. med. Elena Novak (Assistenzärztin Innere Medizin)',
        sentenceDe:
          '„Danke für die sofortige Meldung, Miriam — ich komme direkt mit ins Zimmer. Bitte hängen Sie umgehend 1000 ml kristalloide Vollelektrolytlösung im Schuss an, geben Sie 4 Liter Sauerstoff über die Nasenbrille, und richten Sie zwei Paar Blutkulturen sowie eine arterielle Blutgasanalyse mit Laktat her.“',
        sentenceEn:
          '"Thank you for reporting this immediately, Miriam — I am coming straight to the room with you. Please hang 1000 mL of balanced crystalloid fluid as a rapid bolus right away, start 4 L/min of oxygen via nasal cannula, and prepare two sets of blood cultures plus an arterial blood gas with lactate."',
        sentenceGrammarAndToneDe:
          'Klare, wertschätzende ärztliche Anordnung im Team (Closed-Loop-Kommunikation): Kombination aus sofortiger Präsenz („ich komme direkt mit“) und präzisen delegierbaren Maßnahmen im Höflichkeitsimperativ.',
        sentenceGrammarAndToneEn:
          'Clear, respectful physician order using Closed-Loop Communication: combines immediate bedside presence ("ich komme direkt mit") with prioritized 1-Hour Sepsis Bundle delegations.',
        clinicalContextExplanation:
          'This sentence implements the official German S3 Sepsis Guideline (1-Hour Bundle): 1. Crystalloid fluid resuscitation ("im Schuss anhängen"), 2. Oxygen supplementation ("über die Nasenbrille"), 3. Blood cultures ("Blutkulturen"), and 4. Arterial lactate measurement ("BGA mit Laktat").',
        analyzedWords: [
          {
            id: 'dw-im-schuss',
            surfaceWordInSentence: 'im Schuss anhängen',
            baseEntryDe: 'Infusion im Schuss / rasche Volumensubstitution (Bolusgabe)',
            article: 'die',
            ipa: '[ɪm ʃʊs ˈanhɛŋən]',
            englishTranslation: 'To run an IV fluid bolus wide open / rapidly',
            layGermanEquivalent: 'Flüssigkeit ganz schnell über den Tropf geben',
            pschyrembelDefinitionDe:
              'Klinischer Fachjargon für die ungedrosselte, schnellstmögliche intravenöse Infusionstherapie (Volumenbolus) bei akuter Hypovolämie oder distributivem (septischem) Schock.',
            pschyrembelDefinitionEn:
              'Authentic German hospital terminology for running an intravenous fluid infusion wide open as a rapid bolus in acute hypovolemia or septic shock.',
            etymologyAndMorphology:
              '„eine Infusion anhängen“ (an den Infusionsständer hängen und anschließen) + „im Schuss“ (mit voll geöffnetem Rollenklemmen-Regler).',
            clinicalUsageNote:
              'Gegenteil im Klinikalltag: „auf Tropfgeschwindigkeit / langsam laufen lassen“ oder „über Infusionspumpe (Perfusor / Infusomat)“. ',
            dictionarySource: 'Elsevier FSP Klinikjargon & Herold Innere Medizin (Sepsis-Bundle)',
          },
          {
            id: 'dw-blutkulturen',
            surfaceWordInSentence: 'Blutkulturen',
            baseEntryDe: 'Blutkultur (aerob / anaerob)',
            article: 'die (Pl.)',
            ipa: '[ˈbluːtkʊlˌtuːʁən]',
            englishTranslation: 'Blood cultures (aerobic & anaerobic bottles)',
            layGermanEquivalent: 'spezielle Blutproben zum Nachweis von Bakterien im Blut',
            pschyrembelDefinitionDe:
              'Mikrobiologisches Nachweisverfahren zur Anzucht von Bakterien oder Pilzen aus venös entnommenem Vollblut bei Verdacht auf Bakteriämie, Sepsis oder Endokarditis (jeweils 1 aerobe + 1 anaerobe Flasche).',
            pschyrembelDefinitionEn:
              'Microbiological diagnostic culture of venous whole blood to identify bacteria or fungi in suspected bacteremia, sepsis, or endocarditis.',
            etymologyAndMorphology:
              'das Blut + lat. cultura (Pflege, Anzucht; Singular: die Blutkultur).',
            clinicalUsageNote:
              'Goldene Klinikregel: „Blutkulturen (mindestens 2 Paare aus verschiedenen Punktionsstellen) immer VOR Beginn oder Umstellung der intravenösen Antibiotikatherapie abnehmen!“',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Blutkultur“',
          },
          {
            id: 'dw-blutgasanalyse',
            surfaceWordInSentence: 'Blutgasanalyse mit Laktat',
            baseEntryDe: 'Blutgasanalyse (BGA) & Serum-Laktat',
            article: 'die',
            ipa: '[ˈbluːtɡaːzanaˌlyːzə]',
            englishTranslation: 'Blood gas analysis (ABG/VBG) with lactate',
            layGermanEquivalent: 'Bluttest für Sauerstoff, Säurewert und Durchblutung',
            pschyrembelDefinitionDe:
              'Labordiagnostische Sofortbestimmung (Point-of-Care) von pO₂, pCO₂, pH-Wert, Basenüberschuss (BE), Bikarbonat, Elektrolyten und Laktat (Marker für Gewebehypoxie / anaerobe Glykolyse).',
            pschyrembelDefinitionEn:
              'Point-of-care diagnostic measurement of pO2, pCO2, pH, base excess, bicarbonate, electrolytes, and lactate (marker of tissue hypoperfusion).',
            etymologyAndMorphology:
              'das Blutgas + griech. analysis (Auflösung, Untersuchung; feminin: die Analyse). Abkürzung: die BGA.',
            clinicalUsageNote:
              'Ein arterielles Laktat > 2 mmol/l trotz Volumengabe ist zusammen mit Vasopressorbedarf (Noradrenalin) das Definitionskriterium des septischen Schocks.',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch & Herold Innere Medizin',
          },
        ],
      },
      {
        id: 'ex-dc-3',
        timestamp: '14:22 Uhr · Stationsstützpunkt IMC',
        speakerRole: 'Pflegefachkraft (Caregiver/Nurse)',
        speakerName: 'Schwester Miriam (Fachgesundheits- und Krankenpflegerin)',
        sentenceDe:
          '„Verstanden: Ich hänge sofort 1000 ml Ringer-Acetat im Schuss an, gebe 4 Liter Sauerstoff und bereite die Blutkulturen sowie die BGA vor. Soll ich auch schon das kalkulierte Breitbandantibiotikum Piperacillin/Tazobactam zur Kurzinfusion aufziehen?“',
        sentenceEn:
          '"Understood: I am hanging 1000 mL of Ringer’s acetate as a bolus right away, starting 4 L of oxygen, and preparing the blood cultures and ABG. Should I also draw up the empirical broad-spectrum antibiotic Piperacillin/Tazobactam for short infusion?"',
        sentenceGrammarAndToneDe:
          'Vorbildliches „Read-Back“ (Wiederholen der Anordnung zur Fehlervermeidung) + proaktive Rückfrage der Pflegekraft mit „Soll ich auch schon ... aufziehen?“. ',
        sentenceGrammarAndToneEn:
          'Exemplary Closed-Loop "Read-Back" confirming exact dosages and actions, followed by a proactive nursing question ("Soll ich auch schon ... aufziehen?").',
        clinicalContextExplanation:
          'In German hospital practice, "ein Medikament aufziehen" means drawing up a reconstituted medication into a syringe or preparing an IV piggyback ("Kurzinfusion").',
        analyzedWords: [
          {
            id: 'dw-breitbandantibiotikum',
            surfaceWordInSentence: 'Breitbandantibiotikum',
            baseEntryDe: 'kalkuliertes Breitbandantibiotikum (Breitspektrum-Antibiotikum)',
            article: 'das',
            ipa: '[ˈbʁaɪ̯tbantʔantiˌbi̯oːtikʊm]',
            englishTranslation: 'Empirical broad-spectrum antibiotic',
            layGermanEquivalent: 'starkes Antibiotikum gegen viele verschiedene Bakterien',
            pschyrembelDefinitionDe:
              'Antiinfektivum mit breitem Wirkspektrum gegen sowohl grampositive als auch gramnegative Erreger, das in der kalkulierten (empirischen) Initialtherapie vor Vorliegen des Antibiogramms eingesetzt wird.',
            pschyrembelDefinitionEn:
              'Antimicrobial agent active against a wide range of Gram-positive and Gram-negative bacteria, used empirically before microbiological susceptibility results (antibiogram) are available.',
            etymologyAndMorphology:
              'breit + das Band (Spektrum) + das Antibiotikum (Plural: die Antibiotika; Endung -um = neutrum). „Kalkuliert“ = empirisch gezielt ausgewählt.',
            clinicalUsageNote:
              'Sobald das Ergebnis der Blutkultur vorliegt, erfolgt die „Deeskalation nach Antibiogramm“ (gezielte Schmalspektrum-Therapie).',
            dictionarySource: 'Pschyrembel Klinisches Wörterbuch · Stichwort „Antibiotika / Kalkulierte Therapie“',
          },
          {
            id: 'dw-kurzinfusion',
            surfaceWordInSentence: 'Kurzinfusion ... aufziehen',
            baseEntryDe: 'Kurzinfusion (KI) & Medikament aufziehen',
            article: 'die',
            ipa: '[ˈkʊʁt͡sʔɪnfuˌzi̯oːn]',
            englishTranslation: 'Short IV piggyback infusion (15–30 min) & drawing up medication',
            layGermanEquivalent: 'kleine Infusion über 20 Minuten',
            pschyrembelDefinitionDe:
              'Intravenöse Verabreichung eines in 50–100 ml Trägerlösung (z.B. NaCl 0,9 %) gelösten Arzneimittels über einen Zeitraum von 15 bis 60 Minuten.',
            pschyrembelDefinitionEn:
              'Intravenous administration of a medication diluted in 50–100 mL of carrier solution (e.g., 0.9% NaCl) over 15 to 60 minutes.',
            etymologyAndMorphology:
              'kurz + lat. infusio (Eingießen; feminin: die Infusion). Verb: „aufziehen“ (Flüssigkeit in eine Spritze ziehen / auflösen).',
            clinicalUsageNote:
              'In der Fieberkurve / Stationsdokumentation wird Kurzinfusion als „KI“ abgekürzt (z.B. „Pip/Taz 4,5 g als KI 3× tgl. i.v.“).',
            dictionarySource: 'Pschyrembel Pflege & Cornelsen Medizin',
          },
        ],
      },
    ],
  },
];
