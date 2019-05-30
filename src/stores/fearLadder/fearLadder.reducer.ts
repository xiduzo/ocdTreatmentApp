import { Reducer } from 'redux';
import { IStep } from '@/stores/exercise/exercise.model';

export interface IFearLadderState {
  steps: IStep[];
  loading: boolean;
  errors: any[];
}

export const RECEIVED_FEAR_LADDER: string = 'RECEIVED_FEAR_LADDER';
export const REQUEST_FEAR_LADDER: string = 'REQUEST_FEAR_LADDER';
export const ADD_FEAR_LADDER_STEP: string = 'ADD_FEAR_LADDER_STEP';
export const REMOVE_FEAR_LADDER_STEP: string = 'REMOVE_FEAR_LADDER_STEP';
export const EDIT_FEAR_LADDER_STEP: string = 'EDIT_FEAR_LADDER_STEP';

export const fearLadderReducer: Reducer<IFearLadderState> = (
  state: IFearLadderState,
  action
) => {
  switch (action.type) {
    case RECEIVED_FEAR_LADDER:
      return {
        ...state,
        steps: [...state.steps, ...action.payload],
        loading: false
      };
    case REQUEST_FEAR_LADDER:
      return { ...state, loading: true };
    case ADD_FEAR_LADDER_STEP:
      return { ...state, steps: [...state.steps, action.payload] };
    case REMOVE_FEAR_LADDER_STEP:
      return {
        ...state,
        steps: state.steps.filter((step: IStep) => step.id != action.payload.id)
      };
    case EDIT_FEAR_LADDER_STEP:
      return {
        ...state,
        steps: state.steps.map((step: IStep) => {
          return step.id == action.payload.id ? action.payload : step;
        })
      };
      return state;
    default:
      return state;
  }
};
