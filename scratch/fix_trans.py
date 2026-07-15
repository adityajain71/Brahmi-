import re

with open('content/translate_json.js', 'r', encoding='utf-8') as f:
    text = f.read()

# I want to inject getLocalizedLabel
injection = """
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
  'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ',
  'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ'
};
const DEVANAGARI_TO_TAMIL_MAP = {
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
  if (lang === 'ta') return DEVANAGARI_TO_TAMIL_MAP[c] || c;
  return c;
}
"""

text = text.replace("const DEVANAGARI_TO_TAMIL_LETTER_MAP = {", injection + "\nconst DEVANAGARI_TO_TAMIL_LETTER_MAP = {")

# In translateVyanjanArray, right after `let s = clone(slide);` add `if (s.consonant) { s.localizedLabel = getLocalizedLabel(s.consonant, lang); }`
text = text.replace("let s = clone(slide);", "let s = clone(slide);\n    if (s.consonant) { s.localizedLabel = getLocalizedLabel(s.consonant, lang); }")

# In translateVyanjanArray, for group_list: add localizedLabel for items.
group_code = """
    if (s.type === 'group_list') {
       if (s.items && Array.isArray(s.items)) {
           s.items.forEach(item => {
               item.localizedLabel = getLocalizedLabel(item.devanagari, lang);
           });
       }
    }
    if (s.type === 'consonant_selection_recap' && s.groupsRecap) {
       s.groupsRecap.forEach(g => {
           if (g.items) {
               g.items.forEach(item => {
                   item.localizedLabel = getLocalizedLabel(item.devanagari, lang);
               });
           }
       });
    }
"""
text = text.replace("const c = s.consonant;", group_code + "\n    const c = s.consonant;")

with open('content/translate_json.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("done")
