/**
 * translate_ta_course.js
 * Translates content/hi/course.json directly into content/ta/course.json with Tamil text.
 */

const fs = require('fs');
const path = require('path');

const hiData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'hi', 'course.json'), 'utf8'));

const TA_CONSONANTS = {
  'क': 'க', 'ख': 'க', 'ग': 'க', 'घ': 'க', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச', 'ज': 'ஜ', 'झ': 'ச', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட', 'ड': 'ட', 'ढ': 'ட', 'ण': 'ண',
  'त': 'த', 'थ': 'த', 'द': 'த', 'ध': 'த', 'न': 'ந',
  'प': 'ப', 'फ': 'ப', 'ब': 'ப', 'भ': 'ப', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஸ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ'
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

const MATRAS_TA = [
  { vowel: 'அ', sign: null, suffixTa: '' },
  { vowel: 'ஆ', sign: '𑀸', suffixTa: 'ா' },
  { vowel: 'இ', sign: '𑀺', suffixTa: 'ி' },
  { vowel: 'ஈ', sign: '𑀻', suffixTa: 'ீ' },
  { vowel: 'உ', sign: '𑀼', suffixTa: 'ு' },
  { vowel: 'ஊ', sign: '𑀽', suffixTa: 'ூ' },
  { vowel: 'எ', sign: '𑁂', suffixTa: 'ெ' },
  { vowel: 'ஐ', sign: '𑁃', suffixTa: 'ை' },
  { vowel: 'ஒ', sign: '𑁄', suffixTa: 'ொ' },
  { vowel: 'ஔ', sign: '𑁅', suffixTa: 'ௌ' },
  { vowel: 'அம்', sign: '𑀁', suffixTa: 'ம்' },
  { vowel: 'அஃ', sign: '𑀂', suffixTa: 'ஃ' }
];

const GROUP_NAMES_TA = {
  'कण्ठ्य': 'கண்ட்ய (தொண்டை ஒலி)',
  'तालव्य': 'தாலவ்ய (அண்ண ஒலி)',
  'मूर्धन्य': 'மூர்தன்ய (மூர்தன்ய ஒலி)',
  'दन्त्य': 'தந்த்ய (பல் ஒலி)',
  'ओष्ठ्य': 'ஓஷ்ட்ய (உதடு ஒலி)',
  'अन्तःस्थ': 'அந்தஸ்த (இடையின ஒலி)',
  'उष्म': 'உஷ்ம (உரசொலி)'
};

function convertDevSyllableToTamil(syllable) {
  if (!syllable) return '';
  const devC = syllable[0];
  const matraChar = syllable.slice(1);
  const taC = TA_CONSONANTS[devC] || devC;
  
  const matraMap = {
    '': '', 'ा': 'ா', 'ि': 'ி', 'ी': 'ீ', 'ु': 'ு', 'ू': 'ூ',
    'े': 'ெ', 'ै': 'ை', 'ो': 'ொ', 'ौ': 'ௌ', 'ं': 'ம்', 'ः': 'ஃ'
  };
  
  return taC + (matraMap[matraChar] !== undefined ? matraMap[matraChar] : matraChar);
}

const taVyanjan = hiData.vyanjan.map(slide => {
  const s = JSON.parse(JSON.stringify(slide));
  const devC = s.consonant || 'क';
  const taC = TA_CONSONANTS[devC] || devC;
  const romC = ROM_CONSONANTS[devC] || devC;
  const romUpper = romC.toUpperCase();
  const bGlyph = s.consonantBrahmi || '𑀓';

  if (s.type === 'group_list') {
    s.groupName = GROUP_NAMES_TA[s.groupName] || s.groupName;
    if (Array.isArray(s.items)) {
      s.items.forEach(it => {
        it.localizedLabel = TA_CONSONANTS[it.devanagari] || it.devanagari;
      });
    }
  }

  if (s.type === 'bonus_title') {
    s.content = `மெய்யெழுத்து அறிமுகம் – "${taC}" (${bGlyph})`;
    s.subtitle = `வரவேற்கிறோம்! நீங்கள் "${taC}" மெய்யெழுத்தைத் தேர்ந்தெடுத்துள்ளீர்கள்!`;
    s.note = 'இன்று நாம் கற்போம் – இதன் வடிவம், உச்சரிப்பு மற்றும் மாத்ரா சேர்க்கை';
    s.consonant = romUpper;
  }

  if (s.type === 'form_pronunciation') {
    s.content = `பிராமி எழுத்தில் "${taC}" இன் வடிவம்: ${bGlyph}. உச்சரிப்பு: ${taC}`;
    s.drill = `முயற்சிக்கவும் – உரக்கச் சொல்லுங்கள்: ${taC}… ${taC}… ${taC}`;
    s.consonant = romUpper;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = [taC, `${taC}ா`, `${taC}ி`];
    }
  }

  if (s.type === 'bina_matra') {
    s.title = 'மாத்ரா இன்றி';
    s.content = `"${taC}" தனியாக இருக்கும்போது → ${bGlyph} (ஒலி: ${taC}). மாத்ரா இன்றி = மெய்யொலி + 'அ' உயிர் இயல்பாக இணைந்தது.`;
    s.consonant = romUpper;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = [taC];
    }
  }

  if (s.type === 'matra_combinations') {
    s.title = `"${taC}" மாத்ராக்களுடன்`;
    s.consonant = romUpper;
    if (Array.isArray(s.forms)) {
      s.forms.forEach((form, i) => {
        const m = MATRAS_TA[i];
        if (m) {
          form.vowel = m.vowel;
          form.combinedDevanagari = convertDevSyllableToTamil(form.combinedDevanagari);
          if (m.sign === null) form.note = 'மாத்ரா குறியீடு இல்லை';
        }
      });
    }
  }

  if (s.type === 'pronunciation_drill') {
    s.title = 'உச்சரிப்பு பயிற்சி';
    s.content = 'ஒலியைக் கேட்டு உரக்கத் திரும்பச் சொல்லுங்கள்.';
    s.consonant = romUpper;
    if (Array.isArray(s.speechSequence)) {
      s.speechSequence = s.speechSequence.map(item => convertDevSyllableToTamil(item));
    }
  }

  if (s.type === 'recognition_mcq') {
    s.title = 'அடையாளப் பயிற்சி (தமிழ் → பிராமி)';
    s.consonant = romUpper;
    if (Array.isArray(s.examples)) {
      s.examples.forEach(ex => {
        ex.prompt = convertDevSyllableToTamil(ex.prompt);
        if (Array.isArray(ex.speechSequence)) {
          ex.speechSequence = [ex.prompt];
        }
      });
    }
  }

  if (s.type === 'reverse_mcq') {
    s.title = 'தலைகீழ் பயிற்சி (பிராமி → தமிழ்)';
    s.consonant = romUpper;
    if (Array.isArray(s.examples)) {
      s.examples.forEach(ex => {
        ex.answer = convertDevSyllableToTamil(ex.answer);
        if (Array.isArray(ex.speechSequence)) {
          ex.speechSequence = [ex.answer];
        }
      });
    }
  }

  if (s.type === 'matching_game') {
    s.title = 'பொருத்துதல் விளையாட்டு';
    s.note = 'சரியான ஜோடிகளைப் பொருத்துங்கள்';
    s.consonant = romUpper;
    if (Array.isArray(s.columnB)) {
      s.columnB = s.columnB.map(item => convertDevSyllableToTamil(item));
    }
  }

  if (s.type === 'fill_blank') {
    s.title = 'கோடிட்ட இடத்தை நிரப்புக';
    s.consonant = romUpper;
    if (Array.isArray(s.questions)) {
      s.questions.forEach(q => {
        if (q.prompt && q.prompt.includes('=')) {
          const parts = q.prompt.split('=');
          const convertedResult = convertDevSyllableToTamil(parts[1].trim());
          q.prompt = `${parts[0].trim()} = ${convertedResult}`;
        }
      });
    }
  }

  if (s.type === 'trace_practice') {
    s.title = 'வரைதல் பயிற்சி';
    s.content = `உங்கள் விரலால் ${bGlyph} மற்றும் அதன் மாத்ரா வடிவங்களை வரையுங்கள்.`;
    s.note = 'வரைதல் இயங்குபடம் தோன்றும்';
    s.consonant = romUpper;
  }

  if (s.type === 'summary') {
    s.title = 'முடிவுரை';
    s.content = `அருமை! நீங்கள் "${taC}" மெய்யெழுத்தின் வடிவம், உச்சரிப்பு மற்றும் மாத்ரா சேர்க்கையைக் கற்றுக்கொண்டீர்கள்.`;
    s.bonusUnlock = 'அறிவுப் பதக்கம்';
    s.consonant = romUpper;
  }

  return s;
});

const taData = JSON.parse(JSON.stringify(hiData));
taData.vyanjan = taVyanjan;

fs.writeFileSync(path.join(__dirname, '..', 'content', 'ta', 'course.json'), JSON.stringify(taData, null, 2), 'utf8');
console.log('Successfully generated complete Tamil vyanjan course file from Hindi template!');
