import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment';
import { IExercise } from '@stores/exercise/exercise.model';

@Pipe({ name: 'accumulateTime' })
export class accumulateTimePipe implements PipeTransform {
  transform(exercises: IExercise[]): number {
    if (!exercises) return 0;

    let time: number = 0;

    exercises.forEach(exercise => {
      if (!exercise.start || !exercise.end) return;
      time += moment(exercise.end).diff(moment(exercise.start));
    });

    return Math.max(0, time);
  }
}
