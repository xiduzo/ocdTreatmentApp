import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { ExerciseMoodPage } from '../mood/exercise.mood';

import { Exercise } from '../../../lib/Exercise';

@Component({
  selector: 'page-exercise-during',
  templateUrl: 'exercise.during.html'
})
export class ExerciseDuringModal {

  private level:any;
  private exercise:Exercise;

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

  ionViewDidLoad() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
  }

  ionViewWillEnter() {
    this.exercise.erp.start = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length - 1] = this.exercise;
      this.storage.set('exercises', exercises);
    });
  }

  finishExercise(succeed) {
    // Check if the user gave in to his compulsion
    this.exercise.erp.gaveInToCompulsion = succeed;

    this.exercise.erp.end = new Date();

    this.storage.get('exercises').then((exercises) => {
      exercises[exercises.length - 1] = this.exercise;
      this.storage.set('exercises', exercises);

      let moodModal = this.modalCtrl.create(ExerciseMoodPage, {
        level: this.level,
        exercise: this.exercise,
        before: false }
      );

      moodModal.present();
      this.viewCtrl.dismiss();
    });

  }

}
