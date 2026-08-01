/**
 * normalize_consonant_labels.js
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
  'क': 'Ka', 'ख': 'Kha', 'ग': 'Ga', 'घ': 'Gha', 'ङ': 'Nga',
  'च': 'Cha', 'छ': 'Chha', 'ज': 'Ja', 'झ': 'Jha', 'ञ': 'Nya',
  'ट': 'Ta', 'ठ': 'Tha', 'ड': 'Da', 'ढ': 'Dha', 'ण': 'Na',
  'त': 'Tha', 'थ': 'Thha', 'द': 'Tha', 'ध': 'Dhha', 'न': 'Na',
  'प': 'Pa', 'फ': 'Pha', 'ब': 'Ba', 'भ': 'Bha', 'म': 'Ma',
  'य': 'Ya', 'र': 'Ra', 'ल': 'La', 'व': 'Va',
  'श': 'Sha', 'ष': 'Ssa', 'स': 'Sa', 'ह': 'Ha'
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
  'कण्ठ्य': { en: 'Velar (Kanthya)', kn: 'ಕಂಠ್ಯ (ಕಂಠದಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'Velar (Kanthya)' },
  'तालव्य': { en: 'Palatal (Talavya)', kn: 'ತಾಲವ್ಯ (ತಾಲುವಿನಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'Palatal (Talavya)' },
  'मूर्धन्य': { en: 'Retroflex (Murdhanya)', kn: 'ಮೂರ್ಧನ್ಯ (ಮೂರ್ಧನ್ಯ ಉಚ್ಚಾರಣೆ)', ta: 'Retroflex (Murdhanya)' },
  'दन्त्य': { en: 'Dental (Dantya)', kn: 'ದಂತ್ಯ (ಹಲ್ಲಿನ ಬಳಿ ಉಚ್ಚಾರಣೆ)', ta: 'Dental (Dantya)' },
  'ओष्ठ्य': { en: 'Labial (Oshthya)', kn: 'ಓಷ್ಠ್ಯ (ತುಟಿಗಳಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'Labial (Oshthya)' },
  'अन्तःस्थ': { en: 'Approximant (Antastha)', kn: 'ಅಂತಃಸ್ಥ (ಅರ್ಧಸ್ವರಗಳು)', ta: 'Approximant (Antastha)' },
  'उष्म': { en: 'Fricative (Ushma)', kn: 'ಉಷ್ಮ (ಉಸಿರಿನಿಂದ ಉಚ್ಚಾರಣೆ)', ta: 'Fricative (Ushma)' }
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
        slide.content = `Consonant Introduction – "${taC}" (${bGlyph})`;
        slide.subtitle = `Welcome! You have selected the "${taC}" consonant!`;
        slide.note = 'Today we will learn – its form, pronunciation and matra combinations';
        slide.consonant = taC;
      }
    }

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
        slide.content = `In Brahmi script, the form of "${taC}" is: ${bGlyph}. Pronunciation: ${taC}`;
        slide.drill = `Try speaking aloud: ${taC}… ${taC}… ${taC}`;
        slide.consonant = taC;
      }
    }

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
        slide.title = 'Without Matra';
        slide.content = `When "${taC}" is alone → ${bGlyph} (sound: ${taC}). Without matra = consonant sound + inherent 'a' vowel.`;
        slide.consonant = taC;
      }
    }

    if (slide.type === 'matra_combinations') {
      if (lang === 'en') {
        slide.title = `"${romC.toUpperCase()}" with Matras`;
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = `"${knC}" ಮಾತ್ರಾಗಳೊಂದಿಗೆ`;
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = `"${taC}" with Matras`;
        slide.consonant = taC;
      }
    }

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
        slide.title = 'Pronunciation Drill';
        slide.content = 'Listen to the audio and repeat out loud.';
        slide.consonant = taC;
      }
    }

    if (slide.type === 'recognition_mcq') {
      if (lang === 'en') {
        slide.title = 'Recognition Practice';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಗುರುತಿಸುವ ಅಭ್ಯಾಸ';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'Recognition Practice';
        slide.consonant = taC;
      }
    }

    if (slide.type === 'reverse_mcq') {
      if (lang === 'en') {
        slide.title = 'Reverse Practice (Brahmi → Script)';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ವಿಲೋಮ ಅಭ್ಯಾಸ (ಬ್ರಾಹ್ಮಿ → ಕನ್ನಡ)';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'Reverse Practice (Brahmi → Script)';
        slide.consonant = taC;
      }
    }

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
        slide.title = 'Matching Game';
        slide.note = 'Match the correct pairs';
        slide.consonant = taC;
      }
    }

    if (slide.type === 'fill_blank') {
      if (lang === 'en') {
        slide.title = 'Fill in the Blank';
        slide.consonant = romC.toUpperCase();
      } else if (lang === 'kn') {
        slide.title = 'ಖಾಲಿ ಜಾಗ ಭರ್ತಿ ಮಾಡಿ';
        slide.consonant = knC;
      } else if (lang === 'ta') {
        slide.title = 'Fill in the Blank';
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
        slide.title = 'Tracing Practice';
        slide.content = `Trace ${bGlyph} and its matra combinations with your finger/pen.`;
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
        slide.title = 'Summary';
        slide.content = `Awesome! You have learned the form, pronunciation, and matra combinations of the "${taC}" consonant.`;
        slide.bonusUnlock = 'Explorer Badge';
        slide.consonant = taC;
      }
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[${lang}] Successfully normalized slide consonant tags and unique labels!`);
});
