/**
 * translate_kn_course.js
 * Translates content/hi/course.json directly into content/kn/course.json with Kannada text.
 */

const fs = require('fs');
const path = require('path');

const hiData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'hi', 'course.json'), 'utf8'));

const KN_CONSONANTS = {
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ',
  'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ड': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ',
  'त': 'ತ', 'थ': 'ಥ', 'द': 'ದ', 'ध': 'ಧ', 'न': 'ನ',
  'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ',
  'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ'
};

const ROM_CONSONANTS = {
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'tta', 'ठ': 'ttha', 'ड': 'dda', 'ढ': 'ddha', 'ण': 'nna',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'sha', 'ष': 'ssa', 'स': 'sa', 'ह': 'ha'
};

const MATRAS_KN = [
  { vowel: 'ಅ', sign: null, suffixKn: '' },
  { vowel: 'ಆ', sign: '𑀸', suffixKn: 'ಾ' },
  { vowel: 'ಇ', sign: '𑀺', suffixKn: 'ಿ' },
  { vowel: 'ಈ', sign: '𑀻', suffixKn: 'ೀ' },
  { vowel: 'ಉ', sign: '𑀼', suffixKn: 'ು' },
  { vowel: 'ಊ', sign: '𑀽', suffixKn: 'ೂ' },
  { vowel: 'ಎ', sign: '𑁂', suffixKn: 'ೆ' },
  { vowel: 'ಐ', sign: '𑁃', suffixKn: 'ೈ' },
  { vowel: 'ಒ', sign: '𑁄', suffixKn: 'ೊ' },
  { vowel: 'ಔ', sign: '𑁅', suffixKn: 'ೌ' },
  { vowel: 'ಅಂ', sign: '𑀁', suffixKn: 'ಂ' },
  { vowel: 'ಅಃ', sign: '𑀂', suffixKn: 'ಃ' }
];

const GROUP_NAMES_KN = {
  'कण्ठ्य': 'ಕಂಠ್ಯ (ಕಂಠದಿಂದ ಉಚ್ಚಾರಣೆ)',
  'तालव्य': 'ತಾಲವ್ಯ (ತಾಲುವಿನಿಂದ ಉಚ್ಚಾರಣೆ)',
  'मूर्धन्य': 'ಮೂರ್ಧನ್ಯ (ಮೂರ್ಧನ್ಯ ಉಚ್ಚಾರಣೆ)',
  'दन्त्य': 'ದಂತ್ಯ (ಹಲ್ಲಿನ ಬಳಿ ಉಚ್ಚಾರಣೆ)',
  'ओष्ठ्य': 'ಓಷ್ಠ್ಯ (ತುಟಿಗಳಿಂದ ಉಚ್ಚಾರಣೆ)',
  'अन्तःस्थ': 'ಅಂತಃಸ್ಥ (ಅರ್ಧಸ್ವರಗಳು)',
  'उष्म': 'ಉಷ್ಮ (ಉಸಿರಿನಿಂದ ಉಚ್ಚಾರಣೆ)'
};

function convertDevSyllableToKannada(syllable) {
  if (!syllable) return '';
  const devC = syllable[0];
  const matraChar = syllable.slice(1);
  const knC = KN_CONSONANTS[devC] || devC;
  
  const matraMap = {
    '': '', 'ा': 'ಾ', 'ि': 'ಿ', 'ी': 'ೀ', 'ु': 'ು', 'ू': 'ೂ',
    'े': 'ೆ', 'ै': 'ೈ', 'ो': 'ೊ', 'ौ': 'ೌ', 'ं': 'ಂ', 'ः': 'ಃ'
  };
  
  return knC + (matraMap[matraChar] !== undefined ? matraMap[matraChar] : matraChar);
}

