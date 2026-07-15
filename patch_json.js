const fs = require('fs');
const path = require('path');

const langs = {
  en: {
    'आज हम सीखेंगे – इसका रूप, उच्चारण और मात्राओं के साथ योग पढ़ना और लिखना': 'Today we will learn – its form, pronunciation and reading/writing with matras.',
    'स्वागतम्! आपने "([^"]+)" व्यंजन चुना है!': (m, c) => 'Welcome! You have chosen the "' + c + '" consonant!',
    'बोनस: व्यंजन परिचय – "([^"]+)" \\(([^)]+)\\)': (m, c, b) => 'Bonus: Consonant Introduction – "' + c + '" (' + b + ')'
  },
  ta: {
    'आज हम सीखेंगे – इसका रूप, उच्चारण और मात्राओं के साथ योग पढ़ना और लिखना': 'இன்று நாம் கற்போம் – அதன் வடிவம், உச்சரிப்பு மற்றும் மாத்ராக்களுடன் படிப்பது/எழுதுவது.',
    'स्वागतम्! आपने "([^"]+)" व्यंजन चुना है!': (m, c) => 'வரவேற்பு! நீங்கள் "' + c + '" மெய்யெழுத்தைத் தேர்ந்தெடுத்துள்ளீர்கள்!',
    'बोनस: व्यंजन परिचय – "([^"]+)" \\(([^)]+)\\)': (m, c, b) => 'போனஸ்: மெய்யெழுத்து அறிமுகம் – "' + c + '" (' + b + ')'
  },
  kn: {
    'आज हम सीखेंगे – इसका रूप, उच्चारण और मात्राओं के साथ योग पढ़ना और लिखना': 'ಇಂದು ನಾವು ಕಲಿಯುತ್ತೇವೆ – ಅದರ ರೂಪ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಮಾತ್ರೆಗಳೊಂದಿಗೆ ಓದುವುದು/ಬರೆಯುವುದು.',
    'स्वागतम्! आपने "([^"]+)" व्यंजन चुना है!': (m, c) => 'ಸ್ವಾಗತ! ನೀವು "' + c + '" ವ್ಯಂಜನವನ್ನು ಆರಿಸಿದ್ದೀರಿ!',
    'बोनस: व्यंजन परिचय – "([^"]+)" \\(([^)]+)\\)': (m, c, b) => 'ಬೋನಸ್: ವ್ಯಂಜನ ಪರಿಚಯ – "' + c + '" (' + b + ')'
  }
};

['en', 'ta', 'kn'].forEach(lang => {
  const fp = path.join(__dirname, 'content', lang, 'course.json');
  let text = fs.readFileSync(fp, 'utf8');
  
  for (const [key, val] of Object.entries(langs[lang])) {
    if (typeof val === 'string') {
      text = text.split(key).join(val);
    } else {
      const regex = new RegExp(key, 'g');
      text = text.replace(regex, val);
    }
  }
  
  fs.writeFileSync(fp, text, 'utf8');
  console.log('Fixed', lang);
});
