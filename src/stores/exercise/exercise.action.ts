import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { Action } from '@ngrx/store';

import { Storage } from '@ionic/storage';

import { IExercise } from '@stores/exercise/exercise.model';

import {
  ADD_EXERCISE,
  REQUEST_EXERCISES,
  RECEIVED_EXERCISES,
  EDIT_EXERCISE
} from '@stores/exercise/exercise.reducer';

class AddExerciseAction implements Action {
  readonly type: string = ADD_EXERCISE;
  constructor(public payload: IExercise) {}
}

class RequestExercisesAction implements Action {
  readonly type: string = REQUEST_EXERCISES;
  constructor() {}
}

class ReceivedExercisesAction implements Action {
  readonly type: string = RECEIVED_EXERCISES;
  constructor(public payload: IExercise[]) {}
}

class EditExerciseAction implements Action {
  readonly type: string = EDIT_EXERCISE;
  constructor(public payload: IExercise) {}
}

@Injectable()
export class ExerciseActions {
  constructor(private storage: Storage) {}
  @dispatch()
  addExercise = (exercise: IExercise): AddExerciseAction => ({
    type: ADD_EXERCISE,
    payload: exercise
  });
  @dispatch()
  requestExercises = (): RequestExercisesAction => ({
    type: REQUEST_EXERCISES
  });
  @dispatch()
  receivedExercises = (exercises: IExercise[]): ReceivedExercisesAction => ({
    type: RECEIVED_EXERCISES,
    payload: exercises
  });
  @dispatch()
  editExercise = (exercise: IExercise, change: any): EditExerciseAction => ({
    type: EDIT_EXERCISE,
    payload: { ...exercise, ...change }
  });
  loadExercises = (): any => {
    this.requestExercises();
    this.storage.get('exercises').then((exercises: IExercise[]) => {
      this.receivedExercises(exercises ? exercises : []);
    });
  };
}
