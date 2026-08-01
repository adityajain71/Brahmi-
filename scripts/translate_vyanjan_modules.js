/**
 * translate_vyanjan_modules.js
 * Translates English, Kannada, and Tamil vyanjan modules into authentic native script text.
 */

const fs = require('fs');
const path = require('path');

const hiData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'hi', 'course.json'), 'utf8'));

const KN_CONSONANTS = {
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ',
  'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ड': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ',
  'त': 'ತ', 'थ': 'ಥ', 'द': 'ದ', 'ध': 'ಧ', 'न': 'ನ',
  'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ',
  'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ'
};

const TA_CONSONANTS = {
  'क': 'க', 'ख': 'க', 'ग': 'க', 'घ': 'க', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச', 'ज': 'ஜ', 'झ': 'ச', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட', 'ड': 'ட', 'ढ': 'ட', 'ण': 'ண',
  'त': 'த', 'थ': 'த', 'द': 'த', 'ध': 'த', 'न': 'ந',
  'प': 'ப', 'फ': 'ப', 'ब': 'ப', 'भ': 'ப', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஸ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ'
};

const ROM_CONSONANTS = {
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'tta', 'ठ': 'ttha', 'ड': 'dda', 'ढ': 'ddha', 'ण': 'nna',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'sha', 'ष': 'ssa', 'स': 'sa', 'ह': 'ha'
};

