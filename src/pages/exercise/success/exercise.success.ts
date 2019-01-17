import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { Exercise } from '../../../lib/Exercise';

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html'
})
export class ExerciseSuccessModal {

  public level: any;
  public exercise: Exercise;

  private options: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private nativePageTransitions: NativePageTransitions,
  ) {
    this.nativePageTransitions.slide(this.options);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
  }

  ionViewDidLoad() {
  }


  close() {
    this.viewCtrl.dismiss();
  }

}
