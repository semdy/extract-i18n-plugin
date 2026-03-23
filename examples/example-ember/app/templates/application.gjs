import { pageTitle } from 'ember-page-title';
import { t } from 'example-ember/locales';
import Counter from 'example-ember/components/counter';
import LocaleSelect from 'example-ember/components/locale-select';

<template>
  {{pageTitle "Ember.js应用示例"}}

  {{outlet}}

  <LocaleSelect />

  <Counter />

  <p></p>

  <div>纯文本测试</div>
</template>
