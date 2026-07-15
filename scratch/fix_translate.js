const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, '../content/translate_json.js'), 'utf-8');

// Inject the devanagari maps near the top
const mapsInjection = `
const DEVANAGARI_TO_ROMAN = {
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha'
};

const DEVANAGARI_TO_KANNADA = {
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ',
  'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ಡ': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ',
  'त': 'ತ', 'थ': 'ಥ', 'ದ': 'ದ', 'ಧ': 'ಧ', 'ನ': 'ನ',
  'प': 'ಪ', 'ಫ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ',
  'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ'
};

const DEVANAGARI_TO_TAMIL = {
  'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச்ஹ', 'ज': 'ஜ', 'झ': 'ஜ்ஹ', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட்ஹ', 'ड': 'ட', 'ढ': 'ட்ஹ', 'ण': 'ண',
  'त': 'த', 'थ': 'த்ஹ', 'द': 'த', 'ध': 'த்ஹ', 'न': 'ந',
  'प': 'ப', 'फ': 'ப்ஹ', 'ब': 'ப', 'भ': 'ப்ஹ', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஶ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ'
};

function getLocalizedLabel(c, lang) {
  if (lang === 'en') return DEVANAGARI_TO_ROMAN[c] ? DEVANAGARI_TO_ROMAN[c].toUpperCase() : c;
  if (lang === 'kn') return DEVANAGARI_TO_KANNADA[c] || c;
  if (lang === 'ta') return DEVANAGARI_TO_TAMIL[c] || c;
  return c;
}
`;

content = content.replace('const hiVyanjan = JSON.parse(fs.readFileSync(path.join(__dirname, \'../backend/data/hindi/vyanjan.json\'), \'utf-8\'));', mapsInjection + '\nconst hiVyanjan = JSON.parse(fs.readFileSync(path.join(__dirname, \'../backend/data/hindi/vyanjan.json\'), \'utf-8\'));');

// Update translateVyanjanArray to handle group_list and localizedLabel
const oldFuncMatch = content.match(/function translateVyanjanArray\(vyanjan, lang\) \{[\s\S]*?return s;\r?\n    \}\r?\n    \r?\n    const roman = meta\.romanized;[\s\S]*?s\.uxNote = uxMap\[lang\] \|\| s\.uxNote;\r?\n    \}\r?\n    \r?\n    return s;\r?\n  \}\);\r?\n\}/);

if (!oldFuncMatch) {
  console.log("Could not find function to replace!");
  process.exit(1);
}

