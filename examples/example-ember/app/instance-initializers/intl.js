import en_gen from 'example-ember/translations/en.json';
import ja_gen from 'example-ember/translations/ja.json';
import ko_gen from 'example-ember/translations/ko.json';
import zhHans_gen from 'example-ember/translations/zh-cn.json';
import zhHant_gen from 'example-ember/translations/zh-tw.json';

export let locale = getClientLocale();

export const languageList = [
  {
    value: 'zh_CN',
    label: '简体中文',
  },
  {
    value: 'zh_TW',
    label: '繁体中文',
  },
  { value: 'en_US', label: 'English' },
  { value: 'ja_JP', label: '日本語' },
  { value: 'ko_KR', label: '한국인' },
];

export function getClientLocale() {
  const localeFromStorage = localStorage.getItem('locale');
  if (localeFromStorage) {
    return localeFromStorage;
  }
  const clientLocale = navigator.language;
  const clientLocaleMap = {
    'zh-CN': 'zh_CN',
    zh: 'zh_CN',
    'zh-TW': 'zh_TW',
    'en-US': 'en_US',
    'ja-JP': 'ja_JP',
    'ko-KR': 'ko_KR',
    ja: 'ja_JP',
    ko: 'ko_KR',
    kr: 'ko_KR',
  };
  return clientLocaleMap[clientLocale] || 'en_US';
}

let intl;

export function t(key, defaultMessageOrOptions, maybeOptions) {
  let options;

  if (
    defaultMessageOrOptions &&
    typeof defaultMessageOrOptions === 'object' &&
    !Array.isArray(defaultMessageOrOptions)
  ) {
    options = defaultMessageOrOptions;
  } else {
    options = {
      ...(maybeOptions ?? {}),
      ...(defaultMessageOrOptions !== undefined
        ? { defaultMessage: defaultMessageOrOptions }
        : {}),
    };
  }

  if (!intl) {
    return options?.defaultMessage ?? key;
  }

  return intl.t(key, options);
}

export function changeLanguage(lang) {
  if (locale === lang) return;
  locale = lang;
  intl?.setLocale([locale, 'en_US']);
  localStorage.setItem('locale', lang);
}

export function initialize(applicationInstance) {
  intl = applicationInstance.lookup('service:intl');

  intl.addTranslations('zh_CN', zhHans_gen);
  intl.addTranslations('zh_TW', zhHant_gen);
  intl.addTranslations('en_US', en_gen);
  intl.addTranslations('ja_JP', ja_gen);
  intl.addTranslations('ko_KR', ko_gen);

  intl.setOnMissingTranslation((key, _locales, options) => {
    return options?.defaultMessage ?? key;
  });

  intl.setLocale([locale, 'en_US']);
}

export default {
  initialize,
};
