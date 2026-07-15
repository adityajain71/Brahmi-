const fs = require('fs');
const path = require('path');

const titleMap = {
    hindi: {
      moduleTitle: 'स्वर',
      practicePrompt: 'क्या अब आप मेरे साथ अभ्यास करना चाहेंगे?',
      yes: 'हां',
      no: 'नहीं',
      gameTitle: 'गेम टाइम',
      direction1: 'देवनागरी → ब्राह्मी',
      direction2: 'ब्राह्मी → देवनागरी',
      reverseIntro: 'चलिए अब हम उल्टा गेम खेलते हैं।',
      writingIntro: 'आइए! अब लिखने का अभ्यास करते हैं।',
      writingCheck: 'क्या आप मुझे लिखने के लिए उत्साहित हैं?',
      feedback: 'आप मुझे फीडबैक दे सकते हैं और हाँ, मुझे निष्पक्ष फीडबैक ही दीजिएगा।',
      trueFalseLabel: 'सही / गलत',
      trueFalseQuestion: '"ब्राह्मी एक भाषा है?"',
      stage4Header: 'स्वर अभ्यास – देवनागरी → ब्राह्मी / सत्य/असत्य चुनिए',
      stage4Share: 'अपनी जीत को साझा करें/डाउनलोड करें',
      chooseQuestion: 'अब आपके ऊपर है, क्या सीखना चाहते हैं?',
      optionA: 'मात्रा चिह्न',
      optionB: 'व्यञ्जन',
      reward5Title: '"श्रेष्ठ ज्ञानी"',
      reward5Label: 'सन्देश :'
    },
    english: {
      moduleTitle: 'Vowels',
      practicePrompt: 'Would you now like to practice with me?',
      yes: 'Yes',
      no: 'No',
      gameTitle: 'Game Time',
      direction1: 'Roman/Latin → Brahmi',
      direction2: 'Brahmi → roman/latin',
      reverseIntro: 'Now let us play the reverse game.',
      writingIntro: 'Come! Now let us practice writing.',
      writingCheck: 'Are you excited to write me?',
      feedback: 'You can give me feedback, and yes, please give me honest and unbiased feedback.',
      trueFalseLabel: 'True / False',
      trueFalseQuestion: '"Is Brahmi a language?"',
      stage4Header: 'Vowel Practice – roman/latin → Brahmi / Choose True/False',
      stage4Share: 'Share/Download your achievement',
      chooseQuestion: 'Now it is up to you, what do you want to learn?',
      optionA: 'Vowel Signs (Matra)',
      optionB: 'Consonants',
      reward5Title: '"Excellent Scholar"',
      reward5Label: 'Message:'
    },
    kannada: {
      moduleTitle: 'ಸ್ವರಗಳು',
      practicePrompt: 'ಈಗ ನೀವು ನನ್ನೊಂದಿಗೆ ಅಭ್ಯಾಸ ಮಾಡಲು ಇಚ್ಛಿಸುತ್ತೀರಾ?',
      yes: 'ಹೌದು',
      no: 'ಇಲ್ಲ',
      gameTitle: 'ಆಟದ ಸಮಯ',
      direction1: 'ಕನ್ನಡ → ಬ್ರಾಹ್ಮೀ',
      direction2: 'ಬ್ರಾಹ್ಮೀ → ಕನ್ನಡ',
      reverseIntro: 'ಈಗ ನಾವು ವಿರುದ್ಧ ಆಟವನ್ನು ಆಡೋಣ.',
      writingIntro: 'ಬನ್ನಿ! ಈಗ ಬರೆಯುವ ಅಭ್ಯಾಸ ಮಾಡೋಣ.',
      writingCheck: 'ನನ್ನನ್ನು ಬರೆಯಲು ನೀವು ಉತ್ಸುಕರಾಗಿದ್ದೀರಾ?',
      feedback: 'ನೀವು ನನಗೆ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಬಹುದು, ಹೌದು, ದಯವಿಟ್ಟು ನಿಷ್ಪಕ್ಷಪಾತ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನೇ ನೀಡಿ.',
      trueFalseLabel: 'ಸರಿ ತಪ್ಪು',
      trueFalseQuestion: '"ಬ್ರಾಹ್ಮೀ ಒಂದು ಭಾಷೆಯೇ?"',
      stage4Header: 'ಸ್ವರ ಅಭ್ಯಾಸ – ಕನ್ನಡ → ಬ್ರಾಹ್ಮೀ / ಸರಿ/ತಪ್ಪು ಆಯ್ಕೆಮಾಡಿ',
      stage4Share: 'ನಿಮ್ಮ ಸಾಧನೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ/ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      chooseQuestion: 'ಈಗ ನಿಮ್ಮ ಮೇಲೆ ಇದೆ, ನೀವು ಏನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?',
      optionA: 'ಮಾತ್ರಾ ಚಿಹ್ನೆಗಳು',
      optionB: 'ವ್ಯಂಜನಗಳು',
      reward5Title: '"ಶ್ರೇಷ್ಠ ಜ್ಞಾನಿ"',
      reward5Label: 'ಸಂದೇಶ:'
    },
    tamil: {
      moduleTitle: 'உயிரெழுத்துகள்',
      practicePrompt: 'இப்போது நீங்கள் என்னுடன் பயிற்சி செய்ய விரும்புகிறீர்களா?',
      yes: 'ஆம்',
      no: 'இல்லை',
      gameTitle: 'விளையாட்டு நேரம்',
      direction1: 'தமிழ் → பிராமி',
      direction2: 'பிராமி → தமிழ்',
      reverseIntro: 'இப்போது நாம் எதிர்மறை விளையாட்டை விளையாடுவோம்.',
      writingIntro: 'வாங்க! இப்போது எழுதும் பயிற்சி செய்வோம்.',
      writingCheck: 'என்னை எழுத நீங்கள் உற்சாகமாக இருக்கிறீர்களா?',
      feedback: 'நீங்கள் எனக்கு கருத்து தெரிவிக்கலாம்; ஆம், தயவுசெய்து நேர்மையான மற்றும் நியாயமான கருத்தைத் தருங்கள்.',
      trueFalseLabel: 'சரி / தவறு',
      trueFalseQuestion: '"பிராமி ஒரு மொழியா?"',
      stage4Header: 'உயிரெழுத்துப் பயிற்சி – தமிழ் → பிராமி / சரி/தவறு தேர்வு செய்யவும்',
      stage4Share: 'உங்கள் சாதனையைப் பகிரவும்/பதிவிறக்கவும்',
      chooseQuestion: 'இப்போது நீங்கள் என்ன கற்க விரும்புகிறீர்கள்?',
      optionA: 'மாத்ரா குறிகள்',
      optionB: 'மெய்யெழுத்துகள்',
      reward5Title: '"சிறந்த அறிஞர்"',
      reward5Label: 'செய்தி:'
    }
};

