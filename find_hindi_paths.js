const fs = require('fs');
const path = require('path');

function findHindiNodes(obj, currentPath, results) {
  if (Array.isArray(obj)) {
    obj.forEach((val, i) => findHindiNodes(val, currentPath + '[' + i + ']', results));
  } else if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      findHindiNodes(obj[key], currentPath + '.' + key, results);
    });
  } else if (typeof obj === 'string') {
    // If it contains a Devanagari character (ignoring just the single letters which might be the consonant being taught)
    // Actually, let's just find any string with 3+ consecutive Hindi characters
    if (/[\u0900-\u097F]{3,}/.test(obj)) {
      results.push({ path: currentPath, val: obj });
    }
  }
}

['en', 'ta', 'kn'].forEach(lang => {
  const fp = path.join(__dirname, 'content', lang, 'course.json');
  const course = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const results = [];
  findHindiNodes(course, 'course', results);
  
  if (results.length > 0) {
    console.log(`\nFound ${results.length} Hindi nodes in ${lang}:`);
    results.slice(0, 15).forEach(r => console.log(`${r.path}: "${r.val}"`));
    if (results.length > 15) console.log(` ... and ${results.length - 15} more.`);
  }
});
