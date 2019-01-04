import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment';

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
