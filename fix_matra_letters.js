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

const devanagariVowelsToEnSuffix = { 
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 
  'ए': 'e', 'AI': 'ai', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah' 
};

// We will need the english vyanjan data to get the root roman letter
const enVyanjan = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/data/english/vyanjan.json'), 'utf8'));

function transliterateTa(text) {
  if (!text) return text;
  return text.split('').map(char => DEVANAGARI_TO_TAMIL_WORD_MAP[char] ?? char).join('');
}

function transliterateKn(text) {
  if (!text) return text;
  return text.split('').map(char => DEVANAGARI_TO_KANNADA_WORD_MAP[char] ?? char).join('');
}

['en', 'ta', 'kn'].forEach(lang => {
  const fp = path.join(dir, lang, 'course.json');
  if (!fs.existsSync(fp)) return;
  const course = JSON.parse(fs.readFileSync(fp, 'utf8'));
  
  if (course.vyanjan) {
    course.vyanjan.forEach(slide => {
      if (slide.type === 'matra_combinations' && slide.forms) {
        
        let romanRoot = '';
        if (lang === 'en' && slide.consonant) {
          const meta = enVyanjan.consonants.find(c => c.devanagari === slide.consonant);
          if (meta) {
            romanRoot = meta.romanized.endsWith('a') ? meta.romanized.slice(0, -1) : meta.romanized;
          }
        }
        
        slide.forms.forEach(form => {
          if (lang === 'ta') {
            form.combinedDevanagari = transliterateTa(form.combinedDevanagari);
          } else if (lang === 'kn') {
            form.combinedDevanagari = transliterateKn(form.combinedDevanagari);
          } else if (lang === 'en') {
            const vowelSuffix = devanagariVowelsToEnSuffix[form.vowel] || 'a';
            form.combinedDevanagari = romanRoot + vowelSuffix;
          }
        });
      }
    });
  }
  
  fs.writeFileSync(fp, JSON.stringify(course, null, 2), 'utf8');
  console.log('Fixed matra letters in', lang);
});
