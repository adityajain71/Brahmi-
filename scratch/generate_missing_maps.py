import re
import json

missing_strings = []
with open('missing_strings.txt', 'r', encoding='utf-8') as f:
    missing_strings = [line.strip() for line in f if line.strip()]

# Dictionaries for transliteration
dev_to_en = {
    'अं': 'am', 'अः': 'ah', 'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga'
}
dev_to_kn = {
    'अं': 'ಅಂ', 'अः': 'ಅಃ', 'अ': 'ಅ', 'आ': 'ಆ', 'इ': 'ಇ', 'ई': 'ಈ', 'उ': 'ಉ', 'ऊ': 'ಊ', 'ए': 'ಏ', 'ऐ': 'ಐ', 'ओ': 'ಓ', 'औ': 'ಔ',
    'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ'
}
dev_to_ta = {
    'अं': 'அம்', 'अः': 'அஃ', 'अ': 'அ', 'आ': 'ஆ', 'इ': 'இ', 'ई': 'ஈ', 'उ': 'உ', 'ऊ': 'ஊ', 'ए': 'ஏ', 'ऐ': 'ஐ', 'ओ': 'ஓ', 'औ': 'ஔ',
    'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங'
}
matra_en = {'का':'kaa', 'कि':'ki', 'की':'kee', 'कु':'ku', 'कू':'koo', 'के':'ke', 'कै':'kai', 'को':'ko', 'कौ':'kau', 'कं':'kam', 'कः':'kah'}

