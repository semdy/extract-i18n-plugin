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

export function $t(key, defaultMsgOrOptions, maybeOptions) {
  let options;

  if (
    defaultMsgOrOptions &&
    typeof defaultMsgOrOptions === 'object' &&
    !Array.isArray(defaultMsgOrOptions)
  ) {
    options = defaultMsgOrOptions;
  } else {
    options = {
      ...(maybeOptions ?? {}),
      ...(defaultMsgOrOptions !== undefined
        ? { defaultMsg: defaultMsgOrOptions }
        : { defaultMsg: key }),
    };
  }

  if (!intl) {
    return options?.defaultMsg ?? key;
  }

  if (!intl.exists(key, locale)) {
    return intl.formatMessage(
      {
        id: key,
        defaultMessage: options?.defaultMsg ?? key,
      },
      options
    );
  }

  return intl.t(key, options);
}

export function changeLanguage(lang) {
  if (locale === lang) return;
  locale = lang;
  intl?.setLocale([locale, 'en_US']);
  localStorage.setItem('locale', lang);
}

export function setupIntl(intlInstance) {
  intl = intlInstance;
}

export { THelper as t } from './helper';
