import { Component } from '@angular/core';

import { App, NavParams, ModalController } from 'ionic-angular';

import { ExerciseMoodModal } from '@/modals/exercise/mood/exercise.mood';

import { Exercise } from '@/lib/Exercise';

import { FEAR_COMPLETION_POSITIVE_LIMIT } from '@/lib/constants';

import { IStep, IExercise } from '@/stores/exercise/exercise.model';

import { getLevelCompletion } from '@/lib/Level';
import { ExerciseActions } from '@/stores/exercise/exercise.action';
import { IFearLadder } from '@/stores/fearLadder/fearLadder.model';

@Component({
  selector: 'exercise-list-page',
  templateUrl: 'exercise.list.html'
})
export class ExerciseListModal {
  public FEAR_COMPLETION_POSITIVE_LIMIT: number = FEAR_COMPLETION_POSITIVE_LIMIT;
  public level: IFearLadder;

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
    if (step.fear.completion >= FEAR_COMPLETION_POSITIVE_LIMIT) return;

    const exercise: IExercise = new Exercise({
      start: new Date(),
      step: step
    });

    const exerciseMoodModal = this.modalCtrl.create(ExerciseMoodModal, {
      level: this.level,
      exercise: exercise,
      before: true
    });

    this.exerciseActions.addExercise(exercise);

    exerciseMoodModal.present();
  }
}
