import { Injectable, signal } from '@angular/core';

import en_gen from './gen/en.json';
import ja_gen from './gen/ja.json';
import ko_gen from './gen/ko.json';
import zhHans_gen from './gen/zh-cn.json';
import zhHant_gen from './gen/zh-tw.json';

export const messages = {
  'zh-CN': zhHans_gen,
  'zh-TW': zhHant_gen,
  en: en_gen,
  ja: ja_gen,
  ko: ko_gen,
} as const;

export type Messages = typeof messages;
export type SupportLocale = keyof Messages;

export function getClientLocale(): SupportLocale {
  const localeFromStorage = localStorage.getItem('locale');
  if (localeFromStorage) {
    return localeFromStorage as SupportLocale;
  }
  const clientLocale = navigator.language;
  const clientLocaleMap: Record<string, SupportLocale> = {
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    zh: 'zh-CN',
    'en-US': 'en',
    'ja-JP': 'ja',
    'ko-KR': 'ko',
    kr: 'ko',
  };
  return clientLocaleMap[clientLocale] || 'en';
}

export const languageList: {
  value: SupportLocale;
  label: string;
}[] = [
  {
    value: 'zh-CN',
    label: '简体中文',
  },
  {
    value: 'zh-TW',
    label: '繁体中文',
  },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국인' },
];

export let locale = getClientLocale();

type TranslateValues = Record<string, any>;
type TranslateArgs =
  | []
  | [defaultMsg: string]
  | [values: TranslateValues]
  | [defaultMsg: string, values: TranslateValues];

function formatMessage(locale: SupportLocale, key: string, ...args: TranslateArgs): string {
  const [arg2, arg3] = args;
  let defaultMsg: string | undefined;
  let values: TranslateValues | undefined;

  if (typeof arg2 === 'string') {
    defaultMsg = arg2;
    values = arg3;
  } else {
    values = arg2;
  }

  let msg = (messages[locale] as Record<string, any>)?.[key] ?? (defaultMsg || key);

  if (values) {
    msg = msg.replace(/\{([^}]+)\}/gm, (match: any, name: string) => {
      return values![name] ?? match;
    });
  }

  return msg;
}

export function t(key: string, ...args: TranslateArgs): string {
  return formatMessage(locale, key, ...args);
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private locale = signal<SupportLocale>(locale);

  public messages: Messages = messages;

  public currentLocale = this.locale.asReadonly();

  public t(key: string, ...args: TranslateArgs): string {
    return formatMessage(this.locale(), key, ...args);
  }

  setLocale(lang: SupportLocale) {
    if (locale === lang) return;
    locale = lang;
    this.locale.set(lang);
    localStorage.setItem('locale', lang);
  }
}
