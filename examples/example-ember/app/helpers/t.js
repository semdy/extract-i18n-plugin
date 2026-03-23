import Helper from '@ember/component/helper';
import { t as _t } from 'example-ember/instance-initializers/intl';

export class t extends Helper {
  compute([key, defaultMessageOrOptions, maybeOptions], named) {
    return _t(
      key,
      defaultMessageOrOptions,
      maybeOptions ? { ...maybeOptions, ...named } : named
    );
  }
}
