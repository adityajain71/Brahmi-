const fs = require('fs');
const path = require('path');

const introPath = path.join(__dirname, '../lib/introModule.ts');
const vyanjanPath = path.join(__dirname, '../lib/vyanjanModule.ts');

let introContent = fs.readFileSync(introPath, 'utf8');
let vyanjanContent = fs.readFileSync(vyanjanPath, 'utf8');

// For introModule.ts
introContent = introContent.replace(/const getVowelDisplayLabel = \(vowel: any\) => \{[\s\S]*?return \(vowel\.romanized \|\| vowel\.title_english \|\| ''\)\.toUpperCase\(\)\n\s*\}/, 
`const getVowelDisplayLabel = (vowel: any) => {
    // Rely entirely on JSON properties since they are now script-specific
    return vowel.iast || vowel.tamil || vowel.kannada || vowel.devanagari || vowel.romanized || vowel.title || ''
  }`);

introContent = introContent.replace(/const getPracticeMatraExample = \(matra: any\) => \{[\s\S]*?return \`With matra: \$\{matra\.example_combination\}\`\n\s*\}\n\s*\}/, 
`const getPracticeMatraExample = (matra: any) => {
    const isInherentMatra = (matra?.order === 1) || !matra?.matraSign
    if (isInherentMatra) return matra.example_combination || 'Consonant only'
    return matra.example_combination || ''
  }`);

introContent = introContent.replace(/title: isHindi \? 'अभ्यास समय' : isKannada \? 'ಅಭ್ಯಾಸ ಸಮಯ' : 'Practice Time'/g, "title: practiceTime.title_hindi || practiceTime.title_english || practiceTime.title_kannada || 'Practice Time'");
introContent = introContent.replace(/title: isHindi \? 'गेम टाइम' : isKannada \? 'ಆಟದ ಸಮಯ' : 'Game Time'/g, "title: practiceTime.sections?.section_4_game_time?.game_title_hindi || practiceTime.sections?.section_4_game_time?.game_title_english || 'Game Time'");
introContent = introContent.replace(/title: isHindi \? 'क्विज़' : isKannada \? 'ಪ್ರಶ್ನೋತ್ತರ' : 'Quiz'/g, "title: practiceTime.sections?.section_5_quiz1_native_to_brahmi?.title_hindi || 'Quiz'");
introContent = introContent.replace(/title: isHindi \? 'पुरस्कार' : isKannada \? 'ಬಹುಮಾನ' : 'Reward'/g, "title: practiceTime.sections?.section_8_reward_1?.title_hindi || 'Reward'");

introContent = introContent.replace(/title: isHindi \? 'पहचान' : isKannada \? 'ಗುರುತು' : 'Identification',[\s\S]*?content: isHindi[\s\S]*?\`This is the vowel '\$\{vowelLabel\}'\.\`,/g,
`title: vowel.identification_title || 'Identification',
          content: vowel.identification_content || \`This is the vowel '\${vowelLabel}'.\`,`
);

introContent = introContent.replace(/title: isHindi \? 'उच्चारण' : isKannada \? 'ಉಚ್ಚಾರಣೆ' : isTamil \? 'உச்சारணம்' : 'Pronunciation',[\s\S]*?content: isHindi[\s\S]*?\`This vowel is pronounced as '\$\{vowelLabel\}'\.\`,/g,
`title: vowel.pronunciation_title || 'Pronunciation',
          content: vowel.pronunciation_content || \`This vowel is pronounced as '\${vowelLabel}'.\`,`
);

introContent = introContent.replace(/title: isHindi \? 'विवरण' : isKannada \? 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ' : isTamil \? 'கூடுதல் தகவல்' : 'More Info',/g, 
"title: vowel.more_info_title || 'More Info',");

introContent = introContent.replace(/const description = isHindi[\s\S]*?\(vowel\.description_english \|\| vowel\.description_hindi\);/g, 
"const description = vowel.description || vowel.description_hindi || vowel.description_english || '';");

introContent = introContent.replace(/title: isHindi \? 'उदाहरण' : isKannada \? 'ಉದಾಹರಣೆ' : isTamil \? 'உதாரணம்' : 'Example',/g, 
"title: vowel.example_title || 'Example',");

// For vyanjanModule.ts
vyanjanContent = vyanjanContent.replace(/const VYANJAN_ENGLISH_SUBTITLES: Record<string, string> = \{[\s\S]*?function isPlaceholderText\(value\?: string\): boolean \{[\s\S]*?return trimmed\.length === 0 \|\| \/^\?\+\$\/\.test\(trimmed\)\n\}/g, '');

vyanjanContent = vyanjanContent.replace(/if \(resolvedLanguage === 'hi'\) \{[\s\S]*?\} else if \(consonant\.romanized\) \{[\s\S]*?thumb = consonant\.romanized\n\s*\}\n\s*\}\n\s*\}/, 
`// Removed hardcoded resolution`);

fs.writeFileSync(introPath, introContent);
fs.writeFileSync(vyanjanPath, vyanjanContent);
