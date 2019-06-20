import { Reducer } from 'redux';

import {
  exercisesReducer,
  IExerciseState
} from '@stores/exercise/exercise.reducer';

import {
  fearLadderReducer,
  IFearLadderState
} from '@stores/fearLadder/fearLadder.reducer';

import { badgeReducer, IBadgeState } from '@stores/badge/badge.reducer';

export interface IAppState {
  exercises: IExerciseState;
  fearLadder: IFearLadderState;
  badges: IBadgeState;
}
export const INITIAL_STATE: IAppState = {
  exercises: {
    list: [],
    loading: true,
    errors: []
  },
  fearLadder: {
    steps: [],
    loading: true,
    errors: []
  },
  badges: {
    list: [],
    loading: true,
    errors: []
  }
};

export const rootReducer: Reducer<IAppState> = (state: IAppState, action) => ({
  exercises: exercisesReducer(state.exercises, action),
  fearLadder: fearLadderReducer(state.fearLadder, action),
  badges: badgeReducer(state.badges, action)
});
