const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content');
const filesToFix = [
  path.join(dir, 'hi', 'course.json'),
  path.join(dir, 'en', 'course.json'),
  path.join(dir, 'kn', 'course.json'),
  path.join(dir, 'ta', 'course.json')
];

function cleanObj(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(cleanObj);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.note && obj.note.includes('vyanjan.intro')) {
      delete obj.note;
    }
    Object.values(obj).forEach(cleanObj);
  }
}

filesToFix.forEach(fp => {
  if (fs.existsSync(fp)) {
    let json = JSON.parse(fs.readFileSync(fp, 'utf8'));
    cleanObj(json);
    fs.writeFileSync(fp, JSON.stringify(json, null, 2), 'utf8');
    console.log('Fixed', fp);
  }
});
