import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'

import { map } from '../../lib/helpers';

import { Exercise } from '../../lib/Exercise';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {

  public exercises: Array<any> = [];

  constructor(
    private storage: Storage
  ) {
  }

  ionViewWillEnter() {
    this.getExercises();
  }

  getExercises() {
    this.storage.get('exercises').then((exercises) => {
      if (!exercises) return;
      // Only show the exercises where a comment has been made
      this.exercises = exercises
        .sort((a, b) => { return b.start - a.start })
        .map(exercise => {
          const exercise = new Exercise(exercise);
          // Map the moods to 1-5 scale, if not null
          // https://stackoverflow.com/a/20629324
          if (!isNaN(parseInt(exercise.beforeMood.mood))) exercise.beforeMood.mood = Math.round(map(exercise.beforeMood.mood, 0, 500, 1, 5));
          if (!isNaN(parseInt(exercise.afterMood.mood))) exercise.afterMood.mood = Math.round(map(exercise.afterMood.mood, 0, 500, 1, 5));

          return exercise;
        });
    });
  }

}
