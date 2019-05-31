import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { Action } from '@ngrx/store';

import { Storage } from '@ionic/storage';

import { IBadge } from '@/stores/badge/badge.model';

import { REQUEST_BADGES, RECEIVED_BADGES } from '@/stores/badge/badge.reducer';

class RequestBadgesAction implements Action {
  readonly type: string = REQUEST_BADGES;
}

class ReceivedBadgesAction implements Action {
  readonly type: string = RECEIVED_BADGES;
  constructor(public payload: IBadge[]) {}
}

@Injectable()
export class BadgeActions {
  constructor(private storage: Storage) {}
  @dispatch()
  requestBadges = (): RequestBadgesAction => ({
    type: REQUEST_BADGES
  });
  @dispatch()
  receivedBadges = (badges: IBadge[]): ReceivedBadgesAction => ({
    type: RECEIVED_BADGES,
    payload: badges
  });
  loadBadges = (): any => {
    this.requestBadges();
    this.storage.get('badges').then((badges: IBadge[]) => {
      this.receivedBadges(badges ? badges : []);
    });
  };
}
