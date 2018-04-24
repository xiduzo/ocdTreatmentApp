import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'page-exercise-during',
  templateUrl: 'exercise.during.html',
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
export class ExerciseDuringModal {

  public level:any;
  public exercise:any;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    // console.log(this.exercise)
  }


  startExercise() {
    // let duringModal = this.modalCtrl.create(ExerciseMoodPage, {level: this.level, exercise: this.exercise});
    // duringModal.present();
  }

}
