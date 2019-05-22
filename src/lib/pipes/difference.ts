import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'difference' })
export class differencePipe implements PipeTransform {
  transform(base: number, compare: number, decimalPoint: number = 1): string {
    if (!base || !compare) return '0';

    const diff: number = parseFloat(
      ((compare * 100) / base - 100).toFixed(decimalPoint)
    );

    return `${diff > 0 ? '+' : ''}${diff}`;
  }
}
