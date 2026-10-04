import { BookSourceId, UILanguage } from './medicalLexicon';

export const TERM_ENGLISH_DATA: Record<
  string,
  {
    patientPhrasingEn: string;
    definitionEn: string;
    arztbriefSnippetEn: string;
    fspTipEn: string;
  }
> = {
  'term-01': {
    patientPhrasingEn: '"My vision suddenly went black and I briefly passed out."',
    definitionEn:
      'Sudden, brief, and spontaneously reversible loss of consciousness resulting from global cerebral hypoperfusion with loss of postural tone.',
    arztbriefSnippetEn:
      'Inpatient admission followed the first occurrence of a brief orthostatic syncope without evidence of a postictal twilight state.',
    fspTipEn:
      'In the Arztbrief, strictly differentiate between "Synkope" (with complete loss of consciousness) and "Präsynkope / Kollapsneigung" (near-fainting without loss of consciousness). Use Konjunktiv I: "Der Patient gibt an, ihm sei schwarz vor Augen geworden."',
  },
  'term-02': {
    patientPhrasingEn: '"My left arm suddenly felt numb and I could no longer pronounce words properly."',
    definitionEn:
      'Acute focal neurological deficit of vascular origin, caused by cerebral ischemia (approx. 85%) or intracerebral hemorrhage (approx. 15%).',
    arztbriefSnippetEn:
      'Clinically and neurologically on admission, there was a brachiofacially predominant left hemiparesis (MRC grade 3/5) and moderate dysarthria with suspected acute MCA infarction.',
    fspTipEn:
      'When stroke (Apoplex) or TIA is suspected in the FSP exam, always ask about the exact time of symptom onset ("Time is Brain" / thrombolysis window < 4.5 hours) and whether the patient takes anticoagulants.',
  },
  'term-03': {
    patientPhrasingEn: '"Everything spins like a carousel, especially when I turn my head in bed."',
    definitionEn:
      'Perceived illusion of motion between one’s body and the environment or unpleasant disturbance of spatial orientation (vestibular vs. non-vestibular).',
    arztbriefSnippetEn:
      'The patient complains of paroxysmal, position-dependent spinning vertigo lasting seconds for the past three days, accompanied by nausea.',
    fspTipEn:
      'In the FSP exam, the classic differentiation question scores points: "Carousel (Drehschwindel → often peripheral vestibular) or boat (Schwankschwindel → often central/cardiovascular)?"',
  },
  'term-04': {
    patientPhrasingEn: '"Solid food literally gets stuck in my throat behind my breastbone."',
    definitionEn:
      'Swallowing disorder in the oral, pharyngeal, or esophageal phase, frequently associated with regurgitation or aspiration risk (with pain = Odynophagie).',
    arztbriefSnippetEn:
      'History reveals a 6-week progressive dysphagia for solid foods as well as unintentional weight loss of 6 kg (B-symptoms).',
    fspTipEn:
      'Distinguish precisely: "Dysphagie" = mechanical or neurogenic swallowing disorder; "Odynophagie" = pain upon swallowing.',
  },
  'term-05': {
    patientPhrasingEn: '"After climbing one flight of stairs I can barely breathe and have to stop."',
    definitionEn:
      'Subjective sensation of labored breathing or air hunger, objectively often accompanied by tachypnea, use of accessory respiratory muscles, or orthopnea.',
    arztbriefSnippetEn:
      'Presentation occurred due to cardiac decompensation with marked exertional dyspnea (NYHA III), nocturnal orthopnea, and bilateral pretibial lower leg edema.',
    fspTipEn:
      'When a patient reports shortness of breath ("Luftnot"), always ask how many pillows they sleep with — in the German Arztbrief this is documented concisely as "Orthopnoe".',
  },
  'term-06': {
    patientPhrasingEn: '"It feels as if a heavy stone or an iron band is lying across my chest."',
    definitionEn:
      'Paroxysmal retrosternal pain or crushing pressure and tightness caused by acute myocardial ischemia in coronary artery disease (KHK).',
    arztbriefSnippetEn:
      'On admission, the patient described progressive stenocardia (NRS 8/10) persisting for two hours with radiation into the left upper extremity and autonomic symptoms (cold sweats, nausea).',
    fspTipEn:
      'Use the clinical synonym "Stenokardien" for angina pectoris complaints in the Arztbrief. Always ask for the Numeric Rating Scale (NRS 0–10) during the pain history.',
  },
  'term-07': {
    patientPhrasingEn: '"When coughing up phlegm this morning, there were suddenly red streaks of blood in the mucus."',
    definitionEn:
      'Expectoration of blood-tinged sputum (Hämoptyse) or larger amounts of pure blood (Hämoptoe) from the lower respiratory tract or lung parenchyma.',
    arztbriefSnippetEn:
      'The 62-year-old patient (smoking history: 45 pack years) presents for bronchoscopic evaluation due to hemoptysis for two weeks, night sweats, and unintentional weight loss.',
    fspTipEn:
      'Do not confuse: "Hämoptyse" = coughing up blood (respiratory tract/lungs) vs. "Hämatemesis" = vomiting blood (upper gastrointestinal tract).',
  },
  'term-08': {
    patientPhrasingEn: '"After fatty food or coffee, it burns behind my breastbone all the way up into my throat."',
    definitionEn:
      'Burning pain rising from the epigastrium behind the sternum into the pharynx due to reflux of acidic gastric contents into the esophagus.',
    arztbriefSnippetEn:
      'History shows recurrent postprandial pyrosis and nocturnal regurgitation for several months; empirical PPI therapy (Pantoprazole 40 mg) resulted in marked improvement.',
    fspTipEn:
      'Never tell a patient in the FSP exam "Wir machen eine ÖGD"; translate into lay German: "Wir führen eine Magenspiegelung mit einer dünnen Kamera über die Speiseröhre durch" (We perform a stomach endoscopy with a thin camera via the esophagus).',
  },
  'term-09': {
    patientPhrasingEn: '"Since yesterday my stool has been shiny jet-black like tar and smells extremely foul."',
    definitionEn:
      'Shiny black, sticky, and characteristically foul-smelling stool caused by hematin formation when hemoglobin contacts gastric acid (upper GI bleed).',
    arztbriefSnippetEn:
      'With long-term NSAID overuse (Ibuprofen 3×600 mg/d for knee osteoarthritis), the patient presented with epigastric tenderness, melena, and normocytic anemia (Hb 8.4 g/dL).',
    fspTipEn:
      'Classic FSP examiner question: "When is black stool NOT melena?" → After taking iron supplements (Eisenpräparate), activated charcoal (Aktivkohle), or eating large amounts of blueberries/licorice.',
  },
  'term-10': {
    patientPhrasingEn: '"My wife noticed that the whites of my eyes and my skin have turned completely yellow."',
    definitionEn:
      'Yellow discoloration of skin, mucous membranes, and first the sclerae (at serum bilirubin > 2 mg/dL) due to pre-, intra-, or post-hepatic hyperbilirubinemia.',
    arztbriefSnippetEn:
      'Clinically, marked cutaneous and scleral icterus was evident in post-hepatic cholestasis (total bilirubin 9.8 mg/dL) secondary to sonographically confirmed choledocholithiasis.',
    fspTipEn:
      'Memorize the classic triad of post-hepatic obstructive jaundice for the Arztbrief: 1. Scleral/skin icterus, 2. acholic (pale/clay-colored) stool, 3. dark beer-brown urine (+ pruritus).',
  },
  'term-11': {
    patientPhrasingEn: '"The stomach pain started yesterday around my belly button and now sits knife-sharp in the lower right side."',
    definitionEn:
      'Acute inflammation of the vermiform appendix of the cecum with characteristic pain migration from the periumbilical/epigastric region to the right lower quadrant.',
    arztbriefSnippetEn:
      'On palpation, the abdomen showed localized guarding in the right lower quadrant, positive McBurney, Lanz, and Rovsing signs, and contralateral rebound tenderness (Blumberg sign).',
    fspTipEn:
      'Anatomy distinction: In lay German everyone says "Blinddarmentzündung" (cecum inflammation), but anatomically it is the vermiform appendix ("der Wurmfortsatz" / "die Appendix vermiformis") that is inflamed.',
  },
  'term-12': {
    patientPhrasingEn: '"I have to go to the toilet every ten minutes for a few drops and it burns like fire when passing water."',
    definitionEn:
      'Painful, difficult urination (Dysurie/Algurie) combined with frequent urge to void small amounts without increased total urine volume (Pollakisurie).',
    arztbriefSnippetEn:
      'In the review of systems, the patient reports alguria, pollakiuria, and gross hematuria for three days; fever and flank pain are denied.',
    fspTipEn:
      'Distinguish strictly in the Arztbrief: "Pollakisurie" (frequent small-volume urination, e.g., cystitis), "Polyurie" (increased total daily urine output > 2.5 L/day, e.g., diabetes), and "Nykturie" (nocturia > 2×/night, e.g., heart failure/BPH).',
  },
  'term-13': {
    patientPhrasingEn: '"I have wave-like, unbearable pain in my right flank that pulls down into my groin."',
    definitionEn:
      'Stone formation in the renal calyces/pelvis (Nephrolithiasis) or urinary tract (Ureterolithiasis), triggering acute renal colic when impacted.',
    arztbriefSnippetEn:
      'Admission via the Emergency Department for acute right renal colic (NRS 9/10) with microhematuria on urinalysis and sonographic evidence of ureterolithiasis.',
    fspTipEn:
      'Clinical pearl for FSP case presentation: Patients with biliary or renal colic are restless and pace around; patients with peritonitis lie completely still due to movement-induced pain.',
  },
  'term-14': {
    patientPhrasingEn: '"I slipped on the icy sidewalk and caught myself with my outstretched right hand."',
    definitionEn:
      'Most common human fracture at the distal end of the radius, typically an extension fracture (Colles fracture) caused by falling onto an outstretched dorsiflexed hand.',
    arztbriefSnippetEn:
      'Following a fall onto the dorsiflexed right hand, clinical examination revealed marked swelling and painful functional restriction of the right wrist with intact distal neurovascular status (pDMS).',
    fspTipEn:
      'In every trauma case presentation in the FSP, proactively state: "Die periphere Durchblutung, Motorik und Sensibilität (pDMS) war distal der Verletzung intakt" and ask about tetanus vaccination status.',
  },
  'term-15': {
    patientPhrasingEn: '"When lifting a heavy crate of water, a lightning-like pain suddenly shot into my lower back."',
    definitionEn:
      'Acute low back pain (Lumbago); when a herniated disc compresses a nerve root, it causes radicular pain radiating down into the leg (Lumboischialgie / sciatica).',
    arztbriefSnippetEn:
      'Clinically, there is acute right lumboischialgia with L5 dermatome hypesthesia and foot dorsiflexion paresis (MRC 4/5); cauda equina syndrome (bladder/bowel dysfunction, saddle anesthesia) is absent.',
    fspTipEn:
      'Red flags for back pain in the FSP: Always ask about bladder/bowel dysfunction ("Blasen- und Mastdarmstörungen") and saddle anesthesia ("Reithosenanästhesie") to rule out cauda equina syndrome.',
  },
  'term-16': {
    patientPhrasingEn: '"After the long-haul flight, my left calf has been tightly swollen, warm, and bluish-red since yesterday."',
    definitionEn:
      'Partial or complete occlusion of a deep conducting vein of the lower extremity by an intravascular thrombus, carrying the risk of secondary pulmonary embolism (LAE).',
    arztbriefSnippetEn:
      'Given a high clinical Wells score (unilateral left lower leg swelling after immobilization, positive Meyer and Payr signs), compression ultrasound confirmed a 3-level deep vein thrombosis on the left.',
    fspTipEn:
      'In every suspected DVT (TVT) case, think of Virchow’s triad (immobilization/flight, endothelial injury/surgery, hypercoagulability/malignancy/contraceptives) and ask about dyspnea/chest pain (pulmonary embolism!).',
  },
  'term-17': {
    patientPhrasingEn: '"After walking 150 meters my right calf cramps so badly that I have to stop in front of every shop window."',
    definitionEn:
      'Ischemic, exertion-dependent muscle pain (usually in the calf) in peripheral arterial disease (pAVK) that forces the patient to stop after a defined walking distance.',
    arztbriefSnippetEn:
      'History and examination show right femoropopliteal peripheral arterial disease (pAVK) Fontaine stage IIb with an ankle-brachial index (ABI) of 0.55.',
    fspTipEn:
      'Pain-free walking distance determines the Fontaine stage in German hospitals: > 200 m = Stage IIa (conservative walking training), < 200 m = Stage IIb (interventional angioplasty/PTA).',
  },
  'term-18': {
    patientPhrasingEn: '"I have a fever up to 39.2°C in the evenings and sweat so heavily at night that I have to change my pajama shirt."',
    definitionEn:
      'Elevation of core body temperature > 38.0°C (subfebrile: 37.5–38.0°C; febrile > 38.0°C). Oncological/infectious B-symptoms comprise the triad of fever, drenching night sweats, and weight loss > 10% in 6 months.',
    arztbriefSnippetEn:
      'The 54-year-old patient presents in reduced general condition with positive B-symptoms (subfebrile temperatures up to 38.4°C, drenching night sweats requiring clothes changes, unintentional weight loss of 7 kg in 4 months).',
    fspTipEn:
      'The "vegetative Anamnese" (appetite, weight, sleep, fever/chills, night sweats, urination, bowel movements) must be included in every FSP history — even in surgical cases it earns structural exam points.',
  },
};

