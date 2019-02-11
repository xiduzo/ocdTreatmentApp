import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { mapRange } from '../../../lib/helpers';
import { Mood, Exercise } from '../../../lib/Exercise';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { ExerciseDuringModal } from '../during/exercise.during';
import { ExerciseTriggerModal } from '../trigger/exercise.trigger';
import { ExerciseSuccessModal } from '../success/exercise.success';

@Component({
  selector: 'page-exercise-mood',
  templateUrl: 'exercise.mood.html',
  animations: [
    trigger('trackMood', [
      state('content', style({ background: 'rgb(252, 201, 138)' })),
      state('ok', style({ background: 'rgb(145, 207, 204)' })),
      state('meh', style({ background: 'rgb(214, 217, 204)' })),
      state('panic', style({ background: 'rgb(240,120,121)' })),
      state('worried', style({ background: 'rgb(82, 156, 204)' })),
      transition('* => *', animate('350ms ease-in'))
    ])
  ]
})
export class ExerciseMoodPage {
  public mood: Mood = new Mood({ mood: 0 });

  public moodClass: string = 'content';
  public moodNumber: number = 1;

  private level: any;
  private exercise: Exercise;
  private beforeMeasure: boolean = false;

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private nativePageTransitions: NativePageTransitions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
    this.beforeMeasure = this.params.get('before');
  }

  setMood() {
    // We want to have a more accurate tracking for the therapist
    // But for the user we use a 1-5 scale
    this.moodNumber = Math.round(mapRange(this.mood.mood, 0, 500, 1, 5));

    switch (this.moodNumber) {
      case 1:
        this.moodClass = 'content';
        break;
      case 2:
        this.moodClass = 'ok';
        break;
      case 3:
        this.moodClass = 'meh';
        break;
      case 4:
        this.moodClass = 'worried';
        break;
      case 5:
        this.moodClass = 'panic';
        break;
    }
  }

  startExercise() {
    this.exercise.beforeMood = this.mood;

    this.storage.get('exercises').then((exercises) => {
      // The last exercise is allways the exercise we are working with
      // So lets overwrite the last entry
      exercises[exercises.length - 1] = this.exercise;

      this.storage.set('exercises', exercises);

      const duringModal = this.modalCtrl.create(ExerciseDuringModal, {
        level: this.level,
        exercise: this.exercise
      });

      duringModal.present();
      this.viewCtrl.dismiss();
    });

  }

  finishExercise() {
    this.exercise.afterMood = this.mood;

    this.storage.get('exercises').then((exercises) => {
      const hasATriggerEnabled = this.exercise.step.triggers.find(trigger => { return trigger.enabled });
      const modal = this.modalCtrl.create(hasATriggerEnabled ? ExerciseTriggerModal : ExerciseSuccessModal, {
        level: this.level,
        exercise: this.exercise
      });

      if (!hasATriggerEnabled) {
        this.exercise.end = new Date();
      }

      // The last exercise is allways the exercise we are working with
      // So lets overwrite the last entry
      exercises[exercises.length - 1] = this.exercise;
      this.storage.set('exercises', exercises);

      modal.present();
      this.viewCtrl.dismiss();
    });
  }

  stopExercise() {
    this.viewCtrl.dismiss();
  }

}
