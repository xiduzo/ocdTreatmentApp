import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { confettiSettings } from '@lib/Confetti';

declare var ConfettiGenerator: any;
import 'confetti-js';

import { Fear } from '@lib/Exercise';

import { IExercise, IFear } from '@stores/exercise/exercise.model';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { FearLadderActions } from '@stores/fearLadder/fearLadder.action';
import { calculateNewPoissonValue } from '@lib/poisson';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@stores/exercise/exercise.reducer';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {
  @select() readonly exercises$: Observable<IExerciseState>;
  private exerciseSubscription: Subscription;
  private currentExercise: IExercise;

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

    this.exerciseSubscription = this.exercises$.subscribe(
      (exerciseState: IExerciseState) => {
        this.currentExercise = { ...exerciseState.current };
      }
    );
  }

  ionViewWillEnter() {
    this.updateStepCompletion();
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
    const newPoissonValue = calculateNewPoissonValue(
      this.currentExercise.step.fear.poissonValue,
      this.currentExercise.beforeMood,
      this.currentExercise.afterMood
    );

    const fear: IFear = new Fear(this.currentExercise.step.fear);

    // When we increase the poissonValue, show some confetti!
    if (newPoissonValue > fear.poissonValue) this.renderConfetti();

    fear.poissonValue = newPoissonValue;

    this.exerciseActions.editExercise({
      end: new Date()
    });

    this.fearLadderActions.editFearLadderStep(this.currentExercise.step, {
      fear: fear
    });
  }
  close() {
    this.exerciseSubscription.unsubscribe();
    this.viewCtrl.dismiss();
  }
}
