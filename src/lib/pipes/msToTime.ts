import { Pipe, PipeTransform } from '@angular/core';

import { zeroPad } from '@/lib/helpers';

@Pipe({ name: 'msToTime' })
export class msToTimePipe implements PipeTransform {
  transform(milliseconds: number, format: string) {
    if (!milliseconds) return false;

    const ms = milliseconds % 1000;
    milliseconds = (milliseconds - ms) / 1000;
    const secs = milliseconds % 60;
    milliseconds = (milliseconds - secs) / 60;
    const mins = milliseconds % 60;
    const hrs = (milliseconds - mins) / 60;

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
