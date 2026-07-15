const fs = require('fs');
const path = require('path');

const transMap = {
  en: {
    "आप वास्तव में विशेष जिज्ञासु और सीखने के इच्छुक हैं, तभी तो आप इस अनोखी यात्रा के इस पड़ाव तक पहुंच पाए हैं।\\n\\nहार्दिक बधाई और शुभकामनाएं!": "You are truly curious and eager to learn, which is why you have reached this stage of this unique journey.\\n\\nHearty congratulations and best wishes!",
    "सम्यक् प्रज्ञा सम्मान": "Right Knowledge Award",
    "देवनागरी से ब्राह्मी पहचान कर सफल हुआ": "Successfully recognized Devanagari to Brahmi",
    "लिपि आस्था सम्मान": "Script Devotion Award",
    "ब्राह्मी से देवनागरी पहचान कर सफल हुआ": "Successfully recognized Brahmi to Devanagari",
    "अक्षर साधना": "Letter Practice",
    "सभी 12 स्वरों को ब्राह्मी में लिखा": "Wrote all 12 vowels in Brahmi",
    "सत्य-असत्य प्रश्नों में सफल हुआ": "Succeeded in true-false questions",
    "श्रेष्ठ ज्ञानी": "Supreme Scholar",
    "स्वर सीखने के बाद व्यञ्जन (consonants) को चुना": "Chose consonants after learning vowels",
    "ब्राह्मी एक भाषा है?": "Is Brahmi a language?",
    "सही": "True",
    "गलत": "False",
    "आज हम सीखेंगे – इसका रूप, उच्चारण और मात्राओं के साथ योग पढ़ना और लिखना": "Today we will learn – its form, pronunciation and reading/writing with matras",
    "(यहां \"क\" की तरह ही मात्रा ट्रेसिंग लूप)": "(Matra tracing loop same as \"ka\" here)"
  },
  ta: {
    "आप वास्तव में विशेष जिज्ञासु और सीखने के इच्छुक हैं, तभी तो आप इस अनोखी यात्रा के इस पड़ाव तक पहुंच पाए हैं।\\n\\nहार्दिक बधाई और शुभकामनाएं!": "நீங்கள் உண்மையிலேயே ஆர்வமும் கற்க விருப்பமும் கொண்டவர், அதனால்தான் இந்த தனித்துவமான பயணத்தின் இந்த கட்டத்தை நீங்கள் அடைந்துள்ளீர்கள்.\\n\\nமனமார்ந்த வாழ்த்துக்கள்!",
    "सम्यक् प्रज्ञा सम्मान": "சரியான அறிவு விருது",
    "देवनागरी से ब्राह्मी पहचान कर सफल हुआ": "தேவநாகரியிலிருந்து பிராமியை வெற்றிகரமாக அடையாளம் கண்டார்",
    "लिपि आस्था सम्मान": "எழுத்துமுறை பக்தி விருது",
    "ब्राह्मी से देवनागरी पहचान कर सफल हुआ": "பிராமியிலிருந்து தேவநாகரியை வெற்றிகரமாக அடையாளம் கண்டார்",
    "अक्षर साधना": "எழுத்து பயிற்சி",
    "सभी 12 स्वरों को ब्राह्मी में लिखा": "அனைத்து 12 உயிரெழுத்துக்களையும் பிராமியில் எழுதினார்",
    "सत्य-असत्य प्रश्नों में सफल हुआ": "உண்மை-பொய் கேள்விகளில் வெற்றி பெற்றார்",
    "श्रेष्ठ ज्ञानी": "சிறந்த அறிஞர்",
    "स्वर सीखने के बाद व्यञ्जन (consonants) को चुना": "உயிரெழுத்துக்களைக் கற்ற பிறகு மெய்யெழுத்துக்களைத் தேர்ந்தெடுத்தார்",
    "ब्राह्मी एक भाषा है?": "பிராமி ஒரு மொழியா?",
    "सही": "உண்மை",
    "गलत": "பொய்",
    "आज हम सीखेंगे – इसका रूप, उच्चारण और मात्राओं के साथ योग पढ़ना और लिखना": "இன்று நாம் கற்போம் – அதன் வடிவம், உச்சரிப்பு மற்றும் மாத்ராக்களுடன் படிப்பது/எழுதுவது",
    "(यहां \"क\" की तरह ही मात्रा ट्रेसिंग लूप)": "(இங்கே \"க\" போன்றே மாத்ரா டிரேசிங் வளையம்)"
  },
  kn: {
    "आप वास्तव में विशेष जिज्ञासु और सीखने के इच्छुक हैं, तभी तो आप इस अनोखी यात्रा के इस पड़ाव तक पहुंच पाए हैं।\\n\\nहार्दिक बधाई और शुभकामनाएं!": "ನೀವು ನಿಜವಾಗಿಯೂ ಕುತೂಹಲಕಾರಿ ಮತ್ತು ಕಲಿಯಲು ಉತ್ಸುಕರಾಗಿದ್ದೀರಿ, ಅದಕ್ಕಾಗಿಯೇ ನೀವು ಈ ಅನನ್ಯ ಪ್ರಯಾಣದ ಈ ಹಂತವನ್ನು ತಲುಪಿದ್ದೀರಿ.\\n\\nಹೃತ್ಪೂರ್ವಕ ಅಭಿನಂದನೆಗಳು ಮತ್ತು ಶುಭಾಶಯಗಳು!",
    "सम्यक् प्रज्ञा सम्मान": "ಸರಿಯಾದ ಜ್ಞಾನ ಪ್ರಶಸ್ತಿ",
    "देवनागरी से ब्राह्मी पहचान कर सफल हुआ": "ದೇವನಾಗರಿಯಿಂದ ಬ್ರಾಹ್ಮಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಗುರುತಿಸಿದ್ದಾರೆ",
    "लिपि आस्था सम्मान": "ಲಿಪಿ ಭಕ್ತಿ ಪ್ರಶಸ್ತಿ",
    "ब्राह्मी से देवनागरी पहचान कर सफल हुआ": "ಬ್ರಾಹ್ಮಿಯಿಂದ ದೇವನಾಗರಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಗುರುತಿಸಿದ್ದಾರೆ",
    "अक्षर साधना": "ಅಕ್ಷರ ಅಭ್ಯಾಸ",
    "सभी 12 स्वरों को ब्राह्मी में लिखा": "ಎಲ್ಲಾ 12 ಸ್ವರಗಳನ್ನು ಬ್ರಾಹ್ಮಿಯಲ್ಲಿ ಬರೆದಿದ್ದಾರೆ",
    "सत्य-असत्य प्रश्नों में सफल हुआ": "ಸರಿ-ತಪ್ಪು ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿದ್ದಾರೆ",
    "श्रेष्ठ ज्ञानी": "ಶ್ರೇಷ್ಠ ವಿದ್ವಾಂಸ",
    "स्वर सीखने के बाद व्यञ्जन (consonants) को चुना": "ಸ್ವರಗಳನ್ನು ಕಲಿತ ನಂತರ ವ್ಯಂಜನಗಳನ್ನು ಆರಿಸಿಕೊಂಡರು",
    "ब्राह्मी एक भाषा है?": "ಬ್ರಾಹ್ಮಿ ಒಂದು ಭಾಷೆಯೇ?",
    "सही": "ಸರಿ",
    "गलत": "ತಪ್ಪು",
    "आज हम सीखेंगे – इसका रूप, उच्चारण और मात्राओं के साथ योग पढ़ना और लिखना": "ಇಂದು ನಾವು ಕಲಿಯುತ್ತೇವೆ – ಅದರ ರೂಪ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಮಾತ್ರೆಗಳೊಂದಿಗೆ ಓದುವುದು/ಬರೆಯುವುದು",
    "(यहां \"क\" की तरह ही मात्रा ट्रेसिंग लूप)": "(ಇಲ್ಲಿ \"ಕ\" ದಂತೆಯೇ ಮಾತ್ರಾ ಟ್ರೇಸಿಂಗ್ ಲೂಪ್)"
  }
};

