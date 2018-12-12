import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment';

import { zeroPad } from '../lib/helpers';

// http://www.competa.com/blog/custom-groupby-pipe-angular-4/
@Pipe({ name: 'groupBy', pure: false })
export class groupByPipe implements PipeTransform {
  transform(collection: Array<any>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) return;

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // console.log(Object.keys(groupedCollection).map(key => ({ key, items: groupedCollection[key] })));
    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, items: groupedCollection[key] }));
  }
}

@Pipe({ name: 'accumulateTime' })
export class accumulateTimePipe implements PipeTransform {
  transform(exercises: Array<any>): number {
    if (!exercises) return 0;

    let time: number = 0;

    exercises.forEach(exercise => {
      if (!exercise.start || !exercise.end) return;
      time += moment(exercise.end).diff(moment(exercise.start));
    });

    return time;
  }
}

@Pipe({ name: 'msToTime' })
export class msToTimePipe implements PipeTransform {
  transform(miliseconds: number, format: string) {
    if (!miliseconds) return;

    let ms = miliseconds % 1000;
    miliseconds = (miliseconds - ms) / 1000;
    let secs = miliseconds % 60;
    miliseconds = (miliseconds - secs) / 60;
    let mins = miliseconds % 60;
    let hrs = (miliseconds - mins) / 60;

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

// http://embed.plnkr.co/Y3in02HYKneMNeotN6Nv/
@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, args: string[]): string {
    let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    let trail = args.length > 1 ? args[1] : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
