import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';


import { ExerciseSuccessModal } from '../success/exercise.success';

@Component({
  selector: 'page-exercise-after',
  templateUrl: 'exercise.after.html'
})
export class ExerciseAfterModal {

  public level:any;
  public exercise:any;

  public range:any = { min: 0, max: 5 };

  public obsessiveThoughts:number = 0;
  public obsessiveThoughtsReason:string;
  public compulsiveBehaviour:number = 0;
  public compulsiveBehaviourReason:string;

  public tracking:any;
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


  done() {
    this.tracking.obsessiveThoughts.rating = this.obsessiveThoughts;
    this.tracking.obsessiveThoughts.explanation = this.obsessiveThoughtsReason;
    this.tracking.compulsiveBehaviour.rating = this.compulsiveBehaviour;
    this.tracking.compulsiveBehaviour.explanation = this.compulsiveBehaviourReason;

    this.tracking.end = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length-1] = this.tracking;
      this.storage.set('exercises', exercises);

      console.log(exercises);

      let successModal = this.modalCtrl.create(ExerciseSuccessModal, {level: this.level, exercise: this.exercise, tracking: this.tracking, dbLink: this.dbLink });
      successModal.present();
      this.viewCtrl.dismiss();
    });


  }

}
