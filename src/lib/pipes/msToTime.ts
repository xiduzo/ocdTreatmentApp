import { Pipe, PipeTransform } from '@angular/core';

import { zeroPad } from '@/lib/helpers';

@Pipe({ name: 'msToTime' })
export class msToTimePipe implements PipeTransform {
  transform(miliseconds: number, format: string) {
    if (!miliseconds) return false;

    const ms = miliseconds % 1000;
    miliseconds = (miliseconds - ms) / 1000;
    const secs = miliseconds % 60;
    miliseconds = (miliseconds - secs) / 60;
    const mins = miliseconds % 60;
    const hrs = (miliseconds - mins) / 60;

    let str;
    switch (format) {
      case 'hours':
        str = zeroPad(hrs, 1);
        break;
      case 'minutes':
        str = zeroPad(mins, 1);
        break;
      default:
        str = zeroPad(hrs, 2) + ':' + zeroPad(mins, 2) + ':' + zeroPad(secs, 2);
        break;
    }

    return str;
  }
}
