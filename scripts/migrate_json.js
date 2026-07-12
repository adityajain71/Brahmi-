const fs = require('fs');
let data = JSON.parse(fs.readFileSync('brahmi_matra_vyanjan_final.json', 'utf8'));

function renameNotes(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(renameNotes);
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      // Heuristic: rename if key contains note, correction, discrepancy, overlap.
      // Exception: if the key is exactly 'note'
      const isAuditNote = (
        lowerKey.includes('correction') || 
        lowerKey.includes('discrepancy') || 
        lowerKey.includes('overlap') || 
        (lowerKey.includes('note') && key !== 'note')
      );
      
      if (isAuditNote) {
        const newKey = '_devNote_' + key.replace(/^_*/, '');
        console.log(`Renaming key: "${key}" -> "${newKey}"`);
        obj[newKey] = obj[key];
        delete obj[key];
        renameNotes(obj[newKey]);
      } else {
        renameNotes(obj[key]);
      }
    }
  }
}

renameNotes(data.matra);
renameNotes(data.vyanjan);

let courseData = JSON.parse(fs.readFileSync('content/hi/course.json', 'utf8'));
courseData.matra = data.matra;
courseData.vyanjan = data.vyanjan;

fs.writeFileSync('content/hi/course.json', JSON.stringify(courseData, null, 2), 'utf8');
console.log('\nMigration complete! content/hi/course.json updated.');
