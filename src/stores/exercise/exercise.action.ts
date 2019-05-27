import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { Action } from '@ngrx/store';

import { Storage } from '@ionic/storage';

import { IExercise } from '@/stores/exercise/exercise.model';

import {
  ADD_EXERCISE,
  REQUEST_EXERCISES,
  RECEIVED_EXERCISES
} from '@/stores/exercise/exercise.reducer';

export class ExerciseAddAction implements Action {
  readonly type: string = ADD_EXERCISE;
  constructor(public payload: IExercise) {}
}

export class ExerciseRequestExercisesAction implements Action {
  readonly type: string = REQUEST_EXERCISES;
  constructor() {}
}

export class ExerciseReceivedExercisesAction implements Action {
  readonly type: string = RECEIVED_EXERCISES;
  constructor(public payload: IExercise[]) {}
}

@Injectable()
export class ExerciseActions {
  constructor(private storage: Storage) {}
  @dispatch()
  addExercise = (exercise: IExercise): ExerciseAddAction => ({
    type: ADD_EXERCISE,
    payload: exercise
  });
  @dispatch()
  requestExercises = (): ExerciseRequestExercisesAction => ({
    type: REQUEST_EXERCISES
  });
  @dispatch()
  receivedExercises = (
    exercises: IExercise[]
  ): ExerciseReceivedExercisesAction => ({
    type: RECEIVED_EXERCISES,
    payload: exercises
  });
  loadExercises = (): any => {
    this.requestExercises();
    this.storage.get('exercises').then((exercises: IExercise[]) => {
      if (exercises) this.receivedExercises(exercises);
      else this.receivedExercises([]);
    });
  };
}
