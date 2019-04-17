import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Storage } from '@ionic/storage';

declare var ConfettiGenerator: any;
import "confetti-js";

import { Exercise } from '@/lib/Exercise';
import { Level } from '@/lib/Level';

import { EventsService } from 'angular-event-service';

import { Badge, BadgeFactory } from '@/lib/badge/Badge';
import { BadgeEarnedModal } from '@/modals/badgeEarned/badgeEarned';

import { EXERCISE_BADGE } from '@/lib/badge/templates/exercise';
import { FIRST_TIME_BADGE } from '@/lib/badge/templates/firstTime';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {

  public level: Level;
  public exercise: Exercise;
  public exerciseBadge: Badge = this.badgeFctry.createBadge(EXERCISE_BADGE);
  public firstTimeBadge: Badge = this.badgeFctry.createBadge(FIRST_TIME_BADGE);

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  private showBadge: any = {
    modal: null,
    badge: null,
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private storage: Storage,
    private eventService: EventsService,
    private badgeFctry: BadgeFactory,
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
    this.updateStepCompletion();
  }

  ionViewDidEnter() {
    // TODO decide when to show the confetti, dont want to show it each time (i think)
    if (Math.random() > 0) {
      const confettiSettings = {
        target: 'confetti',
        clock: 10,
        max: 50,
      };

      const confetti = new ConfettiGenerator(confettiSettings);

      confetti.render();
    }
  }

  updateStepCompletion() {
    this.storage.get('fearLadder').then(fearLadder => {
      try {
        const step = fearLadder.find(step => step.id === this.exercise.step.id);
        if (step) {
          this.exercise.step.fear.completion += this.exercise.getPointsForExercise();
          step.fear.completion = this.exercise.step.fear.completion;
        }
      } catch (err) {
        console.log(`err: ${err}`);
      } finally {
        this.updateExerciseBadge();
        this.eventService.broadcast('completed_exercise', this.exercise);
        this.storage.set('fearLadder', fearLadder);
      }
    });
  }

  updateExerciseBadge() {
    this.exerciseBadge.addProgress(50)
      .then(finishedStage => {
        // TODO: move this responsibility to the badge class
        if (finishedStage) {
          this.showBadge.modal = BadgeEarnedModal;
          this.showBadge.badge = this.exerciseBadge;
        }
        this.eventService.broadcast('badge_update', this.exerciseBadge)
      });
  }



  close() {
    if (this.showBadge.modal && this.showBadge.badge) {
      const modal = this.modalCtrl.create(this.showBadge.modal, {
        badge: this.showBadge.badge
      });
      modal.present();
    }
    this.viewCtrl.dismiss();
  }

}
