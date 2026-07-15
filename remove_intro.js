const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content');
const filesToFix = [
  path.join(dir, 'translate_json.js'),
  path.join(dir, 'hi', 'course.json'),
  path.join(dir, 'en', 'course.json'),
  path.join(dir, 'kn', 'course.json'),
  path.join(dir, 'ta', 'course.json')
];

filesToFix.forEach(fp => {
  if (fs.existsSync(fp)) {
    let text = fs.readFileSync(fp, 'utf8');
    text = text.replace(/\(Motion \+ Intro\) /g, '');
    text = text.replace(/\(मोशन \+ इंट्रो\) /g, '');
    fs.writeFileSync(fp, text, 'utf8');
    console.log('Fixed', fp);
  }
});
