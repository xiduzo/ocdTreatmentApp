import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';

import { App, Content, NavParams, ModalController } from 'ionic-angular';

import { UUID } from 'angular2-uuid';

import { ExerciseMoodPage } from '../../exercise/mood/exercise.mood';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'exercise-list-page',
  templateUrl: 'exercise.list.html',
  animations: [
    trigger('showLevelMonster', [
      state('void', style({transform: 'scale(0)'})),
      state('*', style({transform: 'scale(1)'})),
      transition('void => *', animate('300ms 150ms ease-in'))
    ]),
    trigger('showListItem', [
      state('void', style({opacity: '0'})),
      state('*', style({opacity: '1'})),
      transition('void => *', animate('100ms 400ms ease-in'))
    ]),
  ]
})
export class ExerciseListPage {
  @ViewChild(Content) content: Content;

  private level:any = {
    exercises: []
  };

  private tracking:any = {
    id: null,
    start: null,
    end: null,
    step: null,
    // erp: {
    //   start: null,
    //   end: null
    // },
    // beforeTriggers: [],
    // afterTriggers: [],
    // beforeMood: {
    //   mood: null,
    //   explanation: null
    // },
    // afterMood: {
    //   mood: null,
    //   explanation: null
    // }
    // exercise: null,
    // gaveInToCompulsion: false,
    // obsessiveThoughts: {
    //   rating: null,
    //   explanation: null
    // },
    // compulsiveBehaviour: {
    //   rating: null,
    //   explanation: null
    // },
    // erp: {
    //   start: null,
    //   end: null
    // }
  };

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    private appCtrl: App,
    private storage: Storage
  ) {

  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
  }

  close() {
    this.appCtrl.getRootNav().pop()
  }

  selectExercise(step) {
    if(step.exercise.completion >= 100) return;

    this.storage.get('exercises').then((exercises) => {
      if(!exercises) exercises = []; // When it's the users' first time

      this.tracking.id = UUID.UUID();
      this.tracking.start = new Date();
      this.tracking.step = step;

      // exercises.push(this.tracking);
      this.storage.set('exercises', exercises);

      let exerciseMoodModal = this.modalCtrl.create(ExerciseMoodPage, {level: this.level, tracking: this.tracking, before: true});
      exerciseMoodModal.present();
    });

  }


}
