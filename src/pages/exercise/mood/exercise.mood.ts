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
  public level:any;
  public exercise:any;
  public beforeMeasure:boolean = false;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewWillEnter() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    // console.log(this.exercise)

    if(this.params.get('before')) this.beforeMeasure = this.params.get('before');
  }

  setMood(event) {
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

  stopExercise() {
    this.viewCtrl.dismiss(false);
  }

  startExercise() {
    let duringModal = this.modalCtrl.create(ExerciseDuringModal, {level: this.level, exercise: this.exercise});
    duringModal.present();
  }

}
