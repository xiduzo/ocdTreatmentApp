import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {

  public level:any;
  public exercise:any;
  private tracking:any;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController
  ) {

  }

  ionViewDidLoad() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
  }

  ionViewWillEnter() {
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
