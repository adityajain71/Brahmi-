const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'content', 'hi', 'course.json');
const enPath = path.join(__dirname, 'content', 'en', 'course.json');

const hiText = fs.readFileSync(hiPath, 'utf8');
const enText = fs.readFileSync(enPath, 'utf8');

const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;

let match;
const hiStrings = new Set();
while ((match = regex.exec(hiText)) !== null) {
  if (/[\u0900-\u097F]{3,}/.test(match[1])) {
    hiStrings.add(match[1]);
  }
}

const missing = [];
hiStrings.forEach(str => {
  // If the English version still has this EXACT string, it was NOT translated
  if (enText.includes('"' + str + '"')) {
    missing.push(str);
  }
});

fs.writeFileSync(path.join(__dirname, 'missing_hindi.json'), JSON.stringify(missing, null, 2), 'utf8');
console.log(`Found ${missing.length} missing strings.`);
