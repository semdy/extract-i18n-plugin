import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './I18nService';

@Pipe({
  name: 't',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(I18nService);

  transform(key: string, ...args: Parameters<I18nService['t']> extends [string, ...infer Rest] ? Rest : never): string {
    return this.i18n.t(key, ...args);
  }
}
