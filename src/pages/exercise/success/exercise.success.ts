import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Storage } from '@ionic/storage';

declare var ConfettiGenerator: any;
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

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private nativePageTransitions: NativePageTransitions,
    private storage: Storage,
    private eventService: EventsService,
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
    this.updateStepCompletion();
  }

  ionViewDidEnter() {
    const confettiSettings = {
      target: 'confetti',
      clock: 10,
      max: 50,
    };
    // http://adripofjavascript.com/blog/drips/the-uses-of-in-vs-hasownproperty.html
    const confetti = new ConfettiGenerator(confettiSettings);
    if (Math.random() > 0) {
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
        this.eventService.broadcast('completed_exercise', this.exercise);
        this.storage.set('fearLadder', fearLadder);
      }
    });
  }


  close() {
    this.viewCtrl.dismiss();
  }

}
