import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';

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
  public moodReason:string;
  public moodAngle:number;

  public level:any;
  public exercise:any;

  public beforeMeasure:boolean = false;

  private tracking:any;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewWillEnter() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
    this.beforeMeasure = this.params.get('before');

  }

  setMood(event) {
    this.moodAngle = event.angleLength;

    if(event.angleLength <= (6.24 / this.props.segments * 1)) {
      this.mood = 'content';
    } else if(event.angleLength <= (6.24 / this.props.segments * 2)) {
      this.mood = 'ok';
    } else if(event.angleLength <= (6.24 / this.props.segments * 3)) {
      this.mood = 'meh';
    } else if(event.angleLength <= (6.24 / this.props.segments * 4)) {
      this.mood = 'panic';
    } else if(event.angleLength <= (6.24 / this.props.segments * 5)) {
      this.mood = 'worried';
    }
  }

  startExercise() {
    this.tracking.beforeMood.mood = this.mood;
    this.tracking.beforeMood.angle = this.moodAngle;
    this.tracking.beforeMood.explanation = this.moodReason;

    let duringModal = this.modalCtrl.create(ExerciseDuringModal, {level: this.level, exercise: this.exercise, tracking: this.tracking });
    duringModal.present();
    this.viewCtrl.dismiss();
  }

  finishExercise() {
    this.tracking.afterMood.mood = this.mood;
    this.tracking.afterMood.angle = this.moodAngle;
    this.tracking.afterMood.explanation = this.moodReason;

    let afterModal = this.modalCtrl.create(ExerciseAfterModal, {level: this.level, exercise: this.exercise, tracking: this.tracking });
    afterModal.present();
    this.viewCtrl.dismiss();
  }

  stopExercise() {
    this.viewCtrl.dismiss();
  }

}
