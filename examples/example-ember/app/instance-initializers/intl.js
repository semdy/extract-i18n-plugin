import en_gen from 'example-ember/locales/gen/en.json';
import ja_gen from 'example-ember/locales/gen/ja.json';
import ko_gen from 'example-ember/locales/gen/ko.json';
import zhHans_gen from 'example-ember/locales/gen/zh-cn.json';
import zhHant_gen from 'example-ember/locales/gen/zh-tw.json';

import { setupIntl, locale } from 'example-ember/locales';

export function initialize(applicationInstance) {
  const intl = applicationInstance.lookup('service:intl');

  setupIntl(intl);

  intl.addTranslations('zh_CN', zhHans_gen);
  intl.addTranslations('zh_TW', zhHant_gen);
  intl.addTranslations('en_US', en_gen);
  intl.addTranslations('ja_JP', ja_gen);
  intl.addTranslations('ko_KR', ko_gen);

  intl.setOnMissingTranslation((key, _locales, options) => {
    return options?.defaultMsg ?? key;
  });

  intl.setLocale([locale, 'en_US']);
}

export default {
  initialize,
};
