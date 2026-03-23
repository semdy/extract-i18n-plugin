import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {
  changeLanguage,
  languageList,
} from 'example-ember/instance-initializers/intl';

export default class LocaleSelectComponent extends Component {
  @service intl;

  get currentLocale() {
    return this.intl.primaryLocale ?? 'en_US';
  }

  get options() {
    return languageList.map((language) => ({
      ...language,
      selected: language.value === this.currentLocale,
    }));
  }

  @action
  updateLocale(event) {
    changeLanguage(event.target.value);
  }

  <template>
    <label>
      <select {{on "change" this.updateLocale}}>
        {{#each this.options as |language|}}
          <option value={{language.value}} selected={{language.selected}}>
            {{language.label}}
          </option>
        {{/each}}
      </select>
    </label>
  </template>
}
