// import { Injectable } from '@angular/core';
// import { Action } from '@ngrx/store';

// import { IExercise } from '@/stores/exercise/exercise.model';

// export const ADD_EXERCISE: string = 'ADD_EXERCISE';
// export class ExerciseAddAction implements Action {
//   readonly type: string = ADD_EXERCISE;
//   constructor(public payload: IExercise) {}
// }

// @Injectable()
// export class ExerciseActions {
//   static readonly ADD_EXERCISE = ADD_EXERCISE;
//   addExercise(exercise: IExercise): ExerciseAddAction {
//     return {
//       type: ADD_EXERCISE,
//       payload: exercise
//     };
//   }
// }

import { Injectable } from '@Angular/core';
import { dispatch } from '@Angular-redux/store';
import { Action } from '@ngrx/store';

import { ADD_EXERCISE } from '@/stores/exercise/exercise.reducer';
import { IExercise } from '@/stores/exercise/exercise.model';

export class ExerciseAddAction implements Action {
  readonly type: string = ADD_EXERCISE;
  constructor(public payload: IExercise) {}
}

@Injectable()
export class ExerciseActions {
  @dispatch()
  addExercise = (exercise: IExercise): ExerciseAddAction => ({
    type: ADD_EXERCISE,
    payload: exercise
  });
}
