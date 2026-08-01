/**
 * generate_missing_vyanjan.js
 * Builds 28 missing consonant lesson sets (12 slides each) for all 4 course.json files.
 */

const fs = require('fs');
const path = require('path');

const LANGS = ['hi', 'en', 'kn', 'ta'];

const CONSONANTS = [
  // Ch-varga (Palatal)
  { devanagari: 'च', brahmi: '𑀘', romanized: 'cha', englishName: 'Cha', exampleWords: { hi: [{ devanagari: 'चाय', romanized: 'chaay', english: 'tea' }, { devanagari: 'चलना', romanized: 'chalna', english: 'to walk' }], en: [{ romanized: 'chaay', english: 'tea' }, { romanized: 'chalna', english: 'to walk' }], kn: [{ romanized: 'chaay', english: 'tea', kannada: 'ಚಾಯ್' }, { romanized: 'chalna', english: 'to walk', kannada: 'ಚಲಿಸುವುದು' }], ta: [{ romanized: 'chaay', english: 'tea', tamil: 'டீ' }, { romanized: 'chalna', english: 'to walk', tamil: 'நடப்பது' }] } },
  { devanagari: 'छ', brahmi: '𑀙', romanized: 'chha', englishName: 'Chha', exampleWords: { hi: [{ devanagari: 'छाता', romanized: 'chhata', english: 'umbrella' }, { devanagari: 'छोटा', romanized: 'chhota', english: 'small / little' }], en: [{ romanized: 'chhata', english: 'umbrella' }, { romanized: 'chhota', english: 'small / little' }], kn: [{ romanized: 'chhata', english: 'umbrella' }, { romanized: 'chhota', english: 'small / little' }], ta: [{ romanized: 'chhata', english: 'umbrella' }, { romanized: 'chhota', english: 'small / little' }] } },
  { devanagari: 'ज', brahmi: '𑀚', romanized: 'ja', englishName: 'Ja', exampleWords: { hi: [{ devanagari: 'जल', romanized: 'jal', english: 'water' }, { devanagari: 'जग', romanized: 'jag', english: 'world / jug' }], en: [{ romanized: 'jal', english: 'water' }, { romanized: 'jag', english: 'world / jug' }], kn: [{ romanized: 'jal', english: 'water' }, { romanized: 'jag', english: 'world / jug' }], ta: [{ romanized: 'jal', english: 'water' }, { romanized: 'jag', english: 'world / jug' }] } },
  { devanagari: 'झ', brahmi: '𑀛', romanized: 'jha', englishName: 'Jha', exampleWords: { hi: [{ devanagari: 'झरना', romanized: 'jharna', english: 'waterfall' }, { devanagari: 'झूला', romanized: 'jhoola', english: 'swing' }], en: [{ romanized: 'jharna', english: 'waterfall' }, { romanized: 'jhoola', english: 'swing' }], kn: [{ romanized: 'jharna', english: 'waterfall' }, { romanized: 'jhoola', english: 'swing' }], ta: [{ romanized: 'jharna', english: 'waterfall' }, { romanized: 'jhoola', english: 'swing' }] } },
  { devanagari: 'ञ', brahmi: '𑀜', romanized: 'nya', englishName: 'Nya', exampleWords: { hi: [{ devanagari: 'ज्ञान', romanized: 'gyaan', english: 'knowledge (nya in conjunct form jña)' }], en: [{ romanized: 'gyaan', english: 'knowledge (nya in conjunct form jña)' }], kn: [{ romanized: 'gyaan', english: 'knowledge (nya in conjunct form jña)' }], ta: [{ romanized: 'gyaan', english: 'knowledge (nya in conjunct form jña)' }] } },

  // Tt-varga (Retroflex)
  { devanagari: 'ट', brahmi: '𑀝', romanized: 'tta', englishName: 'Ta (Retroflex)', exampleWords: { hi: [{ devanagari: 'टोपी', romanized: 'topi', english: 'hat / cap' }, { devanagari: 'टमाटर', romanized: 'tamatar', english: 'tomato' }], en: [{ romanized: 'topi', english: 'hat / cap' }, { romanized: 'tamatar', english: 'tomato' }], kn: [{ romanized: 'topi', english: 'hat / cap' }, { romanized: 'tamatar', english: 'tomato' }], ta: [{ romanized: 'topi', english: 'hat / cap' }, { romanized: 'tamatar', english: 'tomato' }] } },
  { devanagari: 'ठ', brahmi: '𑀞', romanized: 'ttha', englishName: 'Tha (Retroflex)', exampleWords: { hi: [{ devanagari: 'ठंडा', romanized: 'thanda', english: 'cold' }, { devanagari: 'ठग', romanized: 'thag', english: 'thug / swindler' }], en: [{ romanized: 'thanda', english: 'cold' }, { romanized: 'thag', english: 'thug / swindler' }], kn: [{ romanized: 'thanda', english: 'cold' }, { romanized: 'thag', english: 'thug / swindler' }], ta: [{ romanized: 'thanda', english: 'cold' }, { romanized: 'thag', english: 'thug / swindler' }] } },
  { devanagari: 'ड', brahmi: '𑀟', romanized: 'dda', englishName: 'Da (Retroflex)', exampleWords: { hi: [{ devanagari: 'डाकिया', romanized: 'dakiya', english: 'postman' }, { devanagari: 'डमरू', romanized: 'damroo', english: 'small drum' }], en: [{ romanized: 'dakiya', english: 'postman' }, { romanized: 'damroo', english: 'small drum' }], kn: [{ romanized: 'dakiya', english: 'postman' }, { romanized: 'damroo', english: 'small drum' }], ta: [{ romanized: 'dakiya', english: 'postman' }, { romanized: 'damroo', english: 'small drum' }] } },
  { devanagari: 'ढ', brahmi: '𑀠', romanized: 'ddha', englishName: 'Dha (Retroflex)', exampleWords: { hi: [{ devanagari: 'ढोल', romanized: 'dhol', english: 'drum' }, { devanagari: 'ढक्कन', romanized: 'dhakkan', english: 'lid / cover' }], en: [{ romanized: 'dhol', english: 'drum' }, { romanized: 'dhakkan', english: 'lid / cover' }], kn: [{ romanized: 'dhol', english: 'drum' }, { romanized: 'dhakkan', english: 'lid / cover' }], ta: [{ romanized: 'dhol', english: 'drum' }, { romanized: 'dhakkan', english: 'lid / cover' }] } },
  { devanagari: 'ण', brahmi: '𑀡', romanized: 'nna', englishName: 'Na (Retroflex)', exampleWords: { hi: [{ devanagari: 'गणित', romanized: 'ganit', english: 'mathematics (na in medial position)' }], en: [{ romanized: 'ganit', english: 'mathematics (na in medial position)' }], kn: [{ romanized: 'ganit', english: 'mathematics (na in medial position)' }], ta: [{ romanized: 'ganit', english: 'mathematics (na in medial position)' }] } },

  // T-varga (Dental)
  { devanagari: 'त', brahmi: '𑀢', romanized: 'ta', englishName: 'Ta (Dental)', exampleWords: { hi: [{ devanagari: 'तन', romanized: 'tan', english: 'body' }, { devanagari: 'तरण', romanized: 'taran', english: 'crossing / swimming' }], en: [{ romanized: 'tan', english: 'body' }, { romanized: 'taran', english: 'crossing / swimming' }], kn: [{ romanized: 'tan', english: 'body' }, { romanized: 'taran', english: 'crossing / swimming' }], ta: [{ romanized: 'tan', english: 'body' }, { romanized: 'taran', english: 'crossing / swimming' }] } },
  { devanagari: 'थ', brahmi: '𑀣', romanized: 'tha', englishName: 'Tha (Dental)', exampleWords: { hi: [{ devanagari: 'थल', romanized: 'thal', english: 'land / ground' }, { devanagari: 'थाली', romanized: 'thali', english: 'plate / thali' }], en: [{ romanized: 'thal', english: 'land / ground' }, { romanized: 'thali', english: 'plate / thali' }], kn: [{ romanized: 'thal', english: 'land / ground' }, { romanized: 'thali', english: 'plate / thali' }], ta: [{ romanized: 'thal', english: 'land / ground' }, { romanized: 'thali', english: 'plate / thali' }] } },
  { devanagari: 'द', brahmi: '𑀤', romanized: 'da', englishName: 'Da (Dental)', exampleWords: { hi: [{ devanagari: 'दल', romanized: 'dal', english: 'lentils' }, { devanagari: 'दान', romanized: 'daan', english: 'donation / gift' }], en: [{ romanized: 'dal', english: 'lentils' }, { romanized: 'daan', english: 'donation / gift' }], kn: [{ romanized: 'dal', english: 'lentils' }, { romanized: 'daan', english: 'donation / gift' }], ta: [{ romanized: 'dal', english: 'lentils' }, { romanized: 'daan', english: 'donation / gift' }] } },
  { devanagari: 'ध', brahmi: '𑀥', romanized: 'dha', englishName: 'Dha (Dental)', exampleWords: { hi: [{ devanagari: 'धन', romanized: 'dhan', english: 'wealth / money' }, { devanagari: 'धरती', romanized: 'dharti', english: 'earth / land' }], en: [{ romanized: 'dhan', english: 'wealth / money' }, { romanized: 'dharti', english: 'earth / land' }], kn: [{ romanized: 'dhan', english: 'wealth / money' }, { romanized: 'dharti', english: 'earth / land' }], ta: [{ romanized: 'dhan', english: 'wealth / money' }, { romanized: 'dharti', english: 'earth / land' }] } },
  { devanagari: 'न', brahmi: '𑀦', romanized: 'na', englishName: 'Na (Dental)', exampleWords: { hi: [{ devanagari: 'नल', romanized: 'nal', english: 'tap / pipe' }, { devanagari: 'नाम', romanized: 'naam', english: 'name' }], en: [{ romanized: 'nal', english: 'tap / pipe' }, { romanized: 'naam', english: 'name' }], kn: [{ romanized: 'nal', english: 'tap / pipe' }, { romanized: 'naam', english: 'name' }], ta: [{ romanized: 'nal', english: 'tap / pipe' }, { romanized: 'naam', english: 'name' }] } },

  // P-varga (Labial)
  { devanagari: 'प', brahmi: '𑀧', romanized: 'pa', englishName: 'Pa', exampleWords: { hi: [{ devanagari: 'पल', romanized: 'pal', english: 'moment / instant' }, { devanagari: 'पानी', romanized: 'paani', english: 'water' }], en: [{ romanized: 'pal', english: 'moment / instant' }, { romanized: 'paani', english: 'water' }], kn: [{ romanized: 'pal', english: 'moment / instant' }, { romanized: 'paani', english: 'water' }], ta: [{ romanized: 'pal', english: 'moment / instant' }, { romanized: 'paani', english: 'water' }] } },
  { devanagari: 'फ', brahmi: '𑀨', romanized: 'pha', englishName: 'Pha', exampleWords: { hi: [{ devanagari: 'फल', romanized: 'phal', english: 'fruit' }, { devanagari: 'फूल', romanized: 'phool', english: 'flower' }], en: [{ romanized: 'phal', english: 'fruit' }, { romanized: 'phool', english: 'flower' }], kn: [{ romanized: 'phal', english: 'fruit' }, { romanized: 'phool', english: 'flower' }], ta: [{ romanized: 'phal', english: 'fruit' }, { romanized: 'phool', english: 'flower' }] } },
  { devanagari: 'ब', brahmi: '𑀩', romanized: 'ba', englishName: 'Ba', exampleWords: { hi: [{ devanagari: 'बल', romanized: 'bal', english: 'strength / power' }, { devanagari: 'बादल', romanized: 'baadal', english: 'cloud' }], en: [{ romanized: 'bal', english: 'strength / power' }, { romanized: 'baadal', english: 'cloud' }], kn: [{ romanized: 'bal', english: 'strength / power' }, { romanized: 'baadal', english: 'cloud' }], ta: [{ romanized: 'bal', english: 'strength / power' }, { romanized: 'baadal', english: 'cloud' }] } },
  { devanagari: 'भ', brahmi: '𑀪', romanized: 'bha', englishName: 'Bha', exampleWords: { hi: [{ devanagari: 'भवन', romanized: 'bhavan', english: 'building' }, { devanagari: 'भाषा', romanized: 'bhasha', english: 'language' }], en: [{ romanized: 'bhavan', english: 'building' }, { romanized: 'bhasha', english: 'language' }], kn: [{ romanized: 'bhavan', english: 'building' }, { romanized: 'bhasha', english: 'language' }], ta: [{ romanized: 'bhavan', english: 'building' }, { romanized: 'bhasha', english: 'language' }] } },
  { devanagari: 'म', brahmi: '𑀫', romanized: 'ma', englishName: 'Ma', exampleWords: { hi: [{ devanagari: 'मन', romanized: 'man', english: 'mind' }, { devanagari: 'माता', romanized: 'maata', english: 'mother' }], en: [{ romanized: 'man', english: 'mind' }, { romanized: 'maata', english: 'mother' }], kn: [{ romanized: 'man', english: 'mind' }, { romanized: 'maata', english: 'mother' }], ta: [{ romanized: 'man', english: 'mind' }, { romanized: 'maata', english: 'mother' }] } },

  // Antastha (Semi-vowels)
  { devanagari: 'य', brahmi: '𑀬', romanized: 'ya', englishName: 'Ya', exampleWords: { hi: [{ devanagari: 'यज्ञ', romanized: 'yagna', english: 'sacred fire ritual' }, { devanagari: 'यात्रा', romanized: 'yatra', english: 'journey / pilgrimage' }], en: [{ romanized: 'yagna', english: 'sacred fire ritual' }, { romanized: 'yatra', english: 'journey / pilgrimage' }], kn: [{ romanized: 'yagna', english: 'sacred fire ritual' }, { romanized: 'yatra', english: 'journey / pilgrimage' }], ta: [{ romanized: 'yagna', english: 'sacred fire ritual' }, { romanized: 'yatra', english: 'journey / pilgrimage' }] } },
  { devanagari: 'र', brahmi: '𑀭', romanized: 'ra', englishName: 'Ra', exampleWords: { hi: [{ devanagari: 'रस', romanized: 'ras', english: 'juice / essence' }, { devanagari: 'राज', romanized: 'raaj', english: 'kingdom / rule' }], en: [{ romanized: 'ras', english: 'juice / essence' }, { romanized: 'raaj', english: 'kingdom / rule' }], kn: [{ romanized: 'ras', english: 'juice / essence' }, { romanized: 'raaj', english: 'kingdom / rule' }], ta: [{ romanized: 'ras', english: 'juice / essence' }, { romanized: 'raaj', english: 'kingdom / rule' }] } },
  { devanagari: 'ल', brahmi: '𑀮', romanized: 'la', englishName: 'La', exampleWords: { hi: [{ devanagari: 'लता', romanized: 'lata', english: 'vine / creeper' }, { devanagari: 'लहर', romanized: 'lahar', english: 'wave' }], en: [{ romanized: 'lata', english: 'vine / creeper' }, { romanized: 'lahar', english: 'wave' }], kn: [{ romanized: 'lata', english: 'vine / creeper' }, { romanized: 'lahar', english: 'wave' }], ta: [{ romanized: 'lata', english: 'vine / creeper' }, { romanized: 'lahar', english: 'wave' }] } },
  { devanagari: 'व', brahmi: '𑀯', romanized: 'va', englishName: 'Va', exampleWords: { hi: [{ devanagari: 'वन', romanized: 'van', english: 'forest' }, { devanagari: 'वायु', romanized: 'vayu', english: 'wind / air' }], en: [{ romanized: 'van', english: 'forest' }, { romanized: 'vayu', english: 'wind / air' }], kn: [{ romanized: 'van', english: 'forest' }, { romanized: 'vayu', english: 'wind / air' }], ta: [{ romanized: 'van', english: 'forest' }, { romanized: 'vayu', english: 'wind / air' }] } },

  // Ushma (Sibilants / Aspirate)
  { devanagari: 'श', brahmi: '𑀰', romanized: 'sha', englishName: 'Sha (Palatal)', exampleWords: { hi: [{ devanagari: 'शक्ति', romanized: 'shakti', english: 'power / strength' }, { devanagari: 'शब्द', romanized: 'shabd', english: 'word' }], en: [{ romanized: 'shakti', english: 'power / strength' }, { romanized: 'shabd', english: 'word' }], kn: [{ romanized: 'shakti', english: 'power / strength' }, { romanized: 'shabd', english: 'word' }], ta: [{ romanized: 'shakti', english: 'power / strength' }, { romanized: 'shabd', english: 'word' }] } },
  { devanagari: 'ष', brahmi: '𑀱', romanized: 'ssa', englishName: 'Sha (Retroflex)', exampleWords: { hi: [{ devanagari: 'षट्', romanized: 'shat', english: 'six' }], en: [{ romanized: 'shat', english: 'six' }], kn: [{ romanized: 'shat', english: 'six' }], ta: [{ romanized: 'shat', english: 'six' }] } },
  { devanagari: 'स', brahmi: '𑀲', romanized: 'sa', englishName: 'Sa (Dental)', exampleWords: { hi: [{ devanagari: 'सत्य', romanized: 'satya', english: 'truth' }, { devanagari: 'सरल', romanized: 'saral', english: 'simple / easy' }], en: [{ romanized: 'satya', english: 'truth' }, { romanized: 'saral', english: 'simple / easy' }], kn: [{ romanized: 'satya', english: 'truth' }, { romanized: 'saral', english: 'simple / easy' }], ta: [{ romanized: 'satya', english: 'truth' }, { romanized: 'saral', english: 'simple / easy' }] } },
  { devanagari: 'ह', brahmi: '𑀳', romanized: 'ha', englishName: 'Ha', exampleWords: { hi: [{ devanagari: 'हस्त', romanized: 'hasta', english: 'hand' }, { devanagari: 'हरि', romanized: 'hari', english: 'Lord Vishnu / God' }], en: [{ romanized: 'hasta', english: 'hand' }, { romanized: 'hari', english: 'Lord Vishnu / God' }], kn: [{ romanized: 'hasta', english: 'hand' }, { romanized: 'hari', english: 'Lord Vishnu / God' }], ta: [{ romanized: 'hasta', english: 'hand' }, { romanized: 'hari', english: 'Lord Vishnu / God' }] } }
];

