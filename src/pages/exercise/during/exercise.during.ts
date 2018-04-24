import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';

import { ExerciseMoodPage } from '../mood/exercise.mood';

@Component({
  selector: 'page-exercise-during',
  templateUrl: 'exercise.during.html'
})
export class ExerciseDuringModal {

  public level:any;
  public exercise:any;
  private tracking:any;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
  }

  ionViewWillEnter() {
    this.tracking.exercise.start = new Date();
  }

  finishExercise(succeed) {
    if(!succeed) this.tracking.gaveInToCompulsion = true;
    
    this.tracking.exercise.end = new Date();

    let moodModal = this.modalCtrl.create(ExerciseMoodPage, {level: this.level, exercise: this.exercise, before: false, tracking: this.tracking});
    moodModal.present();
    this.viewCtrl.dismiss();
  }

}
