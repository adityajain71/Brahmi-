const fs = require('fs');
const path = require('path');

const HINDI_DIR = path.join(__dirname, '../backend/data/hindi');
const ENGLISH_DIR = path.join(__dirname, '../backend/data/english');
const KANNADA_DIR = path.join(__dirname, '../backend/data/kannada');
const TAMIL_DIR = path.join(__dirname, '../backend/data/tamil');

[ENGLISH_DIR, KANNADA_DIR, TAMIL_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Ground truth from prompt
const CONSONANTS_GROUND_TRUTH = [
  ['क', '𑀓', 'ka', 'ಕ', 'க', true], ['ख', '𑀔', 'kha', 'ಖ', 'க', false], ['ग', '𑀕', 'ga', 'ಗ', 'க', false], ['घ', '𑀖', 'gha', 'ಘ', 'க', false], ['ङ', '𑀗', 'ṅa', 'ಙ', 'ங', true],
  ['च', '𑀘', 'ca', 'ಚ', 'ச', true], ['छ', '𑀙', 'cha', 'ಛ', 'ச', false], ['ज', '𑀚', 'ja', 'ಜ', 'ஜ', true], ['झ', '𑀛', 'jha', 'ಝ', 'ஜ', false], ['ञ', '𑀜', 'ña', 'ಞ', 'ஞ', true],
  ['ट', '𑀝', 'ṭa', 'ಟ', 'ட', true], ['ठ', '𑀞', 'ṭha', 'ಠ', 'ட', false], ['ड', '𑀟', 'ḍa', 'ಡ', 'ட', false], ['ढ', '𑀠', 'ḍha', 'ಢ', 'ட', false], ['ण', '𑀡', 'ṇa', 'ಣ', 'ண', true],
  ['त', '𑀢', 'ta', 'ತ', 'த', true], ['थ', '𑀣', 'tha', 'ಥ', 'த', false], ['द', '𑀤', 'da', 'ದ', 'த', false], ['ध', '𑀥', 'dha', 'ಧ', 'த', false], ['न', '𑀦', 'na', 'ನ', 'ந', true],
  ['प', '𑀧', 'pa', 'ಪ', 'ப', true], ['फ', '𑀨', 'pha', 'ಫ', 'ப', false], ['ब', '𑀩', 'ba', 'ಬ', 'ப', false], ['भ', '𑀪', 'bha', 'ಭ', 'ப', false], ['म', '𑀫', 'ma', 'ಮ', 'ம', true],
  ['य', '𑀬', 'ya', 'ಯ', 'ய', true], ['र', '𑀭', 'ra', 'ರ', 'ர', true], ['ल', '𑀮', 'la', 'ಲ', 'ல', true], ['व', '𑀯', 'va', 'ವ', 'வ', true],
  ['श', '𑀰', 'śa', 'ಶ', 'ஶ', true], ['ष', '𑀱', 'ṣa', 'ಷ', 'ஷ', true], ['स', '𑀲', 'sa', 'ಸ', 'ஸ', true], ['ह', '𑀳', 'ha', 'ಹ', 'ஹ', true]
];

const VOWELS_GROUND_TRUTH = [
  ['अ', '𑀅', 'a', 'ಅ', 'அ'], ['आ', '𑀆', 'ā', 'ಆ', 'ஆ'], ['इ', '𑀇', 'i', 'ಇ', 'இ'], ['ई', '𑀈', 'ī', 'ಈ', 'ஈ'],
  ['उ', '𑀉', 'u', 'ಉ', 'உ'], ['ऊ', '𑀊', 'ū', 'ಊ', 'ஊ'], ['ए', '𑀏', 'e', 'ಏ', 'ஏ'], ['ऐ', '𑀐', 'ai', 'ಐ', 'ஐ'],
  ['ओ', '𑀑', 'o', 'ಓ', 'ஓ'], ['औ', '𑀒', 'au', 'ಔ', 'ஔ'], ['अं', '𑀅𑀁', 'aṃ', 'ಅಂ', 'அம்'], ['अः', '𑀅𑀂', 'aḥ', 'ಅಃ', 'அஃ']
];

const MATRAS_GROUND_TRUTH = {
    'आ': ['𑀸', 'ा', 'ā', 'ಾ', 'ா'], 'इ': ['𑀺', 'ि', 'i', 'ಿ', 'ி'], 'ई': ['𑀻', 'ी', 'ī', 'ೀ', 'ீ'],
    'उ': ['𑀼', 'ु', 'u', 'ು', 'ு'], 'ऊ': ['𑀽', 'ू', 'ū', 'ೂ', 'ூ'], 'ए': ['𑁂', 'े', 'e', 'ೇ', 'ே'],
    'ऐ': ['𑁃', 'ै', 'ai', 'ೈ', 'ை'], 'ओ': ['𑁄', 'ो', 'o', 'ೋ', 'ோ'], 'औ': ['𑁅', 'ौ', 'au', 'ೌ', 'ௌ'],
    'अं': ['𑀁', 'ं', 'ṃ', 'ಂ', 'ம்'], 'अः': ['𑀂', 'ः', 'ḥ', 'ಃ', 'ஃ'] 
};

const DEV_TO_KANNADA = {
  'अ': 'ಅ', 'आ': 'ಆ', 'इ': 'ಇ', 'ई': 'ಈ', 'उ': 'ಉ', 'ऊ': 'ಊ', 'ए': 'ಏ', 'ऐ': 'ಐ', 'ओ': 'ಓ', 'औ': 'ಔ',
  'ा': 'ಾ', 'ि': 'ಿ', 'ी': 'ೀ', 'ु': 'ು', 'ू': 'ೂ', 'े': 'ೇ', 'ै': 'ೈ', 'ो': 'ೋ', 'ौ': 'ೌ',
  'ं': 'ಂ', 'ः': 'ಃ', 'ँ': 'ಂ', '़': '', '्': '್',
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ', 'च': 'ಚ', 'छ': 'ಛ', 'ज': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ड': 'ಡ', 'ढ': 'ಢ', 'ण': 'ಣ', 'त': 'ತ', 'थ': 'ಥ', 'द': 'ದ', 'ध': 'ಧ', 'न': 'ನ',
  'प': 'ಪ', 'फ': 'ಫ', 'ब': 'ಬ', 'भ': 'ಭ', 'म': 'ಮ', 'य': 'ಯ', 'र': 'ರ', 'ल': 'ಲ', 'व': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'स': 'ಸ', 'ह': 'ಹ', 'ळ': 'ಳ', 'क्ष': 'ಕ್ಷ', 'ज्ञ': 'ಜ್ಞ', '।': '।'
};

const DEV_TO_TAMIL = {
  'अ': 'அ', 'आ': 'ஆ', 'इ': 'இ', 'ई': 'ஈ', 'उ': 'உ', 'ऊ': 'ஊ', 'ए': 'ஏ', 'ऐ': 'ஐ', 'ओ': 'ஓ', 'औ': 'ஔ',
  'ा': 'ா', 'ि': 'ி', 'ी': 'ீ', 'ु': 'ு', 'ू': 'ூ', 'े': 'ே', 'ै': 'ை', 'ो': 'ோ', 'ौ': 'ௌ',
  'ं': 'ம்', 'ः': 'ஃ', 'ँ': 'ம்', '़': '', '्': '்',
  'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச்ஹ', 'ज': 'ஜ', 'झ': 'ஜ்ஹ', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட்ஹ', 'ड': 'ட', 'ढ': 'ட்ஹ', 'ण': 'ண',
  'त': 'த', 'थ': 'த்ஹ', 'द': 'த', 'ध': 'த்ஹ', 'न': 'ந',
  'प': 'ப', 'फ': 'ப்ஹ', 'ब': 'ப', 'भ': 'ப்ஹ', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஶ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ', '।': '।'
};

// Extremely simple IAST transliteration for random hindi strings
const DEV_TO_IAST = {
  'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': 'ṃ', 'ः': 'ḥ', 'ँ': 'ṃ', '़': '', '्': '',
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa', 'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
  'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa', 'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma', 'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha', 'ळ': 'ḷa', 'क्ष': 'kṣa', 'ज्ञ': 'jña'
};

function transliterate(str, map) {
    if (typeof str !== 'string') return str;
    let out = '';
    for (let c of str) {
        out += map[c] !== undefined ? map[c] : c;
    }
    return out;
}

function processFile(filename) {
    const hindiPath = path.join(HINDI_DIR, filename);
    if (!fs.existsSync(hindiPath)) return;
    const hindiData = JSON.parse(fs.readFileSync(hindiPath, 'utf8'));

    const variants = {
        english: { key: 'iast', data: JSON.parse(JSON.stringify(hindiData)), map: DEV_TO_IAST },
        kannada: { key: 'kannada', data: JSON.parse(JSON.stringify(hindiData)), map: DEV_TO_KANNADA },
        tamil: { key: 'tamil', data: JSON.parse(JSON.stringify(hindiData)), map: DEV_TO_TAMIL }
    };

    function traverseAndReplace(obj, lang, newKey, map) {
        if (Array.isArray(obj)) {
            obj.forEach(item => traverseAndReplace(item, lang, newKey, map));
        } else if (obj !== null && typeof obj === 'object') {
            
            // Tamil exact logic
            if (obj.devanagari && obj.unicode_codepoint && filename === 'vyanjan.json') {
                const dev = obj.devanagari;
                const match = CONSONANTS_GROUND_TRUTH.find(c => c[0] === dev);
                if (match && lang === 'tamil') {
                    obj.tamilExact = match[5];
                    if (!obj.tamilExact) {
                        obj.note = "Tamil script does not distinguish this sound from க; shown for reference, pronunciation follows the IAST/Brahmi form.";
                        if (['ख','ग','घ'].includes(dev)) obj.note = "Tamil script does not distinguish this sound from க; shown for reference, pronunciation follows the IAST/Brahmi form.";
                        if (['छ','झ'].includes(dev)) obj.note = "Tamil script does not distinguish this sound from ச; shown for reference, pronunciation follows the IAST/Brahmi form.";
                        if (['ठ','ड','ढ'].includes(dev)) obj.note = "Tamil script does not distinguish this sound from ட; shown for reference, pronunciation follows the IAST/Brahmi form.";
                        if (['थ','द','ध'].includes(dev)) obj.note = "Tamil script does not distinguish this sound from த; shown for reference, pronunciation follows the IAST/Brahmi form.";
                        if (['फ','ब','भ'].includes(dev)) obj.note = "Tamil script does not distinguish this sound from ப; shown for reference, pronunciation follows the IAST/Brahmi form.";
                    }
                }
            }

            // Object.keys iteration
            for (let k of Object.keys(obj)) {
                let v = obj[k];
                
                // key rename devanagari -> langKey
                let actK = k;
                if (k === 'devanagari') {
                    actK = newKey;
                    obj[newKey] = v;
                    delete obj.devanagari;
                } else if (k === 'combinedDevanagari') {
                    actK = 'combined' + newKey.charAt(0).toUpperCase() + newKey.slice(1);
                    obj[actK] = v;
                    delete obj.combinedDevanagari;
                }

                // Value translation for strings that contain devanagari
                if (typeof obj[actK] === 'string' && /[\u0900-\u097F]/.test(obj[actK]) && actK !== 'brahmi') {
                    let dev = obj[actK];
                    let replacement = dev;

                    // Exact matches first
                    const cMatch = CONSONANTS_GROUND_TRUTH.find(c => c[0] === dev);
                    const vMatch = VOWELS_GROUND_TRUTH.find(v => v[0] === dev);
                    
                    if (cMatch) {
                        replacement = lang === 'english' ? cMatch[2] : (lang === 'kannada' ? cMatch[3] : cMatch[4]);
                    } else if (vMatch) {
                        replacement = lang === 'english' ? vMatch[2] : (lang === 'kannada' ? vMatch[3] : vMatch[4]);
                    } else if (MATRAS_GROUND_TRUTH[dev]) {
                        replacement = lang === 'english' ? MATRAS_GROUND_TRUTH[dev][2] : (lang === 'kannada' ? MATRAS_GROUND_TRUTH[dev][3] : MATRAS_GROUND_TRUTH[dev][4]);
                    } else {
                        replacement = transliterate(dev, map);
                    }
                    
                    obj[actK] = replacement;
                }
                
                if (typeof obj[actK] === 'object') {
                    traverseAndReplace(obj[actK], lang, newKey, map);
                }
            }
        }
    }

    Object.keys(variants).forEach(lang => {
        traverseAndReplace(variants[lang].data, lang, variants[lang].key, variants[lang].map);
        const outPath = path.join(__dirname, '../backend/data', lang, filename);
        fs.writeFileSync(outPath, JSON.stringify(variants[lang].data, null, 2));
    });
}

['vyanjan.json', 'matras.json', 'swar.json'].forEach(processFile);
console.log('Language files generated successfully.');
