import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { confettiSettings } from '@/lib/Confetti';

declare var ConfettiGenerator: any;
import 'confetti-js';

import { Exercise } from '@/lib/Exercise';

import { IStep, IExercise } from '@/stores/exercise/exercise.model';
import { ExerciseActions } from '@/stores/exercise/exercise.action';
import { FearLadderActions } from '@/stores/fearLadder/fearLadder.action';
import { calculateNewPoissonValue } from '@/lib/poisson';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {
  private exercise: IExercise;

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions,
    private fearLadderActions: FearLadderActions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.exercise = this.params.get('exercise');
    this.updateStepCompletion();
  }

  ionViewDidEnter() {
    // TODO decide when to show the confetti, don't want to show it each time (i think)
    if (Math.random() > 0) {
      this.renderConfetti();
    }
  }

  renderConfetti() {
    try {
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    } catch (e) {
      console.log(e);
    }
  }

  editExercise(change: IExercise): IExercise {
    this.exerciseActions.editExercise(this.exercise, change);

    return { ...this.exercise, ...change };
  }

  editStep(change: IStep): void {
    this.fearLadderActions.editFearLadderStep(this.exercise.step, change);
  }

  updateStepCompletion() {
    const exercise: IExercise = { ...this.exercise };
    exercise.end = new Date();
    console.log('poisson', exercise.step.fear.poissonValue);
    exercise.step.fear.poissonValue = calculateNewPoissonValue(
      exercise.step.fear.poissonValue,
      exercise.beforeMood,
      exercise.afterMood
    );

    this.editExercise(exercise);
    this.editStep(exercise.step);
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
