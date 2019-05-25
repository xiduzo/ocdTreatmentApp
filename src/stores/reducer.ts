import { Reducer } from 'redux';

import {
  exercisesReducer,
  IExerciseState
} from '@/stores/exercise/exercise.reducer';

export interface IAppState {
  exercises: IExerciseState;
}
export const INITIAL_STATE: IAppState = {
  exercises: {
    list: [],
    loading: true,
    errors: []
  }
};

export const rootReducer: Reducer<IAppState> = (state: IAppState, action) => ({
  exercises: exercisesReducer(state.exercises, action)
  // notes: notesReducer(state.notes, action),
  // reminders: remindersReducer(state.reminders, action)
});
