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
  public tracking:any;

  public range:any = { min: 0, max: 5 };

  public obsessiveThoughts:number = 0;
  public obsessiveThoughtsReason:string;
  public compulsiveBehaviour:number = 0;
  public compulsiveBehaviourReason:string;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private storage: Storage
  ) {

  }

  ionViewDidLoad() {
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
    // TODO show only triggers the user selected
  }


  done() {
    this.tracking.triggers = [];

    // TODO use only the triggers the user selected
    this.tracking.step.triggers.forEach(trigger => {
        console.log(trigger);
    });
    this.tracking.obsessiveThoughts.rating = this.obsessiveThoughts;
    this.tracking.obsessiveThoughts.explanation = this.obsessiveThoughtsReason;
    this.tracking.compulsiveBehaviour.rating = this.compulsiveBehaviour;
    this.tracking.compulsiveBehaviour.explanation = this.compulsiveBehaviourReason;

    this.tracking.end = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length-1] = this.tracking;
      this.storage.set('exercises', exercises);

      console.log(exercises);

      let successModal = this.modalCtrl.create(ExerciseSuccessModal, {level: this.level, tracking: this.tracking });
      successModal.present();
      this.viewCtrl.dismiss();
    });


  }

}
