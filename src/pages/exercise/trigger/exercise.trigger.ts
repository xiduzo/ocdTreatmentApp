import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { ExerciseSuccessModal } from '../success/exercise.success';

import { Trigger, Exercise } from '../../../lib/Exercise';

@Component({
  selector: 'page-exercise-trigger',
  templateUrl: 'exercise.trigger.html'
})
export class ExerciseTriggerModal {

  public level:any;
  public exercise:Exercise;
  public triggers:Array<Trigger>;

  public range:any = { min: 0, max: 5 };

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private nativePageTransitions: NativePageTransitions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');

    // Only use triggers the user selected
    this.triggers = this.exercise.step.triggers.filter(trigger => {
      return trigger.enabled;
    });

    // Skip screen if we didn't set any triggers
    if(this.triggers.length < 1) {
      this.done();
    }
  }

  done() {
    this.exercise.end = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length-1] = this.exercise;
      this.storage.set('exercises', exercises);

      let successModal = this.modalCtrl.create(ExerciseSuccessModal, {
        level: this.level,
        exercise: this.exercise
      });

      successModal.present();
      this.viewCtrl.dismiss();
    });
  }

}
