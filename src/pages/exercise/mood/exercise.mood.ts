import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';

import { map } from '../../../lib/helpers';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { ExerciseDuringModal } from '../during/exercise.during';
import { ExerciseTriggerModal } from '../trigger/exercise.trigger';

@Component({
  selector: 'page-exercise-mood',
  templateUrl: 'exercise.mood.html',
  animations: [
    trigger('trackMood', [
      state('content', style({background: 'rgb(252, 201, 138)'})),
      state('ok', style({background: 'rgb(145, 207, 204)'})),
      state('meh', style({background: 'rgb(214, 217, 204)'})),
      state('panic', style({background: 'rgb(240,120,121)'})),
      state('worried', style({background: 'rgb(82, 156, 204)'})),
      transition('* => *', animate('350ms ease-in'))
    ])
  ]
})
export class ExerciseMoodPage {
  public props:any = {
    segments: 5,
    strokeWidth: 40,
    radius: 150,
    gradientColorFrom: '#F2EAD7',
    gradientColorTo: '#F2EAD7',
    bgCircleColor: '#F2EAD7',
    showClockFace: false
  }

  public mood:string = 'content';
  public moodNumber:number = 1;
  public moodTrack:number = 0;
  public moodReason:string;

  public level:any;
  public exercise:any;

  public beforeMeasure:boolean = false;

  private tracking:any;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private storage: Storage
  ) {

  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
    this.beforeMeasure = this.params.get('before');
  }

  setMood(number) {
    // We want to have a more accurate tracking for the therapist
    // But for the user we use a 1-5 scale
    this.moodNumber = Math.round(map(this.moodTrack, 0, 500, 1, 5));

    switch(this.moodNumber) {
      default:
        this.mood = 'content';
        break;
      case 2:
        this.mood = 'ok';
        break;
      case 3:
        this.mood = 'meh';
        break;
      case 4:
        this.mood = 'worried';
        break;
      case 5:
        this.mood = 'panic';
        break;
    }
  }

  startExercise() {
    this.tracking.beforeMood = {};
    this.tracking.beforeMood.mood = this.moodTrack;
    this.tracking.beforeMood.explanation = this.moodReason;

    this.storage.get('exercises').then((exercises) => {
      // The last exercise is allways the exercise we are working with
      // So lets overwrite the last entry
      exercises[exercises.length-1] = this.tracking;

      this.storage.set('exercises', exercises);

      let duringModal = this.modalCtrl.create(ExerciseDuringModal, {level: this.level, tracking: this.tracking });
      duringModal.present();
      this.viewCtrl.dismiss();
    });

  }

  finishExercise() {
    this.tracking.afterMood = {};
    this.tracking.afterMood.mood = this.moodTrack;
    this.tracking.afterMood.explanation = this.moodReason;

    this.storage.get('exercises').then((exercises) => {
      // The last exercise is allways the exercise we are working with
      // So lets overwrite the last entry
      exercises[exercises.length-1] = this.tracking;
      this.storage.set('exercises', exercises);

      let triggerModal = this.modalCtrl.create(ExerciseTriggerModal, {level: this.level, tracking: this.tracking });
      triggerModal.present();
      this.viewCtrl.dismiss();
    });
  }

  stopExercise() {
    this.viewCtrl.dismiss();
  }

}
