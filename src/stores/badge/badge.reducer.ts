import { Reducer } from 'redux'
import { IBadge } from '@stores/badge/badge.model'

import { STREAK_BADGE } from '@lib/badge/templates/streak'
import { FIRST_TIME_BADGE } from '@lib/badge/templates/firstTime'
import { EXERCISE_BADGE } from '@lib/badge/templates/exercise'

export interface IBadgeState {
  list: IBadge[]
  loading: boolean
  errors: any[]
}

export const INITIAL_BADGE_STATE: IBadgeState = {
  list: [ STREAK_BADGE, FIRST_TIME_BADGE, EXERCISE_BADGE ],
  loading: true,
  errors: [],
}

export const REQUEST_BADGES = 'REQUEST_BADGES'
export const RECEIVED_BADGES = 'RECEIVED_BADGES'
export const UPDATE_BADGE_PROGRESS = 'UPDATE_BADGE_PROGRESS'

export const badgeReducer: Reducer<IBadgeState> = (state: IBadgeState, action) => {
  switch (action.type) {
    case REQUEST_BADGES:
      return { ...state, loading: true }
    case RECEIVED_BADGES:
      const combinedBadges: IBadge[] = state.list.map((stateBadge: IBadge): IBadge => {
        // See if we also have the badge in our local storage
        const actionPayLoadBadge: IBadge = action.payload.find(
          (payloadBadge: IBadge): boolean =>
            // Match on name
            payloadBadge.name === stateBadge.name
        )

        // If we have a local badge, update the state badge
        return actionPayLoadBadge
          ? {
              ...stateBadge,
              totalPointsGained: actionPayLoadBadge.totalPointsGained,
            }
          : stateBadge
      })

      return {
        ...state,
        list: combinedBadges,
        loading: false,
      }
    case UPDATE_BADGE_PROGRESS:
      console.log(action.payload)
      return {
        ...state,
        list: state.list.map((badge: IBadge) => {
          return badge.name === action.payload.name ? { ...badge, ...action.payload } : badge
        }),
      }
    default:
      return state
  }
}
