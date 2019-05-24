// import { ActionReducer, Action } from '@ngrx/store';
// import { ExerciseActions } from '@/stores/exercise/exercise.action';
// import { IExercise } from './exercise.model';

// export interface IExerciseState {
//   exercises: IExercise[];
// }

// export const INITIAL_EXERCISE_STATE: IExerciseState = {
//   exercises: []
// };

// export function ExerciseReducer(
//   state: IExerciseState = INITIAL_EXERCISE_STATE,
//   action
// ) {
//   switch (action.type) {
//     case ExerciseActions.ADD_EXERCISE:
//       return [...state.exercises, ...action.payload];
//   }
// }

import { Reducer } from 'redux';
import { IExercise } from './exercise.model';

export interface IExerciseState {
  exercises: IExercise[];
}

export const ADD_EXERCISE: string = 'ADD_EXERCISE';

export const exercisesReducer: Reducer<any> = (
  state: IExerciseState,
  action
) => {
  switch (action.type) {
    case ADD_EXERCISE:
      return { ...state.exercises, ...action.payload };
    default:
      return state;
  }
};