const swarMapEn = { 'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah' };
const swarMapTa = { 'अ': 'அ', 'आ': 'ஆ', 'इ': 'இ', 'ई': 'ஈ', 'उ': 'உ', 'ऊ': 'ஊ', 'ए': 'ஏ', 'ऐ': 'ஐ', 'ओ': 'ஓ', 'औ': 'ஔ', 'अं': 'அம்', 'अः': 'அஃ' };
const swarMapKn = { 'अ': 'ಅ', 'आ': 'ಆ', 'इ': 'ಇ', 'ई': 'ಈ', 'उ': 'ಉ', 'ऊ': 'ಊ', 'ए': 'ಏ', 'ऐ': 'ಐ', 'ओ': 'ಓ', 'औ': 'ಔ', 'अं': 'ಅಂ', 'अः': 'ಅಃ' };

const regexPatterns = [
  {
    regex: /^(.+) को ब्राह्मी में लिखें( \(.*\))?$/,
    en: (swar, paren) => {
      let pEn = (paren || '').replace('अनुस्वार', 'Anusvara').replace('विसर्ग', 'Visarga');
      return `Write ${swarMapEn[swar]} in Brahmi${pEn}`;
    },
    ta: (swar, paren) => {
      let pTa = (paren || '').replace('अनुस्वार', 'அனுஸ்வாரா').replace('विसर्ग', 'விசர்கா');
      return `பிராமியில் ${swarMapTa[swar]} ஐ எழுதுங்கள்${pTa}`;
    },
    kn: (swar, paren) => {
      let pKn = (paren || '').replace('अनुस्वार', 'ಅನುಸ್ವಾರ').replace('विसर्ग', 'ವಿಸರ್ಗ');
      return `ಬ್ರಾಹ್ಮಿಯಲ್ಲಿ ${swarMapKn[swar]} ಅನ್ನು ಬರೆಯಿರಿ${pKn}`;
    }
  }
];

function translateString(str, lang) {
  // Try exact match with normalized newlines
  const normStr = str.replace(/\n/g, '\\n');
  if (transMap[lang][normStr]) {
    return transMap[lang][normStr].replace(/\\n/g, '\n');
  }
  if (transMap[lang][str]) return transMap[lang][str];
  
  for (const p of regexPatterns) {
    const match = str.match(p.regex);
    if (match) {
      return p[lang](...match.slice(1));
    }
  }
  return str;
}

function traverseAndTranslate(obj, lang) {
  let modified = false;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string') {
        const trans = translateString(obj[i], lang);
        if (trans !== obj[i]) {
          obj[i] = trans;
          modified = true;
        }
      } else {
        if (traverseAndTranslate(obj[i], lang)) modified = true;
      }
    }
  } else if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        const trans = translateString(obj[key], lang);
        if (trans !== obj[key]) {
          obj[key] = trans;
          modified = true;
        }
      } else {
        if (traverseAndTranslate(obj[key], lang)) modified = true;
      }
    });
  }
  return modified;
}

['en', 'ta', 'kn'].forEach(lang => {
  const fp = path.join(__dirname, 'content', lang, 'course.json');
  const course = JSON.parse(fs.readFileSync(fp, 'utf8'));
  
  const changed = traverseAndTranslate(course, lang);
  if (changed) {
    fs.writeFileSync(fp, JSON.stringify(course, null, 2), 'utf8');
    console.log(`Translated remaining strings in ${lang}/course.json`);
  }
});