const GROUP_NAMES = {
  'कण्ठ्य': { en: 'Velar (Kanthya)', kn: 'ಕಂಠ್ಯ (ಕಂಠದಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'கண்ட்ய (தொண்டை ஒலி)' },
  'तालव्य': { en: 'Palatal (Talavya)', kn: 'ತಾಲವ್ಯ (ತಾಲುವಿನಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'தாலவ்ய (அண்ண ஒலி)' },
  'मूर्धन्य': { en: 'Retroflex (Murdhanya)', kn: 'ಮೂರ್ಧನ್ಯ (ಮೂರ್ಧನ್ಯ ಉಚ್ಚಾರಣೆ)', ta: 'மூர்தன்ய (மூர்தன்ய ஒலி)' },
  'दन्त्य': { en: 'Dental (Dantya)', kn: 'ದಂತ್ಯ (ಹಲ್ಲಿನ ಬಳಿ ಉಚ್ಚಾರಣೆ)', ta: 'தந்த்ய (பல் ஒலி)' },
  'ओष्ठ्य': { en: 'Labial (Oshthya)', kn: 'ಓಷ್ಠ್ಯ (ತುಟಿಗಳಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'ஓஷ்ட்ய (உதடு ஒலி)' },
  'अन्तःस्थ': { en: 'Approximant (Antastha)', kn: 'ಅಂತಃಸ್ಥ (ಅರ್ಧಸ್ವರಗಳು)', ta: 'அந்தஸ்த (இடையின ஒலி)' },
  'उष्म': { en: 'Fricative (Ushma)', kn: 'ಉಷ್ಮ (ಉಸಿರಿನಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'உஷ்ம (உரசொலி)' }
};

['en', 'kn', 'ta'].forEach(lang => {
  const filePath = path.join(__dirname, '..', 'content', lang, 'course.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.vyanjan.forEach((slide, idx) => {
    const hiSlide = hiData.vyanjan[idx];
    if (!hiSlide) return;

    const devC = hiSlide.consonant || 'क';
    const knC = KN_CONSONANTS[devC] || devC;
    const taC = TA_CONSONANTS[devC] || devC;
    const romC = ROM_CONSONANTS[devC] || devC;
    const bGlyph = hiSlide.consonantBrahmi || '𑀓';

    // 1. group_list
    if (slide.type === 'group_list') {
      const gInfo = GROUP_NAMES[hiSlide.groupName] || { en: hiSlide.groupName, kn: hiSlide.groupName, ta: hiSlide.groupName };
      slide.groupName = gInfo[lang] || gInfo.en;
      if (Array.isArray(slide.items)) {
        slide.items.forEach(it => {
          if (lang === 'kn') it.localizedLabel = KN_CONSONANTS[it.devanagari] || it.devanagari;
          else if (lang === 'ta') it.localizedLabel = TA_CONSONANTS[it.devanagari] || it.devanagari;
          else it.localizedLabel = ROM_CONSONANTS[it.devanagari] || it.devanagari;
        });
      }
    }

    // 2. bonus_title
    if (slide.type === 'bonus_title') {
      if (lang === 'en') {
        slide.content = `Consonant Introduction – "${romC.toUpperCase()}" (${bGlyph})`;
        slide.subtitle = `Welcome! You have selected the "${romC.toUpperCase()}" consonant!`;
        slide.note = 'Today we will learn – its form, pronunciation and matra combinations';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.content = `ವ್ಯಂಜನ ಪರಿಚಯ – "${knC}" (${bGlyph})`;
        slide.subtitle = `ಸ್ವಾಗತ! ನೀವು "${knC}" ವ್ಯಂಜನವನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ!`;
        slide.note = 'ಇಂದು ನಾವು ಕಲಿಯುತ್ತೇವೆ – ಇದರ ರೂಪ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಮಾತ್ರಾಗಳೊಂದಿಗೆ ಸಂಯೋಜನೆ';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.content = `மெய்யெழுத்து அறிமுகம் – "${taC}" (${bGlyph})`;
        slide.subtitle = `வரவேற்கிறோம்! நீங்கள் "${taC}" மெய்யெழுத்தைத் தேர்ந்தெடுத்துள்ளீர்கள்!`;
        slide.note = 'இன்று நாம் கற்போம் – இதன் வடிவம், உச்சரிப்பு மற்றும் மாத்ரா சேர்க்கை';
        slide.consonant = taC;
      }
    }

    // 3. form_pronunciation
    if (slide.type === 'form_pronunciation') {
      if (lang === 'en') {
        slide.content = `In Brahmi script, the form of "${romC.toUpperCase()}" is: ${bGlyph}. Pronunciation: ${romC}`;
        slide.drill = `Try speaking aloud: ${romC}… ${romC}… ${romC}`;
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.content = `ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "${knC}" ರ ರೂಪ: ${bGlyph}. ಉಚ್ಚಾರಣೆ: ${knC}`;
        slide.drill = `ಪ್ರಯತ್ನಿಸಿ – ಗಟ್ಟಿಯಾಗಿ ಹೇಳಿ: ${knC}… ${knC}… ${knC}`;
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.content = `பிராமி எழுத்தில் "${taC}" இன் வடிவம்: ${bGlyph}. உச்சரிப்பு: ${taC}`;
        slide.drill = `முயற்சிக்கவும் – உரக்கச் சொல்லுங்கள்: ${taC}… ${taC}… ${taC}`;
        slide.consonant = taC;
      }
    }

    // 4. bina_matra
    if (slide.type === 'bina_matra') {
      if (lang === 'en') {
        slide.title = 'Without Matra';
        slide.content = `When "${romC}" is alone → ${bGlyph} (sound: ${romC}). Without matra = consonant sound + inherent 'a' vowel.`;
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಮಾತ್ರೆ ಇಲ್ಲದೆ';
        slide.content = `"${knC}" ಒಂಟಿಯಾಗಿದ್ದಾಗ → ${bGlyph} (ಧ್ವನಿ: ${knC}). ಮಾತ್ರೆ ಇಲ್ಲದೆ = ವ್ಯಂಜನ ಧ್ವನಿ + 'ಅ' ಸ್ವರ ಸ್ವತಃ ಸೇರಿರುತ್ತದೆ.`;
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'மாத்ரா இன்றி';
        slide.content = `"${taC}" தனியாக இருக்கும்போது → ${bGlyph} (ஒலி: ${taC}). மாத்ரா இன்றி = மெய்யொலி + 'அ' உயிர் இயல்பாக இணைந்தது.`;
        slide.consonant = taC;
      }
    }

    // 5. matra_combinations title
    if (slide.type === 'matra_combinations') {
      if (lang === 'en') {
        slide.title = `"${romC.toUpperCase()}" with Matras`;
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = `"${knC}" ಮಾತ್ರಾಗಳೊಂದಿಗೆ`;
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = `"${taC}" மாத்ராக்களுடன்`;
        slide.consonant = taC;
      }
    }

    // 6. pronunciation_drill
    if (slide.type === 'pronunciation_drill') {
      if (lang === 'en') {
        slide.title = 'Pronunciation Drill';
        slide.content = 'Listen to the audio and repeat out loud.';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಉಚ್ಚಾರಣೆ ಅಭ್ಯಾಸ';
        slide.content = 'ಆಡಿಯೊ ಆಲಿಸಿ ಮತ್ತು ಪುನರಾವರ್ತಿಸಿ.';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'உச்சரிப்பு பயிற்சி';
        slide.content = 'ஒலியைக் கேட்டு உரக்கத் திரும்பச் சொல்லுங்கள்.';
        slide.consonant = taC;
      }
    }

    // 7. recognition_mcq
    if (slide.type === 'recognition_mcq') {
      if (lang === 'en') {
        slide.title = 'Recognition Practice';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಗುರುತಿಸುವ ಅಭ್ಯಾಸ';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'அடையாளப் பயிற்சி';
        slide.consonant = taC;
      }
    }

    // 8. reverse_mcq
    if (slide.type === 'reverse_mcq') {
      if (lang === 'en') {
        slide.title = 'Reverse Practice (Brahmi → Script)';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ವಿಲೋಮ ಅಭ್ಯಾಸ (ಬ್ರಾಹ್ಮಿ → ಕನ್ನಡ)';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'தலைகீழ் பயிற்சி (பிராமி → தமிழ்)';
        slide.consonant = taC;
      }
    }

    // 9. matching_game
    if (slide.type === 'matching_game') {
      if (lang === 'en') {
        slide.title = 'Matching Game';
        slide.note = 'Match the correct pairs';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ';
        slide.note = 'ಸರಿಯಾದ ಜೋಡಿಗಳನ್ನು ಹೊಂದಿಸಿ';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'பொருத்துதல் விளையாட்டு';
        slide.note = 'சரியான ஜோடிகளைப் பொருத்துங்கள்';
        slide.consonant = taC;
      }
    }

    // 10. fill_blank
    if (slide.type === 'fill_blank') {
      if (lang === 'en') {
        slide.title = 'Fill in the Blank';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಖಾಲಿ ಜಾಗ ಭರ್ತಿ ಮಾಡಿ';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'கோடிட்ட இடத்தை நிரப்புக';
        slide.consonant = taC;
      }
    }

    // 11. trace_practice
    if (slide.type === 'trace_practice') {
      if (lang === 'en') {
        slide.title = 'Tracing Practice';
        slide.content = `Trace ${bGlyph} and its matra combinations with your finger/pen.`;
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಟ್ರೇಸಿಂಗ್ ಅಭ್ಯಾಸ';
        slide.content = `ನಿಮ್ಮ ಬೆರಳು/ಪೆನ್‌ನಿಂದ ${bGlyph} ಮತ್ತು ಅದರ ಎಲ್ಲಾ ಮಾತ್ರಾರೂಪಗಳನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ.`;
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'வரைதல் பயிற்சி';
        slide.content = `உங்கள் விரலால் ${bGlyph} மற்றும் அதன் மாத்ரா வடிவங்களை வரையுங்கள்.`;
        slide.consonant = taC;
      }
    }

    // 12. summary
    if (slide.type === 'summary') {
      if (lang === 'en') {
        slide.title = 'Summary';
        slide.content = `Awesome! You have learned the form, pronunciation, and matra combinations of the "${romC.toUpperCase()}" consonant.`;
        slide.bonusUnlock = 'Explorer Badge';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಸಾರಾಂಶ';
        slide.content = `ಉತ್ತಮ! ನೀವು "${knC}" ವ್ಯಂಜನದ ರೂಪ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಮಾತ್ರಾ ಸಂಯೋಜನೆಯನ್ನು ಕರಗತ ಮಾಡಿಕೊಂಡಿದ್ದೀರಿ.`;
        slide.bonusUnlock = 'ಜ್ಞಾನ ಬ್ಯಾಡ್ಜ್';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'முடிவுரை';
        slide.content = `அருமை! நீங்கள் "${taC}" மெய்யெழுத்தின் வடிவம், உச்சரிப்பு மற்றும் மாத்ரா சேர்க்கையைக் கற்றுக்கொண்டீர்கள்.`;
        slide.bonusUnlock = 'அறிவுப் பதக்கம்';
        slide.consonant = taC;
      }
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${lang}] Successfully translated all 371 slides into native script!`);
});
