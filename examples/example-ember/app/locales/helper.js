import Helper from '@ember/component/helper';
import { $t } from 'example-ember/locales';

export class THelper extends Helper {
  compute([key, defaultMsgOrOptions, maybeOptions], named) {
    return $t(
      key,
      defaultMsgOrOptions,
      maybeOptions ? { ...maybeOptions, ...named } : named
    );
  }
}
