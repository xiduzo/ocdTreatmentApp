import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';

import { App, Content, NavParams, ModalController } from 'ionic-angular';

import * as _ from 'lodash';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { ExerciseMoodPage } from '../../exercise/mood/exercise.mood';

import { Exercise } from '../../../lib/Exercise';

@Component({
  selector: 'exercise-list-page',
  templateUrl: 'exercise.list.html'
})
export class ExerciseListPage {
  @ViewChild(Content) content: Content;

  private level:any;

  private options:NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    private appCtrl: App,
    private storage: Storage,
    private nativePageTransitions: NativePageTransitions
  ) {
    this.nativePageTransitions.slide(this.options);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
  }

  close() {
    this.appCtrl.getRootNavById('n4').pop();
  }

  selectStep(step) {
    if(step.fear.completion >= 100) return;

    this.storage.get('exercises').then((exercises) => {
      if(!exercises) exercises = []; // When it's the users' first time

      const exercise = new Exercise({
        start: new Date(),
        step: step
      });

      exercises.push(exercise);

      this.storage.set('exercises', exercises);

      const exerciseMoodModal = this.modalCtrl.create(ExerciseMoodPage, {
        level: this.level,
        exercise: exercise,
        before: true
      });

      exerciseMoodModal.present();
    });
  }

  finishExercise(step) {
    this.storage.get('fearLadder').then((fearLadder) => {
      if(!fearLadder) return;

      _.forEach(fearLadder, (ladderStep) => {
        if(ladderStep.id == step.id) {
          step.fear.completion = step.fear.completion < 100 ? 100 : 0;

          ladderStep.exercise = step.exercise;
        }
      });

      this.storage.set('fearLadder', fearLadder);

    });
  }


}