const newFunc = `function translateVyanjanArray(vyanjan, lang) {
  const groupNameMap = {
      'en': { 'कण्ठ्य': 'Gutturals', 'तालव्य': 'Palatals', 'मूर्धन्य': 'Cerebrals', 'दन्त्य': 'Dentals', 'ओष्ठ्य': 'Labials', 'अन्तःस्थ': 'Semivowels', 'उष्म': 'Sibilants' },
      'kn': { 'कण्ठ्य': 'ಕಂಠ್ಯ', 'तालव्य': 'ತಾಲ್ವ್ಯ', 'मूर्धन्य': 'ಮೂರ್ಧನ್ಯ', 'दन्त्य': 'ದಂತ್ಯ', 'ओष्ठ्य': 'ಓಷ್ಠ್ಯ', 'अन्तःस्थ': 'ಅಂತಃಸ್ಥ', 'उष्म': 'ಊಷ್ಮ' },
      'ta': { 'कण्ठ्य': 'கண்ட்ய', 'तालव्य': 'தால்வ்ய', 'मूर्धन्य': 'மூர்தன்ய', 'दन्त्य': 'தந்த்ய', 'ओष्ठ्य': 'ஓஷ்ட்ய', 'अन्तःस्थ': 'அந்தஸ்த', 'उष्म': 'ஊஷ்ம' }
  };

  return vyanjan.map(slide => {
    let s = clone(slide);

    if (s.consonant) {
        s.consonantLocalized = getLocalizedLabel(s.consonant, lang);
    }
    
    if (s.type === 'group_list') {
       if (s.items && Array.isArray(s.items)) {
           s.items.forEach(item => {
               item.localizedLabel = getLocalizedLabel(item.devanagari, lang);
           });
       }
       if (groupNameMap[lang] && groupNameMap[lang][s.groupName]) {
           s.groupName = groupNameMap[lang][s.groupName];
       }
    }
    
    if (s.type === 'consonant_selection_recap' && s.groupsRecap) {
       s.groupsRecap.forEach(g => {
           if (groupNameMap[lang] && groupNameMap[lang][g.groupName]) {
               g.groupName = groupNameMap[lang][g.groupName];
           }
           if (g.items) {
               g.items.forEach(item => {
                   item.localizedLabel = getLocalizedLabel(item.devanagari, lang);
               });
           }
       });
    }

    const c = s.consonant;
    if (!c) {
      if (s.type === 'text') {
        const textMap = {
          en: {
            'क से ह तक 33 व्यंजन हैं।': 'There are 33 consonants from Ka to Ha.',
            'इन्हें 7 वर्गों में बांटा गया है।': 'They are divided into 7 groups.'
          },
          kn: {
            'क से ह तक 33 व्यंजन हैं।': 'ಕ ದಿಂದ ಹ ವರೆಗೆ 33 ವ್ಯಂಜನಗಳಿವೆ.',
            'इन्हें 7 वर्गों में बांटा गया है।': 'ಅವುಗಳನ್ನು 7 ವರ್ಗಗಳಾಗಿ ವಿಂಗಡಿಸಲಾಗಿದೆ.'
          },
          ta: {
            'क से ह तक 33 व्यंजन हैं।': 'க முதல் ஹ வரை 33 மெய்யெழுத்துக்கள் உள்ளன.',
            'इन्हें 7 वर्गों में बांटा गया है।': 'அவை 7 குழுக்களாகப் பிரிக்கப்பட்டுள்ளன.'
          }
        };
        if (textMap[lang] && textMap[lang][s.content]) {
          s.content = textMap[lang][s.content];
        }
      }
      if (s.prompt) {
        const promptMap = {
          en: {
            'क्या आप व्यंजन सीखना चाहते हैं?': 'Do you want to learn consonants?',
            'व्यंजन का चयन करें': 'Select a Consonant'
          },
          kn: {
            'क्या आप व्यंजन सीखना चाहते हैं?': 'ನೀವು ವ್ಯಂಜನಗಳನ್ನು ಕಲಿಯಲು ಬಯಸುವಿರಾ?',
            'व्यंजन का चयन करें': 'ವ್ಯಂಜನವನ್ನು ಆಯ್ಕೆಮಾಡಿ'
          },
          ta: {
            'क्या आप व्यंजन सीखना चाहते हैं?': 'நீங்கள் மெய்யெழுத்துக்களைக் கற்க விரும்புகிறீர்களா?',
            'व्यंजन का चयन करें': 'ஒரு மெய்யெழுத்தைத் தேர்ந்தெடுக்கவும்'
          }
        };
        if (promptMap[lang] && promptMap[lang][s.prompt]) {
          s.prompt = promptMap[lang][s.prompt];
        }
      }
      return s;
    }
    
    const meta = hiVyanjan.consonants.find(item => item.devanagari === c) || {};
    const roman = meta.romanized || '';
    const romanUpper = roman.toUpperCase();
    const brahmi = s.consonantBrahmi || meta.brahmi;
    
    const locLetter = getLocalizedLabel(c, lang);
    
    let exStr = '';
    if (lang === 'en') {
      exStr = (meta.exampleWords || []).map(ex => ex.english || ex.romanized).join(', ');
    } else if (lang === 'kn') {
      exStr = (meta.exampleWords || []).map(ex => transliterateDevanagariToKannada(ex.devanagari)).join(', ');
    } else if (lang === 'ta') {
      exStr = (meta.exampleWords || []).map(ex => ex.tamil || transliterateDevanagariToTamil(ex.devanagari)).join(', ');
    }
    
    if (s.type === 'bonus_title') {
      if (lang === 'en') {
        s.content = \`Bonus: Consonant Introduction – "\${romanUpper}" (\${brahmi})\`;
      } else if (lang === 'kn') {
        s.content = \`ಬೋನಸ್: ವ್ಯಂಜನ ಪರಿಚಯ – "\${locLetter}" (\${brahmi})\`;
      } else if (lang === 'ta') {
        s.content = \`போனஸ்: மெய்யெழுத்து அறிமுகம் – "\${locLetter}" (\${brahmi})\`;
      }
    }
    
    else if (s.type === 'form_pronunciation') {
      if (lang === 'en') {
        s.content = \`In Brahmi script, the form of "\${romanUpper}" is: \${brahmi}. Pronunciation: \${meta.pronunciationNoteEnglish || roman} (e.g. – \${exStr})\`;
      } else if (lang === 'kn') {
        s.content = \`ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "\${locLetter}" ದ ರೂಪ: \${brahmi} ಆಗಿದೆ. ಉಚ್ಚಾರಣೆ: \${transliterateDevanagariToKannada(meta.pronunciationNote || '')} (ಉದಾಹರಣೆಗೆ – \${exStr})\`;
      } else if (lang === 'ta') {
        s.content = \`பிராமி எழுத்துமுறையில் "\${locLetter}" வின் வடிவம்: \${brahmi} ஆகும். உச்சரிப்பு: \${meta.pronunciationNoteTamil || meta.pronunciationNoteEnglish || meta.pronunciationNote} (உதாரணமாக – \${exStr})\`;
      }
    }
    
    else if (s.type === 'bina_matra') {
      if (lang === 'en') {
        s.content = \`When "\${romanUpper}" is alone → \${brahmi} (sound: \${roman}). Without matra = only consonant sound + 'a' vowel is inherently attached.\`;
      } else if (lang === 'kn') {
        s.content = \`ಯಾವಾಗ "\${locLetter}" ಒಂಟಿಯಾಗಿರುತ್ತದೆಯೋ → \${brahmi} (ಧ್ವನಿ: \${locLetter}). ಮಾತ್ರಾ ಇಲ್ಲದೆ = ಕೇವಲ ವ್ಯಂಜನ ಧ್ವನಿ + 'ಅ' ಸ್ವರವು ಅಂತರ್ಗತವಾಗಿರುತ್ತದೆ.\`;
      } else if (lang === 'ta') {
        s.content = \`"\${locLetter}" தனியாக இருக்கும்போது → \${brahmi} (ஒலி: \${locLetter}). மாத்ரா இல்லாமல் = மெய்யெழுத்து ஒலி + 'அ' உயிரெழுத்து இயல்பாகவே இணைந்துள்ளது.\`;
      }
    }
    
    else if (s.type === 'pronunciation_drill') {
      const comboSlide = vyanjan.find(item => item.consonant === c && item.type === 'matra_combinations');
      const forms = comboSlide ? comboSlide.forms : [];
      
      let formsStr = '';
      if (lang === 'en') {
        const root = roman.endsWith('a') ? roman.slice(0, -1) : roman;
        const suffixes = ['a', 'aa', 'i', 'ee', 'u', 'oo', 'e', 'ai', 'o', 'au', 'am', 'ah'];
        formsStr = suffixes.map(suf => root + suf).join(' – ');
      } else if (lang === 'kn') {
        formsStr = forms.map(f => transliterateDevanagariToKannada(f.combinedDevanagari)).join(' – ');
      } else if (lang === 'ta') {
        formsStr = forms.map(f => transliterateDevanagariToTamil(f.combinedDevanagari)).join(' – ');
      }
      
      if (lang === 'en') {
        s.content = \`Listen to audio and repeat: \${formsStr}\`;
      } else if (lang === 'kn') {
        s.content = \`ಆಡಿಯೋ ಆಲಿಸಿ ಮತ್ತು ಪುನರಾವರ್ತಿಸಿ: \${formsStr}\`;
      } else if (lang === 'ta') {
        s.content = \`ஆடியோவைக் கேட்டு மீண்டும் சொல்லுங்கள்: \${formsStr}\`;
      }
    }
    
    else if (s.type === 'trace_practice') {
      if (lang === 'en') {
        s.content = \`Trace \${brahmi} and all its matra combinations with your finger/pen.\`;
      } else if (lang === 'kn') {
        s.content = \`ನಿಮ್ಮ ಬೆರಳು/ಪೆನ್ನಿನಿಂದ \${brahmi} ಮತ್ತು ಅದರ ಎಲ್ಲಾ ಮಾತ್ರಾ ರೂಪಗಳನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ.\`;
      } else if (lang === 'ta') {
        s.content = \`\${brahmi} மற்றும் அதன் அனைத்து மாத்ரா இணைப்புகளையும் உங்கள் விரல்/பேனாவால் டிரேஸ் செய்யவும்.\`;
      }
    }
    
    else if (s.type === 'trace_loop_reference') {
      if (lang === 'en') {
        s.content = 'Did you trace them properly? If needed, repeat the practice.';
      } else if (lang === 'kn') {
        s.content = 'ನೀವು ಅವುಗಳನ್ನು ಸರಿಯಾಗಿ ಟ್ರೇಸ್ ಮಾಡಿದ್ದೀರಾ? ಅಗತ್ಯವಿದ್ದರೆ, ಅಭ್ಯಾಸವನ್ನು ಪುನರಾವರ್ತಿಸಿ.';
      } else if (lang === 'ta') {
        s.content = 'நீங்கள் அவற்றை சரியாக டிரேஸ் செய்தீர்களா? தேவைப்பட்டால், பயிற்சியை மீண்டும் செய்யவும்.';
      }
    }
    
    else if (s.type === 'recognition_mcq' || s.type === 'reverse_mcq') {
      const isReverse = (s.type === 'reverse_mcq');
      const questionLabelMap = {
          en: isReverse ? 'Which matra form does this Brahmi symbol represent?' : 'Select the correct Brahmi form for:',
          kn: isReverse ? 'ಈ ಬ್ರಾಹ್ಮಿ ಸಂಕೇತ ಯಾವ ಮಾತ್ರಾ ರೂಪವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ?' : 'ಇದಕ್ಕೆ ಸರಿಯಾದ ಬ್ರಾಹ್ಮಿ ರೂಪವನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
          ta: isReverse ? 'இந்த பிராமி குறியீடு எந்த மாத்ரா வடிவத்தை குறிக்கிறது?' : 'இதற்கு சரியான பிராமி வடிவத்தைத் தேர்ந்தெடுக்கவும்:'
      };
      
      s.examples = s.examples.map(ex => {
        let newPrompt = ex.prompt;
        let newAnswer = ex.answer;
        
        if (lang === 'en') {
            if (isReverse) {
                // English: 'answer' is romanized instead of devanagari
                const findForm = (c, formDev) => {
                    const comboSlide = vyanjan.find(item => item.consonant === c && item.type === 'matra_combinations');
                    if (comboSlide && comboSlide.forms) {
                        const form = comboSlide.forms.find(f => f.combinedDevanagari === formDev);
                        if (form) {
                            const root = roman.endsWith('a') ? roman.slice(0, -1) : roman;
                            const vowelSound = {'अ':'a', 'आ':'aa', 'इ':'i', 'ई':'ee', 'उ':'u', 'ऊ':'oo', 'ए':'e', 'ऐ':'ai', 'ओ':'o', 'औ':'au', 'अं':'am', 'अः':'ah'}[form.vowel] || 'a';
                            return (root + vowelSound).toUpperCase();
                        }
                    }
                    return formDev;
                };
                newAnswer = findForm(c, ex.answer);
            } else {
                const findForm = (c, formDev) => {
                    const comboSlide = vyanjan.find(item => item.consonant === c && item.type === 'matra_combinations');
                    if (comboSlide && comboSlide.forms) {
                        const form = comboSlide.forms.find(f => f.combinedDevanagari === formDev);
                        if (form) {
                            const root = roman.endsWith('a') ? roman.slice(0, -1) : roman;
                            const vowelSound = {'अ':'a', 'आ':'aa', 'इ':'i', 'ई':'ee', 'उ':'u', 'ऊ':'oo', 'ए':'e', 'ऐ':'ai', 'ओ':'o', 'औ':'au', 'अं':'am', 'अः':'ah'}[form.vowel] || 'a';
                            return (root + vowelSound).toUpperCase();
                        }
                    }
                    return formDev;
                };
                newPrompt = findForm(c, ex.prompt);
            }
        } else if (lang === 'kn') {
            newPrompt = isReverse ? ex.prompt : transliterateDevanagariToKannada(ex.prompt);
            newAnswer = isReverse ? transliterateDevanagariToKannada(ex.answer) : ex.answer;
        } else if (lang === 'ta') {
            newPrompt = isReverse ? ex.prompt : transliterateDevanagariToTamil(ex.prompt);
            newAnswer = isReverse ? transliterateDevanagariToTamil(ex.answer) : ex.answer;
        }
        
        return {
            ...ex,
            prompt: newPrompt,
            answer: newAnswer
        };
      });
      
      if (questionLabelMap[lang]) {
          s.content = questionLabelMap[lang];
      }
    }
    
    else if (s.type === 'matching_game') {
      if (lang === 'en') {
        s.content = 'Match the Brahmi symbols with the correct letters:';
        // Convert column B (Devanagari) to English
        if (s.columnB) {
            s.columnB = s.columnB.map(dev => {
                const comboSlide = vyanjan.find(item => item.consonant === c && item.type === 'matra_combinations');
                if (comboSlide && comboSlide.forms) {
                    const form = comboSlide.forms.find(f => f.combinedDevanagari === dev);
                    if (form) {
                        const root = roman.endsWith('a') ? roman.slice(0, -1) : roman;
                        const vowelSound = {'अ':'a', 'आ':'aa', 'इ':'i', 'ई':'ee', 'उ':'u', 'ऊ':'oo', 'ए':'e', 'ऐ':'ai', 'ओ':'o', 'औ':'au', 'अं':'am', 'अः':'ah'}[form.vowel] || 'a';
                        return (root + vowelSound).toUpperCase();
                    }
                }
                return dev;
            });
        }
      } else if (lang === 'kn') {
        s.content = 'ಬ್ರಾಹ್ಮಿ ಸಂಕೇತಗಳನ್ನು ಸರಿಯಾದ ಅಕ್ಷರಗಳೊಂದಿಗೆ ಹೊಂದಿಸಿ:';
        if (s.columnB) s.columnB = s.columnB.map(dev => transliterateDevanagariToKannada(dev));
      } else if (lang === 'ta') {
        s.content = 'பிராமி குறியீடுகளை சரியான எழுத்துகளுடன் பொருத்துக:';
        if (s.columnB) s.columnB = s.columnB.map(dev => transliterateDevanagariToTamil(dev));
      }
    }
    
    else if (s.type === 'fill_blank') {
      if (lang === 'en') {
        s.content = 'Complete the missing Brahmi form:';
        if (s.questions) {
            s.questions = s.questions.map(q => {
                const comboSlide = vyanjan.find(item => item.consonant === c && item.type === 'matra_combinations');
                if (comboSlide && comboSlide.forms) {
                    const form = comboSlide.forms.find(f => f.combinedDevanagari === q.prompt);
                    if (form) {
                        const root = roman.endsWith('a') ? roman.slice(0, -1) : roman;
                        const vowelSound = {'अ':'a', 'आ':'aa', 'इ':'i', 'ई':'ee', 'उ':'u', 'ऊ':'oo', 'ए':'e', 'ऐ':'ai', 'ओ':'o', 'औ':'au', 'अं':'am', 'अः':'ah'}[form.vowel] || 'a';
                        return { ...q, prompt: (root + vowelSound).toUpperCase() };
                    }
                }
                return q;
            });
        }
      } else if (lang === 'kn') {
        s.content = 'ಕಾಣೆಯಾದ ಬ್ರಾಹ್ಮಿ ರೂಪವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ:';
        if (s.questions) s.questions = s.questions.map(q => ({ ...q, prompt: transliterateDevanagariToKannada(q.prompt) }));
      } else if (lang === 'ta') {
        s.content = 'விடுபட்ட பிராமி வடிவத்தை முழுமையாக்குக:';
        if (s.questions) s.questions = s.questions.map(q => ({ ...q, prompt: transliterateDevanagariToTamil(q.prompt) }));
      }
    }
    
    else if (s.type === 'summary') {
      if (lang === 'en') {
        s.content = \`Well done! You have completed "\${romanUpper}".\`;
        s.bonusUnlock = \`Bonus Unlocked: New Brahmi consonant \${brahmi} added to your memory.\`;
      } else if (lang === 'kn') {
        s.content = \`ತುಂಬಾ ಒಳ್ಳೆಯದು! ನೀವು "\${locLetter}" ಅನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.\`;
        s.bonusUnlock = \`ಬೋನಸ್ ಅನ್‌ಲಾಕ್ ಮಾಡಲಾಗಿದೆ: ನಿಮ್ಮ ಸ್ಮರಣೆಗೆ ಹೊಸ ಬ್ರಾಹ್ಮಿ ವ್ಯಂಜನ \${brahmi} ಸೇರಿಸಲಾಗಿದೆ.\`;
      } else if (lang === 'ta') {
        s.content = \`மிக நன்று! நீங்கள் "\${locLetter}" ஐ முடித்துவிட்டீர்கள்.\`;
        s.bonusUnlock = \`போனஸ் திறக்கப்பட்டது: உங்கள் நினைவில் புதிய பிராமி மெய்யெழுத்து \${brahmi} சேர்க்கப்பட்டது.\`;
      }
    }

    // fallback mapping just in case
    else if (s.type === 'text') {
        const textMap = {
            en: {
              'क से ह तक 33 व्यंजन हैं।': 'There are 33 consonants from Ka to Ha.',
              'इन्हें 7 वर्गों में बांटा गया है।': 'They are divided into 7 groups.',
              'यहाँ से आप व्यंजन का अभ्यास मोड चुन सकते हैं।': 'From here you can select the practice mode for consonants.',
              'यहाँ से आप व्यंजन का क्विज मोड चुन सकते हैं।': 'From here you can select the quiz mode for consonants.',
              'मिश्रित अभ्यास (सभी सीखे हुए व्यंजन)': 'Mixed Practice (All learned consonants)'
            },
            kn: {
              'क से ह तक 33 व्यंजन हैं।': 'ಕ ದಿಂದ ಹ ವರೆಗೆ 33 ವ್ಯಂಜನಗಳಿವೆ.',
              'इन्हें 7 वर्गों में बांटा गया है।': 'ಅವುಗಳನ್ನು 7 ವರ್ಗಗಳಾಗಿ ವಿಂಗಡಿಸಲಾಗಿದೆ.',
              'यहाँ से आप व्यंजन का अभ्यास मोड चुन सकते हैं।': 'ಇಲ್ಲಿಂದ ನೀವು ವ್ಯಂಜನಗಳ ಅಭ್ಯಾಸ ಮೋಡ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಬಹುದು.',
              'यहाँ से आप व्यंजन का क्विज मोड चुन सकते हैं।': 'ಇಲ್ಲಿಂದ ನೀವು ವ್ಯಂಜನಗಳ ಕ್ವಿಜ್ ಮೋಡ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಬಹುದು.',
              'मिश्रित अभ्यास (सभी सीखे हुए व्यंजन)': 'ಮಿಶ್ರ ಅಭ್ಯಾಸ (ಕಲಿತ ಎಲ್ಲಾ ವ್ಯಂಜನಗಳು)'
            },
            ta: {
              'क से ह तक 33 व्यंजन हैं।': 'க முதல் ஹ வரை 33 மெய்யெழுத்துக்கள் உள்ளன.',
              'इन्हें 7 वर्गों में बांटा गया है।': 'அவை 7 குழுக்களாகப் பிரிக்கப்பட்டுள்ளன.',
              'यहाँ से आप व्यंजन का अभ्यास मोड चुन सकते हैं।': 'இங்கிருந்து நீங்கள் மெய்யெழுத்துகளுக்கான பயிற்சி முறையைத் தேர்ந்தெடுக்கலாம்.',
              'यहाँ से आप व्यंजन का क्विज मोड चुन सकते हैं।': 'இங்கிருந்து நீங்கள் மெய்யெழுத்துகளுக்கான வினாடி வினா முறையைத் தேர்ந்தெடுக்கலாம்.',
              'मिश्रित अभ्यास (सभी सीखे हुए व्यंजन)': 'கலப்பு பயிற்சி (கற்ற அனைத்து மெய்யெழுத்துக்களும்)'
            }
        };
        if (textMap[lang] && textMap[lang][s.content]) {
            s.content = textMap[lang][s.content];
        }
    }
    
    return s;
  });
}`;

content = content.replace(oldFuncMatch[0], newFunc);

fs.writeFileSync(path.join(__dirname, '../content/translate_json.js'), content, 'utf-8');
console.log("Successfully replaced translateVyanjanArray in translate_json.js");
