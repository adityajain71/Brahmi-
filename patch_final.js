const fs = require('fs');
const path = require('path');

const extraTa = {
  "जब स्वर किसी व्यंजन के बाद आता है तो वह मात्रा बन जाता है और व्यंजन से जुड़कर लिखा जाता है।": "ஒரு மெய்யெழுத்துக்குப் பிறகு உயிரெழுத்து வரும்போது, அது மாத்ராவாக மாறி மெய்யெழுத்துடன் இணைக்கப்பட்டு எழுதப்படும்.",
  "ओठों से": "உதடுகளால்"
};

const extraKn = {
  "जब स्वर किसी व्यंजन के बाद आता है तो वह मात्रा बन जाता है और व्यंजन से जुड़कर लिखा जाता है।": "ಸ್ವರವು ವ್ಯಂಜನದ ನಂತರ ಬಂದಾಗ, ಅದು ಮಾತ್ರಾ ಆಗುತ್ತದೆ ಮತ್ತು ವ್ಯಂಜನಕ್ಕೆ ಲಗತ್ತಿಸಿ ಬರೆಯಲಾಗುತ್ತದೆ.",
  "ओठों से": "ತುಟಿಗಳಿಂದ"
};

['ta', 'kn'].forEach(lang => {
  const fp = path.join(__dirname, 'content', lang, 'course.json');
  let text = fs.readFileSync(fp, 'utf8');
  
  const map = lang === 'ta' ? extraTa : extraKn;
  Object.keys(map).forEach(k => {
    text = text.split(k).join(map[k]);
  });
  
  fs.writeFileSync(fp, text, 'utf8');
});
