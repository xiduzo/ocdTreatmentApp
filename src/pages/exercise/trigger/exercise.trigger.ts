import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';


import { ExerciseSuccessModal } from '../success/exercise.success';

@Component({
  selector: 'page-exercise-trigger',
  templateUrl: 'exercise.trigger.html'
})
export class ExerciseTriggerModal {

  public level:any;
  public tracking:any;
  public triggers:any;

  public range:any = { min: 0, max: 5 };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private storage: Storage
  ) {

  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');

    // Only use triggers the user selected
    this.triggers = this.tracking.step.triggers.filter(trigger => { return trigger.enabled});

    // Skip screen if we didn't set any triggers
    if(this.triggers.length < 1) {
      this.done();
    }
  }

  done() {
    this.tracking.step.triggers = this.triggers;
    this.tracking.end = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length-1] = this.tracking;
      this.storage.set('exercises', exercises);

      let successModal = this.modalCtrl.create(ExerciseSuccessModal, {level: this.level, tracking: this.tracking });
      successModal.present();
      this.viewCtrl.dismiss();
    });


  }

}