def translate_str(text, lang):
    t = text
    
    mapping = dev_to_en if lang == 'en' else (dev_to_kn if lang == 'kn' else dev_to_ta)
    
    if text == '"अ" का चिह्न [𑀅] है?': return '"a" symbol is [𑀅]?' if lang == 'en' else f'"{mapping["अ"]}" ಚಿಹ್ನೆ [𑀅] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["अ"]}" குறியீடு [𑀅] ஆகுமா?'
    if text == '"अं" का चिह्न [𑀅𑀁] है?': return '"am" symbol is [𑀅𑀁]?' if lang == 'en' else f'"{mapping["अं"]}" ಚಿಹ್ನೆ [𑀅𑀁] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["अं"]}" குறியீடு [𑀅𑀁] ஆகுமா?'
    if text == '"अः" का चिह्न [𑀅𑀂] है?': return '"ah" symbol is [𑀅𑀂]?' if lang == 'en' else f'"{mapping["अः"]}" ಚಿಹ್ನೆ [𑀅𑀂] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["अः"]}" குறியீடு [𑀅𑀂] ஆகுமா?'
    if text == '"आ" का चिह्न [𑀇] है?': return '"aa" symbol is [𑀇]?' if lang == 'en' else f'"{mapping["आ"]}" ಚಿಹ್ನೆ [𑀇] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["आ"]}" குறியீடு [𑀇] ஆகுமா?'
    if text == '"इ" का चिह्न [𑀆] है?': return '"i" symbol is [𑀆]?' if lang == 'en' else f'"{mapping["इ"]}" ಚಿಹ್ನೆ [𑀆] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["इ"]}" குறியீடு [𑀆] ஆகுமா?'
    if text == '"ई" का चिह्न [𑀈] है?': return '"ee" symbol is [𑀈]?' if lang == 'en' else f'"{mapping["ई"]}" ಚಿಹ್ನೆ [𑀈] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["ई"]}" குறியீடு [𑀈] ஆகுமா?'
    if text == '"उ" का चिह्न [𑀊] है?': return '"u" symbol is [𑀊]?' if lang == 'en' else f'"{mapping["उ"]}" ಚಿಹ್ನೆ [𑀊] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["उ"]}" குறியீடு [𑀊] ஆகுமா?'
    if text == '"ऊ" का चिह्न [𑀐] है?': return '"oo" symbol is [𑀐]?' if lang == 'en' else f'"{mapping["ऊ"]}" ಚಿಹ್ನೆ [𑀐] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["ऊ"]}" குறியீடு [𑀐] ஆகுமா?'
    if text == '"ए" का चिह्न [𑀏] है?': return '"e" symbol is [𑀏]?' if lang == 'en' else f'"{mapping["ए"]}" ಚಿಹ್ನೆ [𑀏] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["ए"]}" குறியீடு [𑀏] ஆகுமா?'
    if text == '"ऐ" का चिह्न [𑀐] है?': return '"ai" symbol is [𑀐]?' if lang == 'en' else f'"{mapping["ऐ"]}" ಚಿಹ್ನೆ [𑀐] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["ऐ"]}" குறியீடு [𑀐] ஆகுமா?'
    if text == '"ओ" का चिह्न [𑀊] है?': return '"o" symbol is [𑀊]?' if lang == 'en' else f'"{mapping["ओ"]}" ಚಿಹ್ನೆ [𑀊] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["ओ"]}" குறியீடு [𑀊] ஆகுமா?'
    if text == '"औ" का चिह्न [𑀈] है?': return '"au" symbol is [𑀈]?' if lang == 'en' else f'"{mapping["औ"]}" ಚಿಹ್ನೆ [𑀈] ಆಗಿದೆಯೇ?' if lang == 'kn' else f'"{mapping["औ"]}" குறியீடு [𑀈] ஆகுமா?'
    
    # 1. अक्षर ... 
    if '1. अक्षर 𑀓 हल्के रंग में दिखेगा' in text:
        if lang == 'en': return "1. The letter 𑀓 will appear in a light color 2. The user will trace it with their finger or pen 3. The 'Next' button will activate after three practices"
        elif lang == 'kn': return "1. ಅಕ್ಷರ 𑀓 ತಿಳಿ ಬಣ್ಣದಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ 2. ಬಳಕೆದಾರರು ಅದನ್ನು ತಮ್ಮ ಬೆರಳಿನಿಂದ ಅಥವಾ ಪೆನ್ನಿನಿಂದ ಟ್ರೇಸ್ ಮಾಡುತ್ತಾರೆ 3. ಮೂರು ಬಾರಿ ಅಭ್ಯಾಸದ ನಂತರ 'ಮುಂದೆ' ಬಟನ್ ಸಕ್ರಿಯಗೊಳ್ಳುತ್ತದೆ"
        elif lang == 'ta': return "1. 𑀓 என்ற எழுத்து வெளிர் நிறத்தில் தோன்றும் 2. பயனர் அதை விரல் அல்லது பேனாவால் டிரேஸ் செய்ய வேண்டும் 3. மூன்று முறை பயிற்சி செய்த பின் 'அடுத்து' பொத்தான் செயல்படும்"

    if 'अपनी उंगली/पेन से' in text and 'और उसकी सभी मात्राओं वाले रूप ट्रेस करें।' in text:
        letter = re.search(r'से (.*?) और', text).group(1)
        if lang == 'en': return f"Trace {letter} and all its matra forms with your finger/pen."
        elif lang == 'kn': return f"ನಿಮ್ಮ ಬೆರಳು/ಪೆನ್ನಿನಿಂದ {letter} ಮತ್ತು ಅದರ ಎಲ್ಲಾ ಮಾತ್ರಾ ರೂಪಗಳನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ."
        elif lang == 'ta': return f"உங்கள் விரல்/பேனா மூலம் {letter} மற்றும் அதன் அனைத்து மாத்ரா வடிவங்களையும் டிரேஸ் செய்யவும்."

    # X → Y
    match = re.match(r'^([\u0900-\u097F]+) → ([\u11000-\u1107F\u25CC]+)$', text)
    if match:
        vow = match.group(1)
        brahmi = match.group(2)
        v_t = mapping.get(vow, vow)
        return f"{v_t} → {brahmi}"
        
    if text == 'क (𑀓)':
        return 'ka (𑀓)' if lang == 'en' else 'ಕ (𑀓)' if lang == 'kn' else 'க (𑀓)'
    if text == 'कि (𑀓𑀺) – ऊपर':
        return 'ki (𑀓𑀺) – top' if lang == 'en' else 'ಕಿ (𑀓𑀺) – ಮೇಲೆ' if lang == 'kn' else 'கி (𑀓𑀺) – மேல்'
    if text == 'के (𑀓𑁂) – पीछे':
        return 'ke (𑀓𑁂) – back' if lang == 'en' else 'ಕೆ (𑀓𑁂) – ಹಿಂದೆ' if lang == 'kn' else 'கே (𑀓𑁂) – பின்'
        
    match = re.match(r'^जब "([\u0900-\u097F]+)" अकेला होता है', text)
    if match:
        v = match.group(1)
        br_match = re.search(r'→ (.*?)\s*\(ध्वनि', text)
        br = br_match.group(1) if br_match else "𑀓"
        en_l = dev_to_en.get(v, v)
        kn_l = dev_to_kn.get(v, v)
        ta_l = dev_to_ta.get(v, v)
        if lang == 'en': return f"When \"{en_l}\" is alone → {br} (sound: {en_l}). Without matra = only consonant sound + 'a' vowel is inherently attached."
        elif lang == 'kn': return f"ಯಾವಾಗ \"{kn_l}\" ಒಂಟಿಯಾಗಿರುತ್ತದೆಯೋ → {br} (ಧ್ವನಿ: {kn_l}). ಮಾತ್ರಾ ಇಲ್ಲದೆ = ಕೇವಲ ವ್ಯಂಜನ ಧ್ವನಿ + 'ಅ' ಸ್ವರವು ಅಂತರ್ಗತವಾಗಿರುತ್ತದೆ."
        elif lang == 'ta': return f"\"{ta_l}\" தனியாக இருக்கும்போது → {br} (ஒலி: {ta_l}). மாத்ரா இல்லாமல் = மெய்யெழுத்து ஒலி + 'அ' உயிரெழுத்து இயல்பாகவே இணைந்துள்ளது."

    if text.startswith('नहीं,'):
        # नहीं, [𑀆] आ का चिह्न है। इ का चिह्न [𑀇] है।
        v1 = re.search(r'\] (.*?) का', text).group(1)
        v2 = re.search(r'है। (.*?) का', text).group(1)
        b1 = re.search(r'\[(.*?)\]', text).group(1)
        b2 = re.findall(r'\[(.*?)\]', text)[1]
        t1, t2 = mapping.get(v1, v1), mapping.get(v2, v2)
        if lang == 'en': return f"No, [{b1}] is the symbol for {t1}. The symbol for {t2} is [{b2}]."
        if lang == 'kn': return f"ಇಲ್ಲ, [{b1}] {t1} ನ ಚಿಹ್ನೆ. {t2} ನ ಚಿಹ್ನೆ [{b2}]."
        if lang == 'ta': return f"இல்லை, [{b1}] என்பது {t1} வின் குறியீடு. {t2} வின் குறியீடு [{b2}]."
        
    if text.startswith('बोनस: व्यंजन परिचय'):
        v = re.search(r'"(.*?)"', text).group(1)
        b = re.search(r'\((.*?)\)', text).group(1)
        en_l = dev_to_en.get(v, v).upper()
        kn_l = dev_to_kn.get(v, v)
        ta_l = dev_to_ta.get(v, v)
        if lang == 'en': return f'Bonus: Consonant Introduction – "{en_l}" ({b})'
        elif lang == 'kn': return f'ಬೋನಸ್: ವ್ಯಂಜನ ಪರಿಚಯ – "{kn_l}" ({b})'
        elif lang == 'ta': return f'போனஸ்: மெய்யெழுத்து அறிமுகம் – "{ta_l}" ({b})'
        
    if text.startswith('ब्राह्मी लिपि में "क" का रूप:'):
        return 'In Brahmi script, the form of "KA" is: 𑀓. Pronunciation: ka (e.g. – kamal, kaksha)' if lang == 'en' else 'ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "ಕ" ದ ರೂಪ: 𑀓 ಆಗಿದೆ. ಉಚ್ಚಾರಣೆ: ಕ (ಉದಾಹರಣೆಗೆ – ಕಮಲ್, ಕಕ್ಷಾ)' if lang == 'kn' else 'பிராமி எழுத்துமுறையில் "க" வின் வடிவம்: 𑀓 ஆகும். உச்சரிப்பு: க (உதாரணமாக – கமல், கக்ஷா)' if lang == 'ta' else ''
    if text.startswith('ब्राह्मी लिपि में "ख" का रूप:'):
        return 'In Brahmi script, the form of "KHA" is: 𑀔. Pronunciation: kha (e.g. – khat, khel)' if lang == 'en' else 'ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "ಖ" ದ ರೂಪ: 𑀔 ಆಗಿದೆ. ಉಚ್ಚಾರಣೆ: ಖ (ಉದಾಹರಣೆಗೆ – ಖಟ್, ಖೇಲ್)' if lang == 'kn' else 'பிராமி எழுத்துமுறையில் "க்ஹ" வின் வடிவம்: 𑀔 ஆகும். உச்சரிப்பு: க்ஹ (உதாரணமாக – கட், கேல்)' if lang == 'ta' else ''
    if text.startswith('ब्राह्मी लिपि में "ग" का रूप:'):
        return 'In Brahmi script, the form of "GA" is: 𑀕. Pronunciation: ga (e.g. – gaay, gaman)' if lang == 'en' else 'ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "ಗ" ದ ರೂಪ: 𑀕 ಆಗಿದೆ. ಉಚ್ಚಾರಣೆ: ಗ (ಉದಾಹರಣೆಗೆ – ಗಾಯ್, ಗಮನ್)' if lang == 'kn' else 'பிராமி எழுத்துமுறையில் "க" வின் வடிவம்: 𑀕 ஆகும். உச்சரிப்பு: க (உதாரணமாக – காய், கமன்)' if lang == 'ta' else ''
    if text.startswith('ब्राह्मी लिपि में "घ" का रूप:'):
        return 'In Brahmi script, the form of "GHA" is: 𑀖. Pronunciation: gha (e.g. – ghar, ghadi)' if lang == 'en' else 'ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "ಘ" ದ ರೂಪ: 𑀖 ಆಗಿದೆ. ಉಚ್ಚಾರಣೆ: ಘ (ಉದಾಹರಣೆಗೆ – ಘರ್, ಘಡಿ)' if lang == 'kn' else 'பிராமி எழுத்துமுறையில் "க்ஹ" வின் வடிவம்: 𑀖 ஆகும். உச்சரிப்பு: க்ஹ (உதாரணமாக – கர், கடி)' if lang == 'ta' else ''
    if text.startswith('ब्राह्मी लिपि में "ङ" का रूप:'):
        return 'In Brahmi script, the form of "NGA" is: 𑀗. Pronunciation: nga (e.g. – ang, pankh)' if lang == 'en' else 'ಬ್ರಾಹ್ಮಿ ಲಿಪಿಯಲ್ಲಿ "ಙ" ದ ರೂಪ: 𑀗 ಆಗಿದೆ. ಉಚ್ಚಾರಣೆ: ಙ (ಉದಾಹರಣೆಗೆ – ಅಂಙ್, ಪಂಖ್)' if lang == 'kn' else 'பிராமி எழுத்துமுறையில் "ங" வின் வடிவம்: 𑀗 ஆகும். உச்சரிப்பு: ங (உதாரணமாக – அங், பங்க்)' if lang == 'ta' else ''
        
    if text.startswith('हाँ, ['):
        v = re.search(r'\] (.*?) का', text).group(1)
        b = re.search(r'\[(.*?)\]', text).group(1)
        t = mapping.get(v, v)
        if 'अनुस्वार के साथ' in text:
            if lang == 'en': return f"Yes, [{b}] is the Brahmi symbol for {t} (with Anusvara)."
            if lang == 'kn': return f"ಹೌದು, [{b}] {t} ನ ಬ್ರಾಹ್ಮಿ ಚಿಹ್ನೆ (ಅನುಸ್ವಾರದೊಂದಿಗೆ)."
            if lang == 'ta': return f"ஆம், [{b}] என்பது {t} வின் பிராமி குறியீடு (அனுஸ்வாரத்துடன்)."
        elif 'विसर्ग के साथ' in text:
            if lang == 'en': return f"Yes, [{b}] is the Brahmi symbol for {t} (with Visarga)."
            if lang == 'kn': return f"ಹೌದು, [{b}] {t} ನ ಬ್ರಾಹ್ಮಿ ಚಿಹ್ನೆ (ವಿಸರ್ಗದೊಂದಿಗೆ)."
            if lang == 'ta': return f"ஆம், [{b}] என்பது {t} வின் பிராமி குறியீடு (விசர்கத்துடன்)."
        else:
            if lang == 'en': return f"Yes, [{b}] is the Brahmi symbol for {t}."
            if lang == 'kn': return f"ಹೌದು, [{b}] {t} ನ ಬ್ರಾಹ್ಮಿ ಚಿಹ್ನೆ."
            if lang == 'ta': return f"ஆம், [{b}] என்பது {t} வின் பிராமி குறியீடு."
            
    match = re.match(r'^𑀅 (.*)$', text)
    if text.startswith('𑀅 (अ)'):
        return '𑀅 (a)' if lang == 'en' else '𑀅 (ಅ)' if lang == 'kn' else '𑀅 (அ)'
    if text.startswith('𑀆 (आ)'):
        return '𑀆 (aa)' if lang == 'en' else '𑀆 (ಆ)' if lang == 'kn' else '𑀆 (ஆ)'
    if text.startswith('𑀇 (इ)'):
        return '𑀇 (i)' if lang == 'en' else '𑀇 (ಇ)' if lang == 'kn' else '𑀇 (இ)'
        
    if text.endswith('का देवनागरी चिह्न क्या है?'):
        b = text.split(' ')[0]
        if lang == 'en': return f"What is the equivalent symbol for {b}?"
        if lang == 'kn': return f"{b} ನ ದೇವನಾಗರಿ ಚಿಹ್ನೆ ಏನು?"
        if lang == 'ta': return f"{b} வின் தேவநாகரி குறியீடு என்ன?"
    if text.endswith('का देवनागरी चिह्न क्या है? (अनुस्वार)'):
        b = text.split(' ')[0]
        if lang == 'en': return f"What is the equivalent symbol for {b}? (Anusvara)"
        if lang == 'kn': return f"{b} ನ ದೇವನಾಗರಿ ಚಿಹ್ನೆ ಏನು? (ಅನುಸ್ವಾರ)"
        if lang == 'ta': return f"{b} வின் தேவநாகரி குறியீடு என்ன? (அனுஸ்வாரம்)"
    if text.endswith('का देवनागरी चिह्न क्या है? (विसर्ग)'):
        b = text.split(' ')[0]
        if lang == 'en': return f"What is the equivalent symbol for {b}? (Visarga)"
        if lang == 'kn': return f"{b} ನ ದೇವನಾಗರಿ ಚಿಹ್ನೆ ಏನು? (ವಿಸರ್ಗ)"
        if lang == 'ta': return f"{b} வின் தேவநாகரி குறியீடு என்ன? (விசர்கம்)"

    if text.startswith('𑀓 + ◌𑀸 → 𑀓𑀸 (का)'):
        return '𑀓 + ◌𑀸 → 𑀓𑀸 (kaa)' if lang == 'en' else '𑀓 + ◌𑀸 → 𑀓𑀸 (ಕಾ)' if lang == 'kn' else '𑀓 + ◌𑀸 → 𑀓𑀸 (கா)'
        
    match = re.match(r'^([\u11000-\u1107F\u25CC]+) ___ = (.*)$', text)
    if match:
        b = match.group(1)
        v = match.group(2)
        if lang == 'en':
            return f"{b} ___ = {dev_to_en.get(v) or matra_en.get(v, v)}"
        elif lang == 'kn':
            # Need to transliterate full syllable if possible, but let's just do a simple replacement for now, or just mapping
            kn_syl = v
            # Very simplistic mapping for kannada syllables
            kn_map = {'क':'ಕ', 'कं':'ಕಂ', 'कः':'ಕಃ', 'के':'ಕೆ', 'कौ':'ಕೌ',
                      'ख':'ಖ', 'खं':'ಖಂ', 'खः':'ಖಃ', 'खे':'ಖೆ', 'खौ':'ಖೌ',
                      'ग':'ಗ', 'गं':'ಗಂ', 'गः':'ಗಃ', 'गे':'ಗೆ', 'गौ':'ಗೌ',
                      'घ':'ಘ', 'घं':'ಘಂ', 'घः':'ಘಃ', 'घे':'ಘೆ', 'घौ':'ಘೌ',
                      'ङ':'ಙ', 'ङं':'ಙಂ', 'ङः':'ಙಃ', 'ङೆ':'ಙೆ', 'ङौ':'ಙೌ'}
            return f"{b} ___ = {kn_map.get(v, v)}"
        elif lang == 'ta':
            ta_map = {'क':'க', 'कं':'கம்', 'कः':'கஃ', 'के':'கே', 'कौ':'கௌ',
                      'ख':'க்ஹ', 'खं':'க்ஹம்', 'खः':'க்ஹஃ', 'खे':'க்ஹே', 'खौ':'க்ஹௌ',
                      'ग':'க', 'गं':'கம்', 'गः':'கஃ', 'गे':'கே', 'गौ':'கௌ',
                      'घ':'க்ஹ', 'घं':'க்ஹம்', 'घः':'க்ஹஃ', 'घे':'க்ஹே', 'घौ':'க்ஹௌ',
                      'ङ':'ங', 'ङं':'ஙம்', 'ङः':'ஙஃ', 'ङे':'ஙே', 'ङौ':'ஙௌ'}
            return f"{b} ___ = {ta_map.get(v, v)}"
    return ""

enMapExt = {}
knMapExt = {}
taMapExt = {}

for string in missing_strings:
    enMapExt[string] = translate_str(string, 'en')
    knMapExt[string] = translate_str(string, 'kn')
    taMapExt[string] = translate_str(string, 'ta')

with open('missing_en.json', 'w', encoding='utf-8') as f:
    json.dump(enMapExt, f, ensure_ascii=False, indent=2)
with open('missing_kn.json', 'w', encoding='utf-8') as f:
    json.dump(knMapExt, f, ensure_ascii=False, indent=2)
with open('missing_ta.json', 'w', encoding='utf-8') as f:
    json.dump(taMapExt, f, ensure_ascii=False, indent=2)

print("Generated mapping files.")
