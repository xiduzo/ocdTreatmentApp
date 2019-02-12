import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment';

@Pipe({ name: 'difference' })
export class differencePipe implements PipeTransform {
  transform(base: number, compare: number, decimalPoint: number = 1): string {
    if (!base || !compare) return false;

    const difference = ((compare * 100 / base) - 100).toFixed(decimalPoint);

    return `${difference > 0 ? '+' : ''}${difference}`;
  }
}