export const BOOK_ENGLISH_DATA: Record<
  BookSourceId,
  {
    focusAreaEn: string;
    descriptionEn: string;
    chapterStructureEn: string[];
  }
> = {
  schrimpf: {
    focusAreaEn: 'FSP Exam Communication, Patient History (Anamnese) & Medical Letters (Arztbrief)',
    descriptionEn:
      'Standard German reference textbook for preparing for the State Medical Chamber Fachsprachprüfung (FSP), featuring systematic translation tables (Latin/Greek ↔ Everyday German) and authentic clinical cases.',
    chapterStructureEn: [
      'Ch. 1: Structuring the Anamnesis Interview (Das Anamnesegespräch)',
      'Ch. 2: Pain History & Review of Systems (Schmerz- & Vegetative Anamnese)',
      'Ch. 3: Internal Medicine — Cardiology, Pulmonology, Gastroenterology',
      'Ch. 4: General Surgery, Trauma Surgery & Orthopedics',
      'Ch. 5: Neurology & Psychiatry in Clinical Practice',
    ],
  },
  thieme_anamnesis: {
    focusAreaEn: 'Physical Examination, Clinical Documentation & Cardinal Symptoms',
    descriptionEn:
      'Clinical bedside checklist for structured physical examination findings, providing precise German terminology for inspection, palpation, percussion, and auscultation.',
    chapterStructureEn: [
      'Part A: Principles of Medical Communication (Ärztliche Gesprächsführung)',
      'Part B: Cardinal Symptoms & Differential Diagnoses (Leitsymptome)',
      'Part C: Organ-System Physical Examination (Head to Toe)',
    ],
  },
  elsevier_fsp: {
    focusAreaEn: 'Informed Consent (Patientenaufklärung) & Doctor-to-Doctor Handover',
    descriptionEn:
      'Exam-focused collection of the 60 most frequent FSP clinical simulation cases across German State Medical Chambers, including hospital abbreviations and patient consent explanations.',
    chapterStructureEn: [
      'Section I: Translating Medical Terms for Patients (Fachbegriffe übersetzen)',
      'Section II: Clinical Abbreviations in German Hospitals (Klinik-Abkürzungen)',
      'Section III: 60 Realistic Clinical Cases by Specialty',
    ],
  },
  pschyrembel: {
    focusAreaEn: 'Etymology, Greco-Latin Nomenclature & ICD-10-GM Classification',
    descriptionEn:
      'The most authoritative clinical dictionary in the German-speaking medical world for exact definitions, Greek and Latin word roots, grammatical gender, and clinical classifications.',
    chapterStructureEn: [
      'Clinical Terminology A–Z (Klinische Terminologie)',
      'Prefixes, Suffixes & Word Roots of Medical Nomenclature',
      'Reference Lab Values & Clinical Scores (Normwerte & Scores)',
    ],
  },
  herold: {
    focusAreaEn: 'Pathophysiology, Diagnostics & Discharge Summary Style (Epikrise)',
    descriptionEn:
      'The indispensable Internal Medicine compendium used by resident physicians across Germany. Provides the concise nominal and telegram style required for hospital discharge summaries.',
    chapterStructureEn: [
      'Cardiology & Angiology (Kardiologie & Angiologie)',
      'Pulmonology (Pneumologie)',
      'Gastroenterology & Hepatology (Gastroenterologie & Hepatologie)',
      'Nephrology & Electrolytes (Nephrologie & Elektrolythaushalt)',
    ],
  },
  cornelsen: {
    focusAreaEn: 'Medical Grammar in Arztbrief, Indirect Speech (Konjunktiv I) & Clinical Phrases',
    descriptionEn:
      'Didactic B2/C1 German for Physicians textbook focusing on indirect speech (Konjunktiv I) in medical reports, empathetic patient communication, and interprofessional nursing handovers.',
    chapterStructureEn: [
      'Module 1: Indirect Speech in the Anamnesis Report (Konjunktiv I)',
      'Module 2: Explaining Diagnostic Procedures (Aufklärungsgespräche)',
      'Module 3: Interprofessional Handover with Nursing & Attending Physicians',
    ],
  },
};

export function t(
  lang: UILanguage,
  de: string,
  en: string,
  bilingual?: string
): string {
  if (lang === 'en') return en;
  if (lang === 'de') return de;
  return bilingual ?? `${en} · ${de}`;
}