const knVyanjan = hiData.vyanjan.map(slide => {
  const s = JSON.parse(JSON.stringify(slide));
  const devC = s.consonant || 'क';
  const knC = KN_CONSONANTS[devC] || devC;
  const romC = ROM_CONSONANTS[devC] || devC;
  const romUpper = romC.toUpperCase();
  const bGlyph = s.consonantBrahmi || '𑀓';

  if (s.type === 'group_list') {
    s.groupName = GROUP_NAMES_KN[s.groupName] || s.groupName;
    if (Array.isArray(s.items)) {
      s.items.forEach(it => {
        it.localizedLabel = KN_CONSONANTS[it.devanagari] || it.devanagari;
      });
    }
  }

  if (s.type === 'bonus_title') {
    s.content = `ವ್ಯಂಜನ ಪರಿಚಯ – "${knC}" (${bGlyph})`;
    s.subtitle = `ಸ್ವಾಗತ! ನೀವು "${knC}" ವ್ಯಂಜನವನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ!`;
    s.note = 'ಇಂದು ನಾವು ಕಲಿಯುತ್ತೇವೆ – ಇದರ ರೂಪ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಮಾತ್ರಾಗಳೊಂದಿಗೆ ಸಂಯೋಜನೆ';
    s.consonant = knC;
  }

  if (s.type === 'form_pronunciation') {
    s.content = `ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "${knC}" ರ ರೂಪ: ${bGlyph}. ಉಚ್ಚಾರಣೆ: ${knC}`;
    s.drill = `ಪ್ರಯತ್ನಿಸಿ – ಗಟ್ಟಿಯಾಗಿ ಹೇಳಿ: ${knC}… ${knC}… ${knC}`;
    s.consonant = knC;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = [knC, `${knC}ಾ`, `${knC}ಿ`];
    }
  }

  if (s.type === 'bina_matra') {
    s.title = 'ಮಾತ್ರೆ ಇಲ್ಲದೆ';
    s.content = `"${knC}" ಒಂಟಿಯಾಗಿದ್ದಾಗ → ${bGlyph} (ಧ್ವನಿ: ${knC}). ಮಾತ್ರೆ ಇಲ್ಲದೆ = ವ್ಯಂಜನ ಧ್ವನಿ + 'ಅ' ಸ್ವರ ಸ್ವತಃ ಸೇರಿರುತ್ತದೆ.`;
    s.consonant = knC;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = [knC];
    }
  }

  if (s.type === 'matra_combinations') {
    s.title = `"${knC}" ಮಾತ್ರಾಗಳೊಂದಿಗೆ`;
    s.consonant = knC;
    if (Array.isArray(s.forms)) {
      s.forms.forEach((form, i) => {
        const m = MATRAS_KN[i];
        if (m) {
          form.vowel = m.vowel;
          form.combinedDevanagari = convertDevSyllableToKannada(form.combinedDevanagari);
          if (m.sign === null) form.note = 'ಮಾತ್ರಾ ಚಿಹ್ನೆ ಇಲ್ಲ';
        }
      });
    }
  }

  if (s.type === 'pronunciation_drill') {
    s.title = 'ಉಚ್ಚಾರಣೆ ಅಭ್ಯಾಸ';
    s.content = 'ಆಡಿಯೊ ಆಲಿಸಿ ಮತ್ತು ಪುನರಾವರ್ತಿಸಿ.';
    s.consonant = knC;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = s.speechSequence.map(item => convertDevSyllableToKannada(item));
    }
  }

  if (s.type === 'recognition_mcq') {
    s.title = 'ಗುರುತಿಸುವ ಅಭ್ಯಾಸ (ಕನ್ನಡ → ಬ್ರಾಹ್ಮಿ)';
    s.consonant = knC;
    if (Array.isArray(s.examples)) {
      s.examples.forEach(ex => {
        ex.prompt = convertDevSyllableToKannada(ex.prompt);
        if (Array.isArray(ex.speechSequence)) {
          ex.speechSequence = [ex.prompt];
        }
      });
    }
  }

  if (s.type === 'reverse_mcq') {
    s.title = 'ವಿಲೋಮ ಅಭ್ಯಾಸ (ಬ್ರಾಹ್ಮಿ → ಕನ್ನಡ)';
    s.consonant = knC;
    if (Array.isArray(s.examples)) {
      s.examples.forEach(ex => {
        ex.answer = convertDevSyllableToKannada(ex.answer);
        if (Array.isArray(ex.speechSequence)) {
          ex.speechSequence = [ex.answer];
        }
      });
    }
  }

  if (s.type === 'matching_game') {
    s.title = 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ';
    s.note = 'ಸರಿಯಾದ ಜೋಡಿಗಳನ್ನು ಹೊಂದಿಸಿ';
    s.consonant = knC;
    if (Array.isArray(s.columnB)) {
      s.columnB = s.columnB.map(item => convertDevSyllableToKannada(item));
    }
  }

  if (s.type === 'fill_blank') {
    s.title = 'ಖಾಲಿ ಜಾಗ ಭರ್ತಿ ಮಾಡಿ';
    s.consonant = knC;
    if (Array.isArray(s.questions)) {
      s.questions.forEach(q => {
        if (q.prompt && q.prompt.includes('=')) {
          const parts = q.prompt.split('=');
          const convertedResult = convertDevSyllableToKannada(parts[1].trim());
          q.prompt = `${parts[0].trim()} = ${convertedResult}`;
        }
      });
    }
  }

  if (s.type === 'trace_practice') {
    s.title = 'ಟ್ರೇಸಿಂಗ್ ಅಭ್ಯಾಸ';
    s.content = `ನಿಮ್ಮ ಬೆರಳು/ಪೆನ್‌ನಿಂದ ${bGlyph} ಮತ್ತು ಅದರ ಎಲ್ಲಾ ಮಾತ್ರಾರೂಪಗಳನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ.`;
    s.note = 'ಟ್ರೇಸಿಂಗ್ ಅನಿಮೇಷನ್ ಕಾಣಿಸುತ್ತದೆ';
    s.consonant = knC;
  }

  if (s.type === 'summary') {
    s.title = 'ಸಾರಾಂಶ';
    s.content = `ಉತ್ತಮ! ನೀವು "${knC}" ವ್ಯಂಜನದ ರೂಪ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಮಾತ್ರಾ ಸಂಯೋಜನೆಯನ್ನು ಕರಗತ ಮಾಡಿಕೊಂಡಿದ್ದೀರಿ.`;
    s.bonusUnlock = 'ಜ್ಞಾನ ಬ್ಯಾಡ್ಜ್';
    s.consonant = knC;
  }

  return s;
});

const knData = JSON.parse(JSON.stringify(hiData));
knData.vyanjan = knVyanjan;

fs.writeFileSync(path.join(__dirname, '..', 'content', 'kn', 'course.json'), JSON.stringify(knData, null, 2), 'utf8');
console.log('Successfully generated complete Kannada vyanjan course file from Hindi template!');
