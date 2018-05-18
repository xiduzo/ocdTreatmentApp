import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';

import { Restangular } from 'ngx-restangular';

import { map } from '../../../lib/helpers';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { ExerciseDuringModal } from '../during/exercise.during';
import { ExerciseAfterModal } from '../after/exercise.after';

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

  private dbLink:string;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private restangular: Restangular,
    private storage: Storage
  ) {

  }

  ionViewWillEnter() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
    this.beforeMeasure = this.params.get('before');
    this.dbLink = this.params.get('dbLink');
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
    // Create db entry
    // this.restangular.all('ladders/exerciseExecution/').post({
    //   exercise: this.exercise.id
    // })
    // .toPromise()
    // .then((response) => {
    //   let exerciseExecution = response.data;
    //
    //   this.tracking.beforeMood.mood = this.moodNumber;
    //   this.tracking.beforeMood.angle = Math.floor(this.moodAngle * 100);
    //   this.tracking.beforeMood.explanation = this.moodReason;
    //
    //   this.restangular.all('ladders/exerciseMood').post({
    //     mood: this.tracking.beforeMood.mood,
    //     angle: this.tracking.beforeMood.angle / 100,
    //     explanation: this.tracking.beforeMood.explanation
    //   })
    //   .toPromise()
    //   .then((response) => {
    //     exerciseExecution.beforeMood = response.data.id;
    //     exerciseExecution.patch();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    //
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    this.tracking.beforeMood.mood = this.moodTrack;
    this.tracking.beforeMood.explanation = this.moodReason;


    this.storage.get('exercises').then((exercises) => {
      // The last exercise is allways the exercise we are working with
      // So lets overwrite the last entry
      exercises[exercises.length-1] = this.tracking;

      this.storage.set('exercises', exercises);

      let duringModal = this.modalCtrl.create(ExerciseDuringModal, {level: this.level, exercise: this.exercise, tracking: this.tracking });
      duringModal.present();
      this.viewCtrl.dismiss();
    });

  }

  finishExercise() {
    this.tracking.afterMood.mood = this.moodTrack;
    this.tracking.afterMood.explanation = this.moodReason;

    this.storage.get('exercises').then((exercises) => {
      // The last exercise is allways the exercise we are working with
      // So lets overwrite the last entry
      exercises[exercises.length-1] = this.tracking;
      this.storage.set('exercises', exercises);

      let afterModal = this.modalCtrl.create(ExerciseAfterModal, {level: this.level, exercise: this.exercise, tracking: this.tracking });
      afterModal.present();
      this.viewCtrl.dismiss();
    });
  }

  stopExercise() {
    this.viewCtrl.dismiss();
  }

}