const MATRAS = [
  { vowel: 'अ', sign: null, suffix: '' },
  { vowel: 'आ', sign: '𑀸', suffix: 'ा' },
  { vowel: 'इ', sign: '𑀺', suffix: 'ि', prefixDev: true },
  { vowel: 'ई', sign: '𑀻', suffix: 'ी' },
  { vowel: 'उ', sign: '𑀼', suffix: 'ु' },
  { vowel: 'ऊ', sign: '𑀽', suffix: 'ू' },
  { vowel: 'ए', sign: '𑁂', suffix: 'े' },
  { vowel: 'ऐ', sign: '𑁃', suffix: 'ै' },
  { vowel: 'ओ', sign: '𑁄', suffix: 'ो' },
  { vowel: 'औ', sign: '𑁅', suffix: 'ौ' },
  { vowel: 'अं', sign: '𑀁', suffix: 'ं' },
  { vowel: 'अः', sign: '𑀂', suffix: 'ः' }
];

function generateSlidesForConsonant(item, lang) {
  const c = item.devanagari;
  const b = item.brahmi;
  const rom = item.romanized;
  const engName = item.englishName;
  const label = (lang === 'hi') ? c : ((lang === 'kn') ? c : rom);

  const words = item.exampleWords[lang] || item.exampleWords['hi'];
  const exWordStrings = words.map(w => w.devanagari || w.romanized);
  const speechSeq = [label, ...exWordStrings];

  const forms = MATRAS.map(m => {
    let combDev = c;
    if (m.prefixDev) {
      combDev = m.suffix + c;
    } else if (m.suffix) {
      combDev = c + m.suffix;
    }
    const combBrahmi = m.sign ? (b + m.sign) : b;
    return {
      vowel: m.vowel,
      matraSign: m.sign,
      combinedDevanagari: combDev,
      combinedBrahmi: combBrahmi,
      ...(m.sign === null ? { note: (lang === 'hi' ? 'मात्रा चिह्न कुछ नहीं' : 'No matra sign') } : {})
    };
  });

  const drillAudio = forms.map(f => f.combinedDevanagari).join(' – ');
  const drillSeq = forms.map(f => f.combinedDevanagari);

  const recMcqExamples = [
    { prompt: forms[1].combinedDevanagari, answer: forms[1].combinedBrahmi, speechSequence: [forms[1].combinedDevanagari] },
    { prompt: forms[4].combinedDevanagari, answer: forms[4].combinedBrahmi, speechSequence: [forms[4].combinedDevanagari] },
    { prompt: forms[10].combinedDevanagari, answer: forms[10].combinedBrahmi, speechSequence: [forms[10].combinedDevanagari] }
  ];

  const revMcqExamples = [
    { prompt: forms[7].combinedBrahmi, answer: forms[7].combinedDevanagari, speechSequence: [forms[7].combinedDevanagari] },
    { prompt: forms[3].combinedBrahmi, answer: forms[3].combinedDevanagari, speechSequence: [forms[3].combinedDevanagari] },
    { prompt: forms[9].combinedBrahmi, answer: forms[9].combinedDevanagari, speechSequence: [forms[9].combinedDevanagari] }
  ];

  const fillBlankQuestions = [
    { prompt: b + ' ___ = ' + forms[2].combinedDevanagari, answer: MATRAS[2].sign },
    { prompt: b + ' ___ = ' + forms[9].combinedDevanagari, answer: MATRAS[9].sign },
    { prompt: b + ' ___ = ' + forms[6].combinedDevanagari, answer: MATRAS[6].sign },
    { prompt: b + ' ___ = ' + forms[11].combinedDevanagari, answer: MATRAS[11].sign },
    { prompt: b + ' ___ = ' + forms[10].combinedDevanagari, answer: MATRAS[10].sign }
  ];

  if (lang === 'hi') {
    return [
      { type: 'bonus_title', content: `बोनस: व्यंजन परिचय – "${c}" (${b})`, subtitle: `स्वागतम्! आपने "${c}" व्यंजन चुना है!`, note: 'आज हम सीखेंगे – इसका रूप, उच्चारण और मात्राओं के साथ योग पढ़ना और लिखना', consonant: c, consonantBrahmi: b, page: 205 },
      { type: 'form_pronunciation', content: `ब्राह्मी लिपि में "${c}" का रूप: ${b} है। उच्चारण: ${c} (जैसे – ${exWordStrings.join(', ')})`, drill: `कोशिश कर – जोर से बोलें: ${c}… ${c}… ${c}`, consonant: c, consonantBrahmi: b, page: 206, speechSequence: speechSeq },
      { type: 'bina_matra', title: 'बिना मात्रा', content: `जब "${c}" अकेला होता है → ${b} (ध्वनि: ${c})। बिना मात्रा = सिर्फ व्यंजन ध्वनि + 'अ' स्वर स्वतः जुड़ा रहता है।`, consonant: c, consonantBrahmi: b, page: 207, speechSequence: [c] },
      { type: 'matra_combinations', title: `मात्राओं के साथ "${c}"`, forms: forms, consonant: c, consonantBrahmi: b, sourcePages: [208, 210] },
      { type: 'pronunciation_drill', title: 'उच्चारण अभ्यास', content: `ऑडियो सुनें और दोहराएं: ${drillAudio}`, consonant: c, consonantBrahmi: b, page: 211, speechSequence: drillSeq },
      { type: 'recognition_mcq', title: 'पहचान अभ्यास (देवनागरी → ब्राह्मी)', note: 'PDF worked examples', examples: recMcqExamples, consonant: c, consonantBrahmi: b, page: 212 },
      { type: 'reverse_mcq', title: 'उल्टा अभ्यास (ब्राह्मी → देवनागरी)', note: 'PDF worked examples', examples: revMcqExamples, consonant: c, consonantBrahmi: b, page: 213 },
      { type: 'matching_game', title: 'मिलानी गेम', columnA: [forms[1].combinedBrahmi, forms[4].combinedBrahmi, forms[8].combinedBrahmi, forms[10].combinedBrahmi], columnB: [forms[1].combinedDevanagari, forms[4].combinedDevanagari, forms[8].combinedDevanagari, forms[10].combinedDevanagari], note: 'सही जोड़ मिलाएं', consonant: c, consonantBrahmi: b, page: 214 },
      { type: 'fill_blank', title: 'रिक्त स्थान भरें', questions: fillBlankQuestions, consonant: c, consonantBrahmi: b, page: 215 },
      { type: 'trace_practice', title: 'ट्रेसिंग अभ्यास', content: `अपनी उंगली/पेन से ${b} और उसकी सभी मात्राओं वाले रूप ट्रेस करें।`, consonant: c, consonantBrahmi: b, page: 216 },
      { type: 'trace_loop_reference', content: `(यहां "${c}" की तरह ही मात्रा ट्रेसिंग लूप)`, note: 'Dedicated trace reference page', consonant: c, consonantBrahmi: b, page: 217 },
      { type: 'summary', title: 'समापन', content: `शानदार! आपने "${c}" व्यंजन का रूप, उच्चारण, और मात्राओं के साथ योग सीख लिया।`, bonusUnlock: 'जिन एक्सप्लोरर', consonant: c, consonantBrahmi: b, page: 218 }
    ];
  } else {
    return [
      { type: 'bonus_title', content: `Bonus: Consonant Introduction – "${engName.toUpperCase()}" (${b})`, subtitle: `Welcome! You have chosen the "${engName}" consonant!`, note: 'Today we will learn – its form, pronunciation and reading/writing with matras', consonant: label, consonantBrahmi: b, page: 205 },
      { type: 'form_pronunciation', content: `In Brahmi script, the form of "${engName.toUpperCase()}" is: ${b}. Pronunciation: ${rom} (e.g. – ${exWordStrings.join(', ')})`, drill: `Try it – speak loudly: ${rom}… ${rom}… ${rom}`, consonant: label, consonantBrahmi: b, page: 206, speechSequence: speechSeq },
      { type: 'bina_matra', title: 'Without Matra', content: `When "${rom}" is alone → ${b} (sound: ${rom}). Without matra = only consonant sound + 'a' vowel is inherently attached.`, consonant: label, consonantBrahmi: b, page: 207, speechSequence: [label] },
      { type: 'matra_combinations', title: `"${engName}" with Matras`, forms: forms, consonant: label, consonantBrahmi: b, sourcePages: [208, 210] },
      { type: 'pronunciation_drill', title: 'Pronunciation Drill', content: `Listen to audio and repeat: ${drillAudio}`, consonant: label, consonantBrahmi: b, page: 211, speechSequence: drillSeq },
      { type: 'recognition_mcq', title: 'Recognition Practice', note: 'PDF worked examples', examples: recMcqExamples, consonant: label, consonantBrahmi: b, page: 212 },
      { type: 'reverse_mcq', title: 'Reverse Practice', note: 'PDF worked examples', examples: revMcqExamples, consonant: label, consonantBrahmi: b, page: 213 },
      { type: 'matching_game', title: 'Matching Game', columnA: [forms[1].combinedBrahmi, forms[4].combinedBrahmi, forms[8].combinedBrahmi, forms[10].combinedBrahmi], columnB: [forms[1].combinedDevanagari, forms[4].combinedDevanagari, forms[8].combinedDevanagari, forms[10].combinedDevanagari], note: 'Match correct pairs', consonant: label, consonantBrahmi: b, page: 214 },
      { type: 'fill_blank', title: 'Fill in the Blanks', questions: fillBlankQuestions, consonant: label, consonantBrahmi: b, page: 215 },
      { type: 'trace_practice', title: 'Tracing Practice', content: `Trace ${b} and its matra forms with your finger or pen.`, consonant: label, consonantBrahmi: b, page: 216 },
      { type: 'trace_loop_reference', content: `(Matra tracing loop for "${label}")`, note: 'Dedicated trace reference page', consonant: label, consonantBrahmi: b, page: 217 },
      { type: 'summary', title: 'Summary', content: `Awesome! You have learned the form, pronunciation, and matras for "${label}".`, bonusUnlock: 'Explorer Badge', consonant: label, consonantBrahmi: b, page: 218 }
    ];
  }
}

LANGS.forEach(lang => {
  const filePath = path.join(__dirname, '..', 'content', lang, 'course.json');
  const courseData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const existingConsonants = new Set(
    courseData.vyanjan.filter(x => x.consonant).map(x => x.consonant)
  );

  let addedCount = 0;
  CONSONANTS.forEach(c => {
    const label = (lang === 'hi' || lang === 'kn') ? c.devanagari : c.romanized;
    if (!existingConsonants.has(label) && !existingConsonants.has(c.devanagari)) {
      const slides = generateSlidesForConsonant(c, lang);
      courseData.vyanjan.push(...slides);
      addedCount++;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(courseData, null, 2), 'utf8');
  console.log(`[${lang}] Added ${addedCount} consonant lessons (${addedCount * 12} slides). Total vyanjan array length: ${courseData.vyanjan.length}`);
});

console.log('\nAll 4 course.json files populated successfully.');
