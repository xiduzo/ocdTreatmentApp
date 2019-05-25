import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { Action } from '@ngrx/store';

import { Storage } from '@ionic/storage';

import { IExercise } from '@/stores/exercise/exercise.model';

import {
  ADD_EXERCISE,
  LOAD_EXERCISES
} from '@/stores/exercise/exercise.reducer';

export class ExerciseAddAction implements Action {
  readonly type: string = ADD_EXERCISE;
  constructor(public payload: IExercise) {}
}

export class ExerciseLoadExercisesAction implements Action {
  readonly type: string = LOAD_EXERCISES;
  constructor() {
    console.log(true);
  }
}

@Injectable()
export class ExerciseActions {
  @dispatch()
  addExercise = (exercise: IExercise): ExerciseAddAction => ({
    type: ADD_EXERCISE,
    payload: exercise
  });
  @dispatch()
  loadExercises = (): ExerciseLoadExercisesAction => ({
    type: LOAD_EXERCISES
  });
}
