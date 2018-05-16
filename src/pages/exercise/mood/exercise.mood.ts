import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';

import { Restangular } from 'ngx-restangular';

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
      transition('* => *', animate('450ms ease-in'))
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
  private moodNumber:number = 1;
  public moodReason:string;
  public moodAngle:number = 0;

  public level:any;
  public exercise:any;

  public beforeMeasure:boolean = false;

  private tracking:any;

  private dbLink:string;

  private moodAngleElement:any;

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

  ionViewDidEnter() {
    // Hacking a number into the graph
    // TODO:
    // Implement this in the library itself (maybe make pull request)
    document.querySelectorAll('ngx-cs-slider g g')[0].innerHTML += '<text text-anchor="middle" font-weight="bold" fill="#222" dy=".35em">'+this.moodNumber+'</text>'
    this.moodAngleElement = document.querySelectorAll('ngx-cs-slider g g text')[0];
  }

  setMood(event) {
    this.moodAngle = event.angleLength;

    if(event.angleLength <= (Math.PI*2 / this.props.segments * 1)) {
      this.mood = 'content';
      this.moodNumber = 1;
    } else if(event.angleLength <= (Math.PI*2 / this.props.segments * 2)) {
      this.mood = 'ok';
      this.moodNumber = 2;
    } else if(event.angleLength <= (Math.PI*2 / this.props.segments * 3)) {
      this.mood = 'meh';
      this.moodNumber = 3;
    } else if(event.angleLength <= (Math.PI*2 / this.props.segments * 4)) {
      this.mood = 'worried';
      this.moodNumber = 4;
    } else if(event.angleLength <= (Math.PI*2 / this.props.segments * 5)) {
      this.mood = 'panic';
      this.moodNumber = 5;
    }

    // Set moodAngle in graph
    if(this.moodAngleElement) this.moodAngleElement.innerHTML = this.moodNumber;
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

    this.tracking.beforeMood.mood = this.moodNumber;
    this.tracking.beforeMood.angle = Math.floor(this.moodAngle * 100);
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
    this.tracking.afterMood.mood = this.moodNumber;
    this.tracking.afterMood.angle = this.moodAngle;
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
