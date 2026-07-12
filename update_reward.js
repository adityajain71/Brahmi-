const fs = require('fs');
const path = require('path');

const translatedRewards = {
  hi: {
    "title": "पुरस्कार: 1",
    "badge": "पहला कदम",
    "message": "आपने पहला चरण सफलतापूर्वक पूरा किया! आपका \"पहला कदम\" पदक अब आपका है। यह सिर्फ एक शुरुआत है — आगे और भी रोमांचक चीज़ें आपका इंतज़ार कर रहे हैं। आपके हर सही कदम के साथ, आप ज्ञान की सीढ़ियों पर और ऊपर बढ़ते जाएंगे।",
    "sourcePages": [49, 49]
  },
  en: {
    "title": "Reward: 1",
    "badge": "First Step",
    "message": "You have successfully completed the first step! Your \"First Step\" badge is now yours. This is just the beginning — more exciting things await you. With every right step, you will climb higher on the stairs of knowledge.",
    "sourcePages": [49, 49]
  },
  ta: {
    "title": "வெகுமதி: 1",
    "badge": "முதல் படி",
    "message": "நீங்கள் முதல் படியை வெற்றிகரமாக முடித்துவிட்டீர்கள்! உங்கள் \"முதல் படி\" பதக்கம் இப்போது உங்களுடையது. இது ஒரு ஆரம்பம் மட்டுமே - மேலும் பல சுவாரஸ்யமான விஷயங்கள் உங்களுக்காக காத்திருக்கின்றன. ஒவ்வொரு சரியான அடியிலும், நீங்கள் அறிவின் படிக்கட்டுகளில் மேலே ஏறுவீர்கள்.",
    "sourcePages": [49, 49]
  },
  kn: {
    "title": "ಬಹುಮಾನ: 1",
    "badge": "ಮೊದಲ ಹೆಜ್ಜೆ",
    "message": "ನೀವು ಮೊದಲ ಹೆಜ್ಜೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ! ನಿಮ್ಮ \"ಮೊದಲ ಹೆಜ್ಜೆ\" ಬ್ಯಾಡ್ಜ್ ಈಗ ನಿಮ್ಮದಾಗಿದೆ. ಇದು ಕೇವಲ ಆರಂಭವಷ್ಟೇ — ಇನ್ನೂ ರೋಚಕವಾದ ವಿಷಯಗಳು ನಿಮಗಾಗಿ ಕಾಯುತ್ತಿವೆ. ಪ್ರತಿಯೊಂದು ಸರಿಯಾದ ಹೆಜ್ಜೆಯೊಂದಿಗೆ, ನೀವು ಜ್ಞಾನದ ಮೆಟ್ಟಿಲುಗಳನ್ನು ಮೇಲಕ್ಕೆ ಏರುತ್ತೀರಿ.",
    "sourcePages": [49, 49]
  }
};

const filesToProcess = [
  { file: 'brahmi_full_course.json', lang: 'hi' },
  { file: 'content/hi/course.json', lang: 'hi' },
  { file: 'content/en/course.json', lang: 'en' },
  { file: 'content/ta/course.json', lang: 'ta' },
  { file: 'content/kn/course.json', lang: 'kn' }
];

let count = 0;
for (const item of filesToProcess) {
  const filePath = path.join(__dirname, item.file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;
    
    // Sort logic: 
    // bonusSampleTrueFalse = 47
    // congratsMessage = 48
    // reward1 = 49
    
    if (data.swar) {
      if (data.swar.congratsMessage) {
        data.swar.congratsMessage.sourcePages = [48, 48];
        modified = true;
      }
      
      if (data.swar.reward1) {
        data.swar.reward1 = {
          ...data.swar.reward1,
          ...translatedRewards[item.lang]
        };
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated ${item.file}`);
      count++;
    }
  }
}
console.log(`Modified ${count} files.`);
