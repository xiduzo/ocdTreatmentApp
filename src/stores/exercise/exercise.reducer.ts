import { Reducer } from 'redux';
import { IExercise } from './exercise.model';

export interface IExerciseState {
  list: IExercise[];
  loading: boolean;
  errors: any[];
}

export const ADD_EXERCISE: string = 'ADD_EXERCISE';
export const REQUEST_EXERCISES: string = 'REQUEST_EXERCISES';
export const RECEIVED_EXERCISES: string = 'RECEIVED_EXERCISES';
export const EDIT_EXERCISE: string = 'EDIT_EXERCISE';

export const exercisesReducer: Reducer<IExerciseState> = (
  state: IExerciseState,
  action
) => {
  switch (action.type) {
    case ADD_EXERCISE:
      return {
        ...state,
        list: [...state.list, action.payload]
      };
    case REQUEST_EXERCISES:
      return { ...state, loading: true };
    case RECEIVED_EXERCISES:
      return {
        ...state,
        list: [...state.list, ...action.payload],
        loading: false
      };
    case EDIT_EXERCISE:
      return {
        ...state,
        list: state.list.map((exercise: IExercise) => {
          return exercise.id == action.payload.id ? action.payload : exercise;
        })
      };
    default:
      return state;
  }
};
