import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Storage } from '@ionic/storage';

import { Exercise } from '../../../lib/Exercise';

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
  ) {
    this.nativePageTransitions.slide(this.options);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
    this.calculateRating();
  }

  ionViewDidLoad() {
  }

  calculateRating() {
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
        // TODO: update step in list view (maybe with an broadcast)
        fearLadder.find(step => step.id === exerciseStep.id).fear.completion += points;
      } catch (err) {
        console.log(`err: ${err}`);
      } finally {
        this.storage.set('fearLadder', fearLadder);
      }
    });
  }


  close() {
    this.viewCtrl.dismiss();
  }

}
