import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@/locales/TranslatePipe';

@Component({
  standalone: true,
  imports: [TranslatePipe],
  selector: 'app-counter',
  templateUrl: './index.html',
})
export class Counter {
  protected readonly count = signal(0);

  public increment() {
    this.count.update((c) => c + 1);
  }
}
