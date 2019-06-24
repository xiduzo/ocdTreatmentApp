import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { confettiSettings } from '@lib/Confetti';

declare var ConfettiGenerator: any;
import 'confetti-js';

import { Exercise, Fear } from '@lib/Exercise';

import {
  IStep,
  IExercise,
  ITrigger,
  IFear
} from '@stores/exercise/exercise.model';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { FearLadderActions } from '@stores/fearLadder/fearLadder.action';
import { calculateNewPoissonValue } from '@lib/poisson';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@stores/exercise/exercise.reducer';
import { select } from '@angular-redux/store';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {
  @select() readonly exercises$: Observable<IExerciseState>;

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    public viewCtrl: ViewController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions,
    private fearLadderActions: FearLadderActions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
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

  updateStepCompletion() {
    this.exercises$.subscribe((exerciseState: IExerciseState) => {
      const newPoissonValue = calculateNewPoissonValue(
        exerciseState.current.step.fear.poissonValue,
        exerciseState.current.beforeMood,
        exerciseState.current.afterMood
      );

      const fear: IFear = new Fear(exerciseState.current.step.fear);
      fear.poissonValue = newPoissonValue;

      this.exerciseActions.editExercise({
        end: new Date()
      });

      this.fearLadderActions.editFearLadderStep(exerciseState.current.step, {
        fear: fear
      });
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
