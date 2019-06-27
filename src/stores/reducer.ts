import { Reducer } from 'redux';

import {
  exercisesReducer,
  IExerciseState,
  INITIAL_EXERCISE_STATE
} from '@stores/exercise/exercise.reducer';

import {
  fearLadderReducer,
  IFearLadderState,
  INITIAL_FEAR_LADDER_STATE
} from '@stores/fearLadder/fearLadder.reducer';

import {
  badgeReducer,
  IBadgeState,
  INITIAL_BADGE_STATE
} from '@stores/badge/badge.reducer';

export interface IAppState {
  exercises: IExerciseState;
  fearLadder: IFearLadderState;
  badges: IBadgeState;
}
export const INITIAL_STATE: IAppState = {
  exercises: INITIAL_EXERCISE_STATE,
  fearLadder: INITIAL_FEAR_LADDER_STATE,
  badges: INITIAL_BADGE_STATE
};

export const rootReducer: Reducer<IAppState> = (state: IAppState, action) => ({
  exercises: exercisesReducer(state.exercises, action),
  fearLadder: fearLadderReducer(state.fearLadder, action),
  badges: badgeReducer(state.badges, action)
});
