import { IAppState } from '../app/app.module';
import { Reducer } from 'redux';

import { exercisesReducer } from '@/stores/exercise/exercise.reducer';

export const rootReducer: Reducer<IAppState> = (state: IAppState, action) => ({
  exercises: exercisesReducer(state.exercises, action)
  // notes: notesReducer(state.notes, action),
  // reminders: remindersReducer(state.reminders, action)
});
