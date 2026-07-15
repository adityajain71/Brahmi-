const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content');

const DEVANAGARI_TO_TAMIL_WORD_MAP = {
  'अ': 'அ', 'आ': 'ஆ', 'इ': 'இ', 'ई': 'ஈ', 'उ': 'உ', 'ऊ': 'ஊ', 'ए': 'ஏ', 'ऐ': 'ஐ', 'ओ': 'ஓ', 'औ': 'ஔ',
  'ा': 'ா', 'ि': 'ி', 'ी': 'ீ', 'ु': 'ு', 'ू': 'ூ', 'े': 'ே', 'ै': 'ை', 'ो': 'ோ', 'ौ': 'ௌ',
  'ं': 'ம்', 'ः': 'ஃ', 'ँ': 'ம்', '़': '', '्': '்',
  'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச்ஹ', 'ज': 'ஜ', 'झ': 'ஜ்ஹ', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட்ஹ', 'ड': 'ட', 'ढ': 'ட்ஹ', 'ण': 'ண',
  'त': 'த', 'थ': 'த்ஹ', 'द': 'த', 'ध': 'த்ஹ', 'न': 'ந',
  'प': 'ப', 'फ': 'ப்ஹ', 'ब': 'ப', 'भ': 'ப்ஹ', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஶ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ'
};

const DEVANAGARI_TO_KANNADA_WORD_MAP = {
  'अ': 'ಅ', 'आ': 'ಆ', 'इ': 'ಇ', 'ई': 'ಈ', 'उ': 'ಉ', 'ऊ': 'ಊ', 'ए': 'ಏ', 'ऐ': 'ಐ', 'ओ': 'ಓ', 'औ': 'ಔ',
  'ा': 'ಾ', 'ि': 'ಿ', 'ी': 'ೀ', 'ु': 'ು', 'ೂ': 'ೂ', 'े': 'ೇ', 'ै': 'ೈ', 'ो': 'ೋ', 'ौ': 'ೌ',
  'ं': 'ಂ', 'ः': 'ಃ', 'ँ': 'ಂ', '़': '', '्': '್',
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ', 'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ड': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ', 'त': 'ತ', 'थ': 'ಥ', 'द': 'ದ', 'ध': 'ಧ', 'न': 'ನ',
  'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ', 'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ'
};

const devanagariSuffixesToEn = { 
  '': 'a', 'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'am', 'ः': 'ah' 
};

const enVyanjan = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/data/english/vyanjan.json'), 'utf8'));

function transliterateTa(text) {
  if (!text) return text;
  return text.split('').map(char => DEVANAGARI_TO_TAMIL_WORD_MAP[char] ?? char).join('');
}

function transliterateKn(text) {
  if (!text) return text;
  return text.split('').map(char => DEVANAGARI_TO_KANNADA_WORD_MAP[char] ?? char).join('');
}

function getRomanText(devanagariStr, consonantDev) {
  const meta = enVyanjan.consonants.find(c => c.devanagari === consonantDev);
  if (!meta) return devanagariStr;
  const root = meta.romanized.endsWith('a') ? meta.romanized.slice(0, -1) : meta.romanized;
  const suffix = devanagariStr.substring(consonantDev.length);
  return root + (devanagariSuffixesToEn[suffix] || 'a');
}

['en', 'ta', 'kn'].forEach(lang => {
  const fp = path.join(dir, lang, 'course.json');
  if (!fs.existsSync(fp)) return;
  const course = JSON.parse(fs.readFileSync(fp, 'utf8'));
  
  if (course.vyanjan) {
    course.vyanjan.forEach(slide => {
      const c = slide.consonant;
      if (!c) return;
      
      const tl = (str) => {
        if (lang === 'ta') return transliterateTa(str);
        if (lang === 'kn') return transliterateKn(str);
        if (lang === 'en') return getRomanText(str, c);
        return str;
      };

      if (slide.type === 'pronunciation_drill') {
        const parts = slide.content.split(': ');
        if (parts.length === 2) {
          const words = parts[1].split(' – ');
          const tlWords = words.map(w => tl(w.trim()));
          slide.content = parts[0] + ': ' + tlWords.join(' – ');
        }
      }
      else if (slide.type === 'recognition_mcq') {
        if (slide.examples) {
          slide.examples.forEach(ex => {
            if (/[\u0900-\u097F]/.test(ex.prompt)) {
              ex.prompt = tl(ex.prompt);
            }
          });
        }
      }
      else if (slide.type === 'reverse_mcq') {
        if (slide.examples) {
          slide.examples.forEach(ex => {
            if (/[\u0900-\u097F]/.test(ex.answer)) {
              ex.answer = tl(ex.answer);
            }
          });
        }
      }
      else if (slide.type === 'matching_game') {
        if (slide.columnB) {
          slide.columnB = slide.columnB.map(item => /[\u0900-\u097F]/.test(item) ? tl(item) : item);
        }
      }
      else if (slide.type === 'fill_blank') {
        if (slide.questions) {
          slide.questions.forEach(q => {
            const match = q.prompt.match(/(.*= )([\u0900-\u097F]+)$/);
            if (match) {
              q.prompt = match[1] + tl(match[2]);
            }
          });
        }
      }
    });
  }
  
  fs.writeFileSync(fp, JSON.stringify(course, null, 2), 'utf8');
  console.log('Fixed activities in', lang);
});
