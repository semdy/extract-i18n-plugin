import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { t } from 'example-ember/helpers/t';

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count += 1;
  }

  @action
  decrement() {
    this.count -= 1;
  }

  <template>
    <section>
      <h2>计数器</h2>
      <button type="button" {{on "click" this.decrement}}>
        -
      </button>
      <span>{{t "当前计数: {count}" count=this.count}}</span>
      <button type="button" {{on "click" this.increment}}>
        +
      </button>
    </section>
  </template>
}
