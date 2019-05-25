import { Reducer } from 'redux';
import { IExercise } from './exercise.model';
import { Exercise } from '@/lib/Exercise';

export interface IExerciseState {
  list: IExercise[];
  loading: boolean;
  errors: any[];
}

export const ADD_EXERCISE: string = 'ADD_EXERCISE';
export const LOAD_EXERCISES: string = 'LOAD_EXERCISES';

export const exercisesReducer: Reducer<IExerciseState> = (
  state: IExerciseState,
  action
) => {
  console.log(action);
  switch (action.type) {
    case ADD_EXERCISE:
      return { ...state, list: [...state.list, ...[action.payload]] };
    case LOAD_EXERCISES:
      return { ...state, list: [...state.list, ...[new Exercise()]] };
    default:
      return state;
  }
};
