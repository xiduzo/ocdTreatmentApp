import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { Action } from '@ngrx/store';

import { IStep } from '@/stores/exercise/exercise.model';
import { IFearLadder } from '@/stores/fearLadder/fearLadder.model';
import {
  LOAD_FEAR_LADDER,
  RECEIVED_FEAR_LADDER,
  REQUEST_FEAR_LADDER
} from '@/stores/fearLadder/fearLadder.reducer';

import { Storage } from '@ionic/storage';

export class FearLadderLoadFearLadderAction implements Action {
  readonly type: string = LOAD_FEAR_LADDER;
  constructor() {}
}

export class FearLadderReceivedFearLadderAction implements Action {
  readonly type: string = RECEIVED_FEAR_LADDER;
  constructor(public payload: IStep[]) {}
}

export class FearLadderRequestFearLadderAction implements Action {
  readonly type: string = REQUEST_FEAR_LADDER;
  constructor() {}
}

@Injectable()
export class FearLadderActions {
  constructor(private storage: Storage) {}
  @dispatch()
  receivedFearLadder = (
    steps: IStep[]
  ): FearLadderReceivedFearLadderAction => ({
    type: RECEIVED_FEAR_LADDER,
    payload: steps
  });
  @dispatch()
  requestFearLadder = (): FearLadderRequestFearLadderAction => ({
    type: REQUEST_FEAR_LADDER
  });
  loadFearLadder = (): any => {
    this.requestFearLadder();
    this.storage.get('fearLadder').then((fearLadder: IStep[]) => {
      this.receivedFearLadder(fearLadder ? fearLadder : []);
    });
  };
}
