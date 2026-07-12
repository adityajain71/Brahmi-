const fs = require('fs');
const path = require('path');

const mapKn = {
  "अ": "ಅ", "आ": "ಆ", "इ": "ಇ", "ई": "ಈ", "उ": "ಉ", "ऊ": "ಊ",
  "ए": "ಏ", "ऐ": "ಐ", "ओ": "ಓ", "औ": "ಔ", "अं": "ಅಂ", "अः": "ಅಃ"
};

const mapTa = {
  "अ": "அ", "आ": "ஆ", "इ": "இ", "ई": "ஈ", "उ": "உ", "ऊ": "ஊ",
  "ए": "ஏ", "ऐ": "ஐ", "ओ": "ஓ", "औ": "ஔ", "अं": "அம்", "अः": "அஃ"
};

const mapEn = {
  "अ": "A", "आ": "AA", "इ": "I", "ई": "II", "उ": "U", "ऊ": "UU",
  "ए": "E", "ऐ": "AI", "ओ": "O", "औ": "AU", "अं": "AM", "अः": "AH"
};

const replaceExactStrings = (obj, map) => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string' && map[obj[i]]) {
        obj[i] = map[obj[i]];
      } else {
        replaceExactStrings(obj[i], map);
      }
    }
  } else if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string' && map[obj[key]]) {
        obj[key] = map[obj[key]];
      } else {
        replaceExactStrings(obj[key], map);
      }
    });
  }
};

const processLang = (lang, map) => {
  const filePath = path.join(__dirname, lang, 'course.json');
  if (!fs.existsSync(filePath)) return;
  const course = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Replace in the whole course JSON
  replaceExactStrings(course, map);
  
  fs.writeFileSync(filePath, JSON.stringify(course, null, 2));
  console.log(`Replaced Hindi vowels with ${lang} vowels in ${lang}/course.json`);
};

processLang('kn', mapKn);
processLang('ta', mapTa);
processLang('en', mapEn);
