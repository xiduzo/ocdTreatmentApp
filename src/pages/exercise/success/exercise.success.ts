import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Exercise } from '../../../lib/Exercise';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {

  public level:any;
  public exercise:Exercise;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController
  ) {

  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
    console.log(this.exercise);
  }

  ionViewDidLoad() {
  }


  close() {
    this.viewCtrl.dismiss();
  }

}
