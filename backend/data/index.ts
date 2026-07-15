import hindiIntro from './hindi/introduction.json';
import hindiVyanjan from './hindi/vyanjan.json';
import hindiMatras from './hindi/matras.json';
import hindiSwar from './hindi/swar.json';

import englishIntro from './english/introduction.json';
import englishVyanjan from './english/vyanjan.json';
import englishMatras from './english/matras.json';
import englishSwar from './english/swar.json';

import kannadaIntro from './kannada/introduction.json';
import kannadaVyanjan from './kannada/vyanjan.json';
import kannadaMatras from './kannada/matras.json';
import kannadaSwar from './kannada/swar.json';

import tamilIntro from './tamil/introduction.json';
import tamilVyanjan from './tamil/vyanjan.json';
import tamilMatras from './tamil/matras.json';
import tamilSwar from './tamil/swar.json';

type LanguageKey = 'hindi' | 'english' | 'kannada' | 'tamil';

const supportedLanguages: LanguageKey[] = ['english', 'kannada', 'tamil', 'hindi'];

const data: Record<LanguageKey, any> = {
  hindi: { introduction: hindiIntro, swar: hindiSwar, vyanjan: hindiVyanjan, matras: hindiMatras },
  english: { introduction: englishIntro, swar: englishSwar, vyanjan: englishVyanjan, matras: englishMatras },
  kannada: { introduction: kannadaIntro, swar: kannadaSwar, vyanjan: kannadaVyanjan, matras: kannadaMatras },
  tamil: { introduction: tamilIntro, swar: tamilSwar, vyanjan: tamilVyanjan, matras: tamilMatras }
};

export const SUPPORTED_LANGUAGES = supportedLanguages;
export const DEFAULT_LANGUAGE: LanguageKey = 'hindi';

export function getDataForLanguage(lang: string) {
  let language = lang.toLowerCase();
  if (language === 'hi') language = 'hindi';
  if (language === 'en') language = 'english';
  if (language === 'kn') language = 'kannada';
  if (language === 'ta') language = 'tamil';
  const finalLang = supportedLanguages.includes(language as LanguageKey) ? (language as LanguageKey) : DEFAULT_LANGUAGE;
  return data[finalLang];
}