const nextButtonMap = {
    hindi: 'अगला',
    english: 'Next',
    kannada: 'ಮುಂದೆ',
    tamil: 'அடுத்து'
};

const LANGS = ['english', 'kannada', 'tamil'];

LANGS.forEach(lang => {
    const swarPath = path.join(__dirname, '../backend/data', lang, 'swar.json');
    if (fs.existsSync(swarPath)) {
        const swar = JSON.parse(fs.readFileSync(swarPath, 'utf8'));
        
        swar.module_title = titleMap[lang].moduleTitle;
        
        if (swar.section_3_practice_prompt) {
            swar.section_3_practice_prompt.prompt = titleMap[lang].practicePrompt;
            swar.section_3_practice_prompt.yes = titleMap[lang].yes;
            swar.section_3_practice_prompt.no = titleMap[lang].no;
        }
        
        if (swar.section_4_game_time) {
            swar.section_4_game_time.game_title = titleMap[lang].gameTitle;
            swar.section_4_game_time.direction_label = titleMap[lang].direction1;
            swar.section_4_game_time.next_button = nextButtonMap[lang];
        }
        
        // Let's also patch the Next buttons in group 1, 2, 3
        ['group_1', 'group_2', 'group_3'].forEach(g => {
            if (swar.section_2_vowel_display_cards?.[g]) {
                swar.section_2_vowel_display_cards[g].next_button = nextButtonMap[lang];
            }
        });

        // Patch other UI strings...
        // Actually, the Hindi json in section_6_quiz2... Wait, let's see what else is in swar.json.
        // We will just write it back for now.
        fs.writeFileSync(swarPath, JSON.stringify(swar, null, 2));
    }
});
console.log('UI strings patched.');
