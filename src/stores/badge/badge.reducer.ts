import { Reducer } from 'redux';
import { IBadge } from './badge.model';

export interface IBadgeState {
  list: IBadge[];
  loading: boolean;
  errors: any[];
}

export const REQUEST_BADGES = 'REQUEST_BADGES';
export const RECEIVED_BADGES = 'RECEIVED_BADGES';

export const badgeReducer: Reducer<IBadgeState> = (
  state: IBadgeState,
  action
) => {
  switch (action.type) {
    case REQUEST_BADGES:
      return { ...state, loading: true };
    case RECEIVED_BADGES:
      return {
        ...state,
        list: [...state.list, ...action.payload],
        loading: false
      };
    default:
      return state;
  }
};
