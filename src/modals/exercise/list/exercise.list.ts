import { Component } from '@angular/core';

import { App, NavParams, ModalController } from 'ionic-angular';

import { ExerciseMoodModal } from '@modals/exercise/mood/exercise.mood';

import { Exercise } from '@lib/Exercise';

import { POISSON_THRESHOLD } from '@lib/constants';

import { IStep, IExercise } from '@stores/exercise/exercise.model';

import { getLevelCompletion } from '@lib/Level';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { IFearLadder } from '@stores/fearLadder/fearLadder.model';

@Component({
  selector: 'exercise-list-page',
  templateUrl: 'exercise.list.html'
})
export class ExerciseListModal {
  public level: IFearLadder;
  public POISSON_THRESHOLD: number = POISSON_THRESHOLD;

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    private appCtrl: App,
    private exerciseActions: ExerciseActions
  ) {
    this.level = this.params.get('level');
  }

  close() {
    this.appCtrl.getRootNav().pop();
  }

  selectStep(step: IStep) {
    // We can't start an exercise when you've completed it
    if ((step.fear.poissonValue * 100) / POISSON_THRESHOLD >= 100) return;

    const exercise: IExercise = new Exercise({
      start: new Date(),
      step: step
    });

    const exerciseMoodModal = this.modalCtrl.create(ExerciseMoodModal, {
      before: true
    });

    this.exerciseActions.selectExercise(exercise);
    this.exerciseActions.addExercise(exercise);

    exerciseMoodModal.present();
  }
}
