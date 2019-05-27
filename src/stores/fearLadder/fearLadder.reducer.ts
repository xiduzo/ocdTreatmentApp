import { Reducer } from 'redux';
import { IStep } from '@/stores/exercise/exercise.model';

export interface IFearLadderState {
  steps: IStep[];
  loading: boolean;
  errors: any[];
}

export const LOAD_FEAR_LADDER: string = 'LOAD_FEAR_LADDER';
export const RECEIVED_FEAR_LADDER: string = 'RECEIVED_FEAR_LADDER';
export const REQUEST_FEAR_LADDER: string = 'REQUEST_FEAR_LADDER';

export const fearLadderReducer: Reducer<IFearLadderState> = (
  state: IFearLadderState,
  action
) => {
  // console.log(action);
  switch (action.type) {
    case RECEIVED_FEAR_LADDER:
      return {
        ...state,
        steps: [...state.steps, ...action.payload],
        loading: false
      };
    case REQUEST_FEAR_LADDER:
      return { ...state, loading: true };
    default:
      return state;
  }
};
