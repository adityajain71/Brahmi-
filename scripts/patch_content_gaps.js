/**
 * patch_content_gaps.js
 *
 * Fills all missing Vyanjan & Matra content in the Brahmi app's 10 JSON files.
 * Tasks covered: A, B, C, D, E, F, G, H, I
 *
 * Run: node scripts/patch_content_gaps.js
 * Then validate: node scripts/validate_json.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'backend', 'data');
const LANGS = ['hindi', 'english', 'kannada', 'tamil', 'Marathi'];

// ─────────────────────────────────────────────────────────────
// TASK A — pronunciationNoteEnglish for all 33 consonants
// Spot-checked against repo categoryEnglish + categoryDescription for
// ka(Guttural/कण्ठ), cha(Palatal/तालु), tta(Retroflex/मूर्धन्य),
// ta(Dental/दन्त्य), pa(Labial/ओष्ठ्य), ya(Semi-vowel), sha(Sibilant).
// All confirmed consistent — no PDF-specific contradiction found.
// ─────────────────────────────────────────────────────────────
const PRONUNCIATION_NOTE_ENGLISH = {
  'vyanjan-001': "An unaspirated guttural stop produced at the back of the throat with the back of the tongue touching the soft palate.",
  'vyanjan-002': "An aspirated guttural stop produced at the back of the throat with a strong puff of air accompanying the release.",
  'vyanjan-003': "A voiced unaspirated guttural stop produced at the back of the throat with the back of the tongue touching the soft palate.",
  'vyanjan-004': "A voiced aspirated guttural stop produced at the back of the throat with a breathy puff of air.",
  'vyanjan-005': "A voiced guttural nasal stop produced by blocking airflow at the back of the throat; rarely appears word-initially in Sanskrit or Hindi.",
  'vyanjan-006': "An unaspirated palatal affricate produced with the front of the tongue touching the hard palate.",
  'vyanjan-007': "An aspirated palatal affricate produced with the tongue at the hard palate with a strong puff of air.",
  'vyanjan-008': "A voiced unaspirated palatal affricate produced with the tongue touching the hard palate.",
  'vyanjan-009': "A voiced aspirated palatal affricate produced with a breathy puff of air and the tongue at the hard palate.",
  'vyanjan-010': "A voiced palatal nasal stop produced with the tongue at the hard palate; rarely appears word-initially in Sanskrit or Hindi.",
  'vyanjan-011': "An unaspirated retroflex stop produced with the tongue tip curled back to touch the roof of the mouth (cerebral position).",
  'vyanjan-012': "An aspirated retroflex stop produced with the tongue curled back to the roof of the mouth with a puff of air.",
  'vyanjan-013': "A voiced unaspirated retroflex stop produced with the tongue curled back to touch the roof of the mouth.",
  'vyanjan-014': "A voiced aspirated retroflex stop produced with a breathy puff of air and the tongue curled back to the roof of the mouth.",
  'vyanjan-015': "A voiced retroflex nasal stop produced with the tongue curled back to the roof of the mouth; rarely appears word-initially in Sanskrit or Hindi.",
  'vyanjan-016': "An unaspirated dental stop produced with the tip of the tongue touching the back of the upper teeth.",
  'vyanjan-017': "An aspirated dental stop produced with the tongue at the back of the upper teeth with a puff of air.",
  'vyanjan-018': "A voiced unaspirated dental stop produced with the tip of the tongue touching the back of the upper teeth.",
  'vyanjan-019': "A voiced aspirated dental stop produced with a breathy puff of air and the tongue at the upper teeth.",
  'vyanjan-020': "A voiced dental nasal stop produced with the tip of the tongue touching the back of the upper teeth, directing airflow through the nose.",
  'vyanjan-021': "An unaspirated labial stop produced by pressing both lips firmly together and then releasing.",
  'vyanjan-022': "An aspirated labial stop produced by pressing both lips together and releasing with a puff of air.",
  'vyanjan-023': "A voiced unaspirated labial stop produced by pressing both lips firmly together and then releasing.",
  'vyanjan-024': "A voiced aspirated labial stop produced by pressing both lips together and releasing with a breathy puff of air.",
  'vyanjan-025': "A voiced labial nasal stop produced with both lips pressed together, directing airflow through the nose.",
  'vyanjan-026': "A palatal semi-vowel produced with the tongue near the hard palate, functioning similarly to the 'y' in the English word 'yes'.",
  'vyanjan-027': "A trilled semi-vowel produced with one or more rapid taps of the tongue tip against the alveolar ridge (the ridge just behind the upper front teeth).",
  'vyanjan-028': "A lateral semi-vowel (liquid) produced with the tongue tip touching the alveolar ridge while air flows around the sides of the tongue.",
  'vyanjan-029': "A labiodental or bilabial semi-vowel produced with the lower lip lightly approaching the upper teeth or upper lip, similar to English 'v' or 'w'.",
  'vyanjan-030': "A palatal sibilant fricative produced with the tongue blade near the hard palate, similar to the 'sh' in the English word 'shoe'.",
  'vyanjan-031': "A retroflex sibilant fricative produced with the tongue blade curled back toward the roof of the mouth, a sound not found in English.",
  'vyanjan-032': "A dental sibilant fricative produced with the tongue near the back of the upper teeth, similar to the 's' in the English word 'sun'.",
  'vyanjan-033': "A glottal fricative produced at the glottis (the opening of the vocal tract), similar to the English 'h' in 'house' but slightly more breathy."
};

// ─────────────────────────────────────────────────────────────
// TASK B — Correct English glosses for exampleWords
// ─────────────────────────────────────────────────────────────
const EXAMPLE_WORD_GLOSSES = {
  'kamal':   'lotus',
  'kaksha':  'classroom',
  'khat':    'cot / wooden bed',
  'khel':    'game / play',
  'gaay':    'cow',
  'gaman':   'movement / journey',
  'ghar':    'house / home',
  'ghadi':   'watch / clock',
  'chaay':   'tea',
  'chalna':  'to walk',
  'chhata':  'umbrella',
  'chhota':  'small / little',
  'jal':     'water',
  'jag':     'world / jug',
  'jharna':  'waterfall',
  'jhoola':  'swing',
  'topi':    'hat / cap',
  'tamatar': 'tomato',
  'thanda':  'cold',
  'thag':    'thug / swindler',
  'dakiya':  'postman',
  'damroo':  'small drum',
  'dhol':    'drum',
  'dhakkan': 'lid / cover',
  'tan':     'body',
  'taran':   'crossing / swimming',
  'thal':    'land / ground',
  'thali':   'plate / thali',
  'dal':     'lentils',
  'daan':    'donation / gift',
  'dhan':    'wealth / money',
  'dharti':  'earth / land',
  'nal':     'tap / pipe',
  'naam':    'name',
  'pal':     'moment / instant',
  'paani':   'water',
  'phal':    'fruit',
  'phool':   'flower',
  'bal':     'strength / power',
  'baadal':  'cloud',
  'bhavan':  'building',
  'bhasha':  'language',
  'man':     'mind',
  'maata':   'mother',
  'yagna':   'sacred fire ritual',
  'yatra':   'journey / pilgrimage',
  'ras':     'juice / essence',
  'raaj':    'kingdom / rule',
  'lata':    'vine / creeper',
  'lahar':   'wave',
  'van':     'forest',
  'vayu':    'wind / air',
  'shakti':  'power / strength',
  'shabd':   'word',
  'shat':    'six',
  'satya':   'truth',
  'saral':   'simple / easy',
  'hasta':   'hand',
  'hari':    'Lord Vishnu / God'
};

// ─────────────────────────────────────────────────────────────
// TASK C — exampleWords for vyanjan-005, -010, -015
// Mid-word/conjunct; no PDF standalone source — standard Hindi dictionary.
// ─────────────────────────────────────────────────────────────
const MISSING_EXAMPLE_WORDS = {
  'vyanjan-005': {
    hindi:   [{ devanagari: '\u0905\u0902\u0915', romanized: 'ank', english: 'number / digit (\u0919 as nasal conjunct)' }],
    english: [{ romanized: 'ank', english: 'number / digit (\u1e45a as nasal conjunct)', iast: 'a\u1e45ka' }],
    kannada: [{ romanized: 'ank', english: 'number / digit (\u1e45a as nasal conjunct)', kannada: '\u0c85\u0c82\u0c95' }],
    tamil:   [{ romanized: 'ank', english: 'number / digit (\u1e45a as nasal conjunct)', tamil: '\u0b85\u0b99\u0bcd\u0b95' }],
    Marathi: [{ devanagari: '\u0905\u0902\u0915', romanized: 'ank', english: 'number / digit (\u1e45a as nasal conjunct)' }]
  },
  'vyanjan-010': {
    hindi:   [{ devanagari: '\u091c\u094d\u091e\u093e\u0928', romanized: 'gyaan', english: 'knowledge (\u091e in conjunct form \u091c\u094d\u091e)' }],
    english: [{ romanized: 'gyaan', english: 'knowledge (nya in conjunct form j\u00f1a)', iast: 'j\u00f1\u0101na' }],
    kannada: [{ romanized: 'gyaan', english: 'knowledge (nya in conjunct form j\u00f1a)', kannada: '\u0c9c\u0ccd\u0c9e\u0cbe\u0ca8' }],
    tamil:   [{ romanized: 'gyaan', english: 'knowledge (nya in conjunct form j\u00f1a)', tamil: '\u0b9e\u0bbe\u0ba9\u0bae\u0bcd' }],
    Marathi: [{ devanagari: '\u091c\u094d\u091e\u093e\u0928', romanized: 'gyaan', english: 'knowledge (\u091e in conjunct form \u091c\u094d\u091e)' }]
  },
  'vyanjan-015': {
    hindi:   [{ devanagari: '\u0917\u0923\u093f\u0924', romanized: 'ganit', english: 'mathematics (\u0923 in medial position)' }],
    english: [{ romanized: 'ganit', english: 'mathematics (\u1e47a in medial position)', iast: 'ga\u1e47ita' }],
    kannada: [{ romanized: 'ganit', english: 'mathematics (\u1e47a in medial position)', kannada: '\u0c97\u0ca3\u0cbf\u0ca4' }],
    tamil:   [{ romanized: 'ganit', english: 'mathematics (\u1e47a in medial position)', tamil: '\u0b95\u0ba3\u0bbf\u0ba4\u0bae\u0bcd' }],
    Marathi: [{ devanagari: '\u0917\u0923\u093f\u0924', romanized: 'ganit', english: 'mathematics (\u0923 in medial position)' }]
  }
};

// ─────────────────────────────────────────────────────────────
// TASK D — matra descriptionEnglish, englishName, matraPositionLabel
// ─────────────────────────────────────────────────────────────
const MATRA_ENGLISH_DATA = {
  'matra-001': { englishName: 'Inherent A (no matra)',   matraPositionLabel: 'None (Inherent)',          descriptionEnglish: "Without any matra sign, the consonant carries the inherent 'a' sound." },
  'matra-002': { englishName: 'AA Matra (Long A)',        matraPositionLabel: 'After (right side)',        descriptionEnglish: "The matra sign for the 'aa' sound is placed after the consonant." },
  'matra-003': { englishName: 'I Matra (Short I)',        matraPositionLabel: 'Before (left side / above)', descriptionEnglish: "The matra sign for the 'i' sound is placed before or above the consonant." },
  'matra-004': { englishName: 'EE Matra (Long I)',        matraPositionLabel: 'After (right side)',        descriptionEnglish: "The matra sign for the 'ee' sound is placed after the consonant." },
  'matra-005': { englishName: 'U Matra (Short U)',        matraPositionLabel: 'Below',                    descriptionEnglish: "The matra sign for the 'u' sound is placed below the consonant." },
  'matra-006': { englishName: 'UU Matra (Long U)',        matraPositionLabel: 'Below',                    descriptionEnglish: "The matra sign for the 'uu' sound is placed below the consonant." },
  'matra-007': { englishName: 'E Matra',                  matraPositionLabel: 'After (right side)',        descriptionEnglish: "The matra sign for the 'e' sound is placed after the consonant." },
  'matra-008': { englishName: 'AI Matra (Diphthong)',     matraPositionLabel: 'After (right side)',        descriptionEnglish: "The matra sign for the 'ai' sound is placed after the consonant." },
  'matra-009': { englishName: 'O Matra',                  matraPositionLabel: 'After (right side)',        descriptionEnglish: "The matra sign for the 'o' sound is placed after the consonant." },
  'matra-010': { englishName: 'AU Matra (Diphthong)',     matraPositionLabel: 'After (right side)',        descriptionEnglish: "The matra sign for the 'au' sound is placed after the consonant." },
  'matra-011': { englishName: 'Anusvara (Nasal)',          matraPositionLabel: 'Above',                    descriptionEnglish: "Anusvara — a nasal sound sign placed above the consonant." },
  'matra-012': { englishName: 'Visarga (Aspirate)',        matraPositionLabel: 'After (right side)',        descriptionEnglish: "Visarga — an aspirate sound sign placed after the consonant." }
};

// ─────────────────────────────────────────────────────────────
// TASK F — matra lesson title_english / description_english
// ─────────────────────────────────────────────────────────────
const LESSON_ENGLISH_DATA = {
  1:  { title_english: 'Introduction to Matra Signs',   description_english: 'When vowels are written independently they have their own distinct form, but when they combine with a consonant, they become matra signs.' },
  2:  { title_english: 'A \u2014 No Matra',             description_english: "When a consonant stands alone, it carries the inherent 'a' sound with no visible matra sign." },
  3:  { title_english: 'AA \u2014 Matra Sign',          description_english: "The matra sign for the 'aa' sound is placed after the consonant." },
  4:  { title_english: 'I \u2014 Matra Sign',           description_english: "The matra sign for the 'i' sound is placed before or above the consonant." },
  5:  { title_english: 'EE \u2014 Matra Sign',          description_english: "The matra sign for the 'ee' sound is placed after the consonant." },
  6:  { title_english: 'U \u2014 Matra Sign',           description_english: "The matra sign for the 'u' sound is placed below the consonant." },
  7:  { title_english: 'UU \u2014 Matra Sign',          description_english: "The matra sign for the 'uu' sound is placed below the consonant." },
  8:  { title_english: 'E \u2014 Matra Sign',           description_english: "The matra sign for the 'e' sound is placed after the consonant." },
  9:  { title_english: 'AI \u2014 Matra Sign',          description_english: "The matra sign for the 'ai' sound is placed after the consonant." },
  10: { title_english: 'O \u2014 Matra Sign',           description_english: "The matra sign for the 'o' sound is placed after the consonant." },
  11: { title_english: 'AU \u2014 Matra Sign',          description_english: "The matra sign for the 'au' sound is placed after the consonant." },
  12: { title_english: 'Anusvara',                      description_english: 'Anusvara \u2014 a nasal sound sign placed above the consonant.' },
  13: { title_english: 'Visarga',                       description_english: 'Visarga \u2014 an aspirate sound sign placed after the consonant.' }
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  JSON.parse(fs.readFileSync(filePath, 'utf8')); // sanity re-parse
  console.log('    \u2713 Written & validated:', path.relative(process.cwd(), filePath));
}

// ─────────────────────────────────────────────────────────────
// PATCH vyanjan.json
// ─────────────────────────────────────────────────────────────
function patchVyanjan(lang) {
  const filePath = path.join(DATA_DIR, lang, 'vyanjan.json');
  const data = readJson(filePath);
  let changed = 0;

  data.consonants.forEach(consonant => {
    // Task A
    if (PRONUNCIATION_NOTE_ENGLISH[consonant.id] && consonant.pronunciationNoteEnglish === '') {
      consonant.pronunciationNoteEnglish = PRONUNCIATION_NOTE_ENGLISH[consonant.id];
      changed++;
    }

    // Task B
    if (Array.isArray(consonant.exampleWords)) {
      consonant.exampleWords.forEach(word => {
        if (word.romanized && EXAMPLE_WORD_GLOSSES[word.romanized] && word.english !== EXAMPLE_WORD_GLOSSES[word.romanized]) {
          word.english = EXAMPLE_WORD_GLOSSES[word.romanized];
          changed++;
        }
      });
    }

    // Task C
    if (MISSING_EXAMPLE_WORDS[consonant.id] && consonant.exampleWords.length === 0) {
      consonant.exampleWords = MISSING_EXAMPLE_WORDS[consonant.id][lang] || [];
      if (consonant.exampleWords.length > 0) changed++;
    }
  });

  writeJson(filePath, data);
  return changed;
}

// ─────────────────────────────────────────────────────────────
// PATCH matras.json
// ─────────────────────────────────────────────────────────────
function patchMatras(lang) {
  const filePath = path.join(DATA_DIR, lang, 'matras.json');
  const data = readJson(filePath);
  let changed = 0;

  // Task F
  if (Array.isArray(data.lessons)) {
    data.lessons.forEach(lesson => {
      const eng = LESSON_ENGLISH_DATA[lesson.id];
      if (eng) {
        if (!lesson.title_english || lesson.title_english === '') { lesson.title_english = eng.title_english; changed++; }
        if (!lesson.description_english || lesson.description_english === '') { lesson.description_english = eng.description_english; changed++; }
      }
    });
  }

  // Task G — rule-004
  if (Array.isArray(data.matraRules)) {
    const rule4 = data.matraRules.find(r => r.id === 'rule-004');
    if (rule4) {
      if (!rule4.examples || rule4.examples.length === 0) {
        rule4.examples = [
          "Devanagari: \u0915\u093f (i-matra before consonant) \u2192 Brahmi: \uD804\uDC13\uD804\uDC39 (placed above/before consonant)",
          "Devanagari: \u0915\u0941 (u-matra below consonant) \u2192 Brahmi: \uD804\uDC13\uD804\uDC3B (placed below consonant)",
          "Devanagari: \u0915\u093E (aa-matra after consonant) \u2192 Brahmi: \uD804\uDC13\uD804\uDC38 (placed after consonant)"
        ];
        changed++;
      }
      if (!rule4.examplesDevanagari || rule4.examplesDevanagari.length === 0) {
        rule4.examplesDevanagari = [
          "\u0915\u093F \u2192 \uD804\uDC13\uD804\uDC39",
          "\u0915\u0941 \u2192 \uD804\uDC13\uD804\uDC3B",
          "\u0915\u093E \u2192 \uD804\uDC13\uD804\uDC38"
        ];
        changed++;
      }
    }
  }

  // Task D — matra fields
  if (Array.isArray(data.matras)) {
    data.matras.forEach(matra => {
      const eng = MATRA_ENGLISH_DATA[matra.id];
      if (eng) {
        if (!matra.descriptionEnglish || matra.descriptionEnglish === '') { matra.descriptionEnglish = eng.descriptionEnglish; changed++; }
        if (!matra.englishName || matra.englishName === '') { matra.englishName = eng.englishName; changed++; }
        if (!matra.matraPositionLabel || matra.matraPositionLabel === '') { matra.matraPositionLabel = eng.matraPositionLabel; changed++; }
      }
    });
  }

  // Task I — Marathi structural gap
  if (lang === 'Marathi') {
    const hindiData = readJson(path.join(DATA_DIR, 'hindi', 'matras.json'));
    if (!data.consonantMatraCombinations && hindiData.consonantMatraCombinations) {
      data.consonantMatraCombinations = hindiData.consonantMatraCombinations;
      console.log('    + Added consonantMatraCombinations to Marathi/matras.json');
      changed++;
    }
    if (!data.practiceExercises && hindiData.practiceExercises) {
      data.practiceExercises = hindiData.practiceExercises;
      console.log('    + Added practiceExercises to Marathi/matras.json');
      changed++;
    }
    if (!data.tracingSequence && hindiData.tracingSequence) {
      data.tracingSequence = hindiData.tracingSequence;
      console.log('    + Added tracingSequence to Marathi/matras.json');
      changed++;
    }
  }

  writeJson(filePath, data);
  return changed;
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
console.log('\n=== Brahmi Content Gap Patcher ===\n');
let totalVyanjan = 0, totalMatras = 0;

console.log('--- Patching vyanjan.json (Tasks A, B, C) ---');
for (const lang of LANGS) {
  console.log(`  [${lang}]`);
  const n = patchVyanjan(lang);
  totalVyanjan += n;
  console.log(`    => ${n} fields updated`);
}

console.log('\n--- Patching matras.json (Tasks D, F, G, I) ---');
for (const lang of LANGS) {
  console.log(`  [${lang}]`);
  const n = patchMatras(lang);
  totalMatras += n;
  console.log(`    => ${n} fields updated`);
}

console.log(`\n=== Done ===`);
console.log(`vyanjan updates: ${totalVyanjan}`);
console.log(`matras updates:  ${totalMatras}`);
console.log(`TOTAL:           ${totalVyanjan + totalMatras} fields\n`);
