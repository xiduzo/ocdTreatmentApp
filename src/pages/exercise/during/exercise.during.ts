import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

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
  private dbLink:string;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private storage: Storage
  ) {

  }

  ionViewDidLoad() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
    this.dbLink = this.params.get('dbLink');
  }

  ionViewWillEnter() {
    this.tracking.erp.start = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length - 1] = this.tracking;
      this.storage.set('exercises', exercises);
    });
  }

  finishExercise(succeed) {
    if(!succeed) this.tracking.gaveInToCompulsion = true;

    this.tracking.erp.end = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length - 1] = this.tracking;
      this.storage.set('exercises', exercises);

      let moodModal = this.modalCtrl.create(ExerciseMoodPage, {level: this.level, exercise: this.exercise, before: false, tracking: this.tracking });
      moodModal.present();
      this.viewCtrl.dismiss();
    });

  }

}
