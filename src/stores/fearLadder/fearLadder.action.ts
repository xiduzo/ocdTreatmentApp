import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { Action } from '@ngrx/store';

import { IStep } from '@/stores/exercise/exercise.model';
import { IFearLadder } from '@/stores/fearLadder/fearLadder.model';
import {
  RECEIVED_FEAR_LADDER,
  REQUEST_FEAR_LADDER,
  ADD_FEAR_LADDER_STEP,
  REMOVE_FEAR_LADDER_STEP,
  EDIT_FEAR_LADDER_STEP
} from '@/stores/fearLadder/fearLadder.reducer';

import { Storage } from '@ionic/storage';

export class ReceivedFearLadderAction implements Action {
  readonly type: string = RECEIVED_FEAR_LADDER;
  constructor(public payload: IStep[]) {}
}

export class RequestFearLadderAction implements Action {
  readonly type: string = REQUEST_FEAR_LADDER;
  constructor() {}
}

export class AddFearLadderStepAction implements Action {
  readonly type: string = ADD_FEAR_LADDER_STEP;
  constructor(public payload: IStep) {}
}

export class RemoveFearLadderStepAction implements Action {
  readonly type: string = REMOVE_FEAR_LADDER_STEP;
  constructor(public payload: IStep) {}
}

export class EditFearLadderStepAction implements Action {
  readonly type: string = EDIT_FEAR_LADDER_STEP;
  constructor(public payload: IStep) {}
}

@Injectable()
export class FearLadderActions {
  constructor(private storage: Storage) {}
  @dispatch()
  receivedFearLadder = (steps: IStep[]): ReceivedFearLadderAction => ({
    type: RECEIVED_FEAR_LADDER,
    payload: steps
  });
  @dispatch()
  requestFearLadder = (): RequestFearLadderAction => ({
    type: REQUEST_FEAR_LADDER
  });
  @dispatch()
  addFearLadderStep = (step: IStep): AddFearLadderStepAction => ({
    type: ADD_FEAR_LADDER_STEP,
    payload: step
  });
  @dispatch()
  removeFearLadderStep = (step: IStep): RemoveFearLadderStepAction => ({
    type: REMOVE_FEAR_LADDER_STEP,
    payload: step
  });
  @dispatch()
  editFearLadderStep = (
    step: IStep,
    change: any
  ): EditFearLadderStepAction => ({
    type: EDIT_FEAR_LADDER_STEP,
    payload: { ...step, ...change }
  });
  loadFearLadder = (): any => {
    this.requestFearLadder();
    this.storage.get('fearLadder').then((fearLadder: IStep[]) => {
      this.receivedFearLadder(fearLadder ? fearLadder : []);
    });
  };
}
