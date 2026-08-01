/**
 * translate_en_course.js
 * Translates content/hi/course.json directly into content/en/course.json with English text.
 */

const fs = require('fs');
const path = require('path');

const hiData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'hi', 'course.json'), 'utf8'));

const ROM_CONSONANTS = {
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'tta', 'ठ': 'ttha', 'ड': 'dda', 'ढ': 'ddha', 'ण': 'nna',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'sha', 'ष': 'ssa', 'स': 'sa', 'ह': 'ha'
};

const ROM_VOWELS = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'uu',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah'
};

const MATRAS_EN = [
  { vowel: 'A', sign: null, vRom: 'a' },
  { vowel: 'Aa', sign: '𑀸', vRom: 'aa' },
  { vowel: 'I', sign: '𑀺', vRom: 'i' },
  { vowel: 'Ee', sign: '𑀻', vRom: 'ee' },
  { vowel: 'U', sign: '𑀼', vRom: 'u' },
  { vowel: 'Uu', sign: '𑀽', vRom: 'uu' },
  { vowel: 'E', sign: '𑁂', vRom: 'e' },
  { vowel: 'Ai', sign: '𑁃', vRom: 'ai' },
  { vowel: 'O', sign: '𑁄', vRom: 'o' },
  { vowel: 'Au', sign: '𑁅', vRom: 'au' },
  { vowel: 'Am', sign: '𑀁', vRom: 'am' },
  { vowel: 'Ah', sign: '𑀂', vRom: 'ah' }
];

const GROUP_NAMES_EN = {
  'कण्ठ्य': 'Velar (Kanthya)',
  'तालव्य': 'Palatal (Talavya)',
  'मूर्धन्य': 'Retroflex (Murdhanya)',
  'दन्त्य': 'Dental (Dantya)',
  'ओष्ठ्य': 'Labial (Oshthya)',
  'अन्तःस्थ': 'Approximant (Antastha)',
  'उष्म': 'Fricative (Ushma)'
};

function convertDevSyllableToEnglish(syllable) {
  if (!syllable) return '';
  const devC = syllable[0];
  const matraChar = syllable.slice(1);
  const romC = ROM_CONSONANTS[devC] || devC;
  const base = matraChar ? romC.replace(/a$/, '') : romC;
  
  const matraMap = {
    '': '', 'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'uu',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'am', 'ः': 'ah'
  };
  
  return base + (matraMap[matraChar] !== undefined ? matraMap[matraChar] : matraChar);
}

const enVyanjan = hiData.vyanjan.map(slide => {
  const s = JSON.parse(JSON.stringify(slide));
  const devC = s.consonant || 'क';
  const romC = ROM_CONSONANTS[devC] || devC;
  const romUpper = romC.toUpperCase();
  const bGlyph = s.consonantBrahmi || '𑀓';

  if (s.type === 'group_list') {
    s.groupName = GROUP_NAMES_EN[s.groupName] || s.groupName;
    if (Array.isArray(s.items)) {
      s.items.forEach(it => {
        it.localizedLabel = ROM_CONSONANTS[it.devanagari] || it.devanagari;
      });
    }
  }

  if (s.type === 'bonus_title') {
    s.content = `Bonus: Consonant Introduction – "${romUpper}" (${bGlyph})`;
    s.subtitle = `Welcome! You have selected the "${romUpper}" consonant!`;
    s.note = 'Today we will learn – its form, pronunciation and reading/writing with matras';
    s.consonant = romUpper;
  }

  if (s.type === 'form_pronunciation') {
    s.content = `In Brahmi script, the form of "${romUpper}" is: ${bGlyph}. Pronunciation: ${romC}`;
    s.drill = `Try speaking aloud: ${romC}… ${romC}… ${romC}`;
    s.consonant = romUpper;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = [romC, `${romC}a`, `${romC}i`];
    }
  }

  if (s.type === 'bina_matra') {
    s.title = 'Without Matra';
    s.content = `When "${romC}" is alone → ${bGlyph} (sound: ${romC}). Without matra = only consonant sound + inherent 'a' vowel is attached.`;
    s.consonant = romUpper;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = [romC];
    }
  }

  if (s.type === 'matra_combinations') {
    s.title = `"${romUpper}" with Matras`;
    s.consonant = romUpper;
    if (Array.isArray(s.forms)) {
      s.forms.forEach((form, i) => {
        const m = MATRAS_EN[i];
        if (m) {
          form.vowel = m.vowel;
          form.combinedDevanagari = convertDevSyllableToEnglish(form.combinedDevanagari);
          if (m.sign === null) form.note = 'No matra sign';
        }
      });
    }
  }

  if (s.type === 'pronunciation_drill') {
    s.title = 'Pronunciation Drill';
    s.content = 'Listen to the audio and repeat out loud.';
    s.consonant = romUpper;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = s.speechSequence.map(item => convertDevSyllableToEnglish(item));
    }
  }

  if (s.type === 'recognition_mcq') {
    s.title = 'Recognition Practice (English → Brahmi)';
    s.consonant = romUpper;
    if (Array.isArray(s.examples)) {
      s.examples.forEach(ex => {
        ex.prompt = convertDevSyllableToEnglish(ex.prompt);
        if (Array.isArray(ex.speechSequence)) {
          ex.speechSequence = [ex.prompt];
        }
      });
    }
  }

  if (s.type === 'reverse_mcq') {
    s.title = 'Reverse Practice (Brahmi → English)';
    s.consonant = romUpper;
    if (Array.isArray(s.examples)) {
      s.examples.forEach(ex => {
        ex.answer = convertDevSyllableToEnglish(ex.answer);
        if (Array.isArray(ex.speechSequence)) {
          ex.speechSequence = [ex.answer];
        }
      });
    }
  }

  if (s.type === 'matching_game') {
    s.title = 'Matching Game';
    s.note = 'Match the correct pairs';
    s.consonant = romUpper;
    if (Array.isArray(s.columnB)) {
      s.columnB = s.columnB.map(item => convertDevSyllableToEnglish(item));
    }
  }

  if (s.type === 'fill_blank') {
    s.title = 'Fill in the Blank';
    s.consonant = romUpper;
    if (Array.isArray(s.questions)) {
      s.questions.forEach(q => {
        if (q.prompt && q.prompt.includes('=')) {
          const parts = q.prompt.split('=');
          const convertedResult = convertDevSyllableToEnglish(parts[1].trim());
          q.prompt = `${parts[0].trim()} = ${convertedResult}`;
        }
      });
    }
  }

  if (s.type === 'trace_practice') {
    s.title = 'Tracing Practice';
    s.content = `Trace ${bGlyph} and its matra forms with your finger/pen.`;
    s.note = 'Tracing animation will appear';
    s.consonant = romUpper;
  }

  if (s.type === 'summary') {
    s.title = 'Summary';
    s.content = `Awesome! You have learned the form, pronunciation, and matra combinations of the "${romUpper}" consonant.`;
    s.bonusUnlock = 'Explorer Badge';
    s.consonant = romUpper;
  }

  return s;
});

const enData = JSON.parse(JSON.stringify(hiData));
enData.vyanjan = enVyanjan;

fs.writeFileSync(path.join(__dirname, '..', 'content', 'en', 'course.json'), JSON.stringify(enData, null, 2), 'utf8');
console.log('Successfully generated complete English vyanjan course file from Hindi template!');
