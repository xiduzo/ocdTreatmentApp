import { Component, ViewChild } from '@angular/core';
import { App, Content, NavParams, ModalController } from 'ionic-angular';

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
    beforeMood: {
      mood: null,
      angle: null,
      explanation: null
    },
    afterMood: {
      mood: null,
      angle: null,
      explanation: null
    },
    gaveInToCompulsion: false,
    obsessiveThoughts: {
      rating: null,
      explanation: null
    },
    compulsiveBehaviour: {
      rating: null,
      explanation: null
    },
    exercise: {
      start: null,
      end: null
    }
  };

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    private appCtrl: App
  ) {

  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    console.log(this.level);
  }

  close() {
    this.appCtrl.getRootNav().pop()
  }

  selectExercise(exercise) {
    if(exercise.completed) return;

    let exerciseMoodModal = this.modalCtrl.create(ExerciseMoodPage, {level: this.level, exercise: exercise, before: true, tracking: this.tracking});
    exerciseMoodModal.present();
  }


}
