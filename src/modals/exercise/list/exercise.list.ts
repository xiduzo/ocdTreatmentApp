import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';

import { App, Content, NavParams, ModalController } from 'ionic-angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { ExerciseMoodModal } from '../mood/exercise.mood';

import { Exercise } from '../../../lib/Exercise';

import { FEAR_COMPLETION_POSITIVE_LIMIT } from '../../../lib/constants';

import { EventsService } from 'angular-event-service';

@Component({
  selector: 'exercise-list-page',
  templateUrl: 'exercise.list.html'
})
export class ExerciseListModal {
  @ViewChild(Content) content: Content;

  private level: any;

  private slideOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  public fearCompletionPositiveLimit = FEAR_COMPLETION_POSITIVE_LIMIT;

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    private appCtrl: App,
    private storage: Storage,
    private nativePageTransitions: NativePageTransitions,
    private eventService: EventsService,
  ) {
    this.nativePageTransitions.slide(this.slideOptions);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
  }

  ionViewWillLoad() {
    this.eventService.on('completed_exercise', this.exerciseCompleted.bind(this));
  }

  ionViewWillUnload() {
    this.eventService.destroyListener('completed_exercise', this.exerciseCompleted);
  }

  exerciseCompleted(exercise: Exercise) {
    try {
      this.level.steps.find(step => step.id === exercise.step.id).fear.completion = exercise.step.fear.completion;
    } catch (err) {
      console.log(`err ${err}`);
    } finally {
      this.level.calculateCompletion();
      this.eventService.broadcast('new_level_completion', this.level);
    }
  }

  close() {
    this.appCtrl.getRootNav().pop();
  }

  selectStep(step) {
    if (step.fear.completion >= FEAR_COMPLETION_POSITIVE_LIMIT) return;

    this.storage.get('exercises').then((exercises) => {
      if (!exercises) exercises = []; // When it's the users' first time

      const exercise = new Exercise({
        start: new Date(),
        step: step
      });

      exercises.push(exercise);

      this.storage.set('exercises', exercises);

      const exerciseMoodModal = this.modalCtrl.create(ExerciseMoodModal, {
        level: this.level,
        exercise: exercise,
        before: true
      });

      exerciseMoodModal.present();
    });
  }
}
