import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Storage } from '@ionic/storage';

import "confetti-js";

import { Exercise } from '../../../lib/Exercise';

import { EventsService } from 'angular-event-service';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {

  public level: any;
  public exercise: Exercise;

  private options: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private nativePageTransitions: NativePageTransitions,
    private storage: Storage,
    private eventService: EventsService,
  ) {
    this.nativePageTransitions.slide(this.options);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
    this.calculateRating();
  }

  ionViewDidLoad() {
    const confettiSettings = {
      target: 'confetti',
      clock: 10,
      max: 50,
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    if(Math.random() > 0.7) {
      confetti.render();
    }
  }

  updateStepCompletion() {
    let points = 0;

    // Mood diff
    points += (this.exercise.beforeMood.mood - this.exercise.afterMood.mood) * 0.25;

    // fearRating
    points += this.exercise.step.fearRating * 5;

    // triggers
    this.exercise.step.triggers.forEach(trigger => {
      points += trigger.range * -7.5;
    });

    // duration
    points += this.exercise.getErpTimeDifference() / this.exercise.getTotalTimeDifference() * 25;

    this.updateStepCompletion(this.exercise.step, points)
  }

  updateStepCompletion(exerciseStep, points) {
    this.storage.get('fearLadder').then(fearLadder => {
      try {
        const step = fearLadder.find(step => step.id === this.exercise.step.id);
        if(step) {
          this.exercise.step.fear.completion += this.exercise.getPointsForExercise();
          step.fear.completion = this.exercise.step.fear.completion;
        }
      } catch (err) {
        console.log(`err: ${err}`);
      } finally {
        this.eventService.broadcast('completed_exercise', this.exercise);
        this.storage.set('fearLadder', fearLadder);
      }
    });
  }


  close() {
    this.viewCtrl.dismiss();
  }

}
