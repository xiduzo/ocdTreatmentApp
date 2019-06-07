import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions/ngx';

import { confettiSettings } from '@/lib/Confetti';

declare var ConfettiGenerator: any;
import 'confetti-js';

import { Exercise } from '@/lib/Exercise';

import { Badge, BadgeFactory } from '@/lib/badge/Badge';
import { BadgeEarnedModal } from '@/modals/badgeEarned/badgeEarned';

import { EXERCISE_BADGE } from '@/lib/badge/templates/exercise';
import { FIRST_TIME_BADGE } from '@/lib/badge/templates/firstTime';
import { IStep, IExercise } from '@/stores/exercise/exercise.model';
import { ExerciseActions } from '@/stores/exercise/exercise.action';
import { FearLadderActions } from '@/stores/fearLadder/fearLadder.action';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {
  private level: IStep[];
  private exercise: IExercise = new Exercise();
  // public exerciseBadge: Badge = this.badgeFctry.createBadge(EXERCISE_BADGE);
  // public firstTimeBadge: Badge = this.badgeFctry.createBadge(FIRST_TIME_BADGE);

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  private showBadge: any = {
    modal: null,
    badge: null
  };

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private badgeFctry: BadgeFactory,
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
    const exercise: IExercise = new Exercise(this.exercise);
    exercise.end = new Date();
    exercise.step.fear.completion += exercise.getPointsForExercise();

    this.editExercise(exercise);
    this.editStep(exercise.step);
  }

  // updateExerciseBadges() {
  //   // this.exerciseBadge.addProgress(50).then(finishedStage => {
  //   //   // TODO: move this responsibility to the badge class
  //   //   if (finishedStage) {
  //   //     this.showBadge.modal = BadgeEarnedModal;
  //   //     this.showBadge.badge = this.exerciseBadge;
  //   //   }
  //   // });
  // }

  close() {
    // if (this.showBadge.modal && this.showBadge.badge) {
    //   const modal = this.modalCtrl.create(this.showBadge.modal, {
    //     badge: this.showBadge.badge
    //   });
    //   modal.present();
    // }
    // TODO: fix this with angular routing
    // this.viewCtrl.dismiss();
  }
}
