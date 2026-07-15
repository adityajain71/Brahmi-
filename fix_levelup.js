const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content');

// 1. Update translate_json.js
const translateJsPath = path.join(dir, 'translate_json.js');
let jsContent = fs.readFileSync(translateJsPath, 'utf8');

jsContent = jsContent.replace(
  /"Level-up Alert! ನೀವು ಸ್ವರಗಳು ಮತ್ತು ಮಾತ್ರೆಗಳನ್ನು/g,
  '"ಲೆವೆಲ್-ಅಪ್ ಅಲರ್ಟ್! ನೀವು ಸ್ವರಗಳು ಮತ್ತು ಮಾತ್ರೆಗಳನ್ನು'
);
jsContent = jsContent.replace(
  /"Level-up Alert! நீங்கள் உயிரெழுத்துக்களையும் மாத்ராக்களையும்/g,
  '"லெவல்-அப் அலர்ட்! நீங்கள் உயிரெழுத்துக்களையும் மாத்ராக்களையும்'
);

fs.writeFileSync(translateJsPath, jsContent, 'utf8');

// 2. Update kn/course.json
const knPath = path.join(dir, 'kn', 'course.json');
let knContent = fs.readFileSync(knPath, 'utf8');
knContent = knContent.replace(
  /Level-up Alert! ನೀವು/g,
  'ಲೆವೆಲ್-ಅಪ್ ಅಲರ್ಟ್! ನೀವು'
);
fs.writeFileSync(knPath, knContent, 'utf8');

// 3. Update ta/course.json
const taPath = path.join(dir, 'ta', 'course.json');
let taContent = fs.readFileSync(taPath, 'utf8');
taContent = taContent.replace(
  /Level-up Alert! நீங்கள்/g,
  'லெவல்-அப் அலர்ட்! நீங்கள்'
);
fs.writeFileSync(taPath, taContent, 'utf8');

console.log("Fixed 'Level-up Alert!' in Kannada and Tamil.");
