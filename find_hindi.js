const fs = require('fs');
const path = require('path');

['en', 'ta', 'kn'].forEach(lang => {
  const fp = path.join(__dirname, 'content', lang, 'course.json');
  const text = fs.readFileSync(fp, 'utf8');
  
  // Exclude single Devangari letters which might be used as identifiers like "consonant": "क"
  // Let's find strings that contain multiple Devanagari characters, potentially phrases.
  const matches = [...new Set(text.match(/[\u0900-\u097F\s]{5,}/g))];
  
  if (matches.length > 0) {
    console.log(`\nRemaining Devanagari in ${lang}:`);
    matches.slice(0, 10).forEach(m => console.log(' ->', m.trim().replace(/\n/g, ' ')));
    if (matches.length > 10) console.log(` ... and ${matches.length - 10} more.`);
  }
});
