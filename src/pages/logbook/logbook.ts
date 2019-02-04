import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'

import { map } from '../../lib/helpers';

import { Exercise } from '../../lib/Exercise';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {

  public exercises: Array<Exercise> = [];

  constructor(
    private storage: Storage
  ) {
  }

  ionViewWillLoad() {
    this.getExercises();
  }

  toggleExerciseContent(exercise: Exercise) {
    exercise["openedContent"] = !exercise["openedContent"];
  }

  getExercises() {
    this.storage.get('exercises').then((exercises) => {
      if (!exercises) return;
      this.exercises = exercises
        // Sort by starting time of the exercise (new to old)
        .sort((a, b) => { return b.start - a.start })
        .map(localExercise => {
          const exercise = new Exercise(localExercise);
          // Map the moods to 1-5 scale, if not null
          // https://stackoverflow.com/a/20629324
          if (exercise.beforeMood.mood !== null) exercise.beforeMood.mood = Math.round(map(exercise.beforeMood.mood, 0, 500, 1, 5));
          if (exercise.afterMood.mood !== null) exercise.afterMood.mood = Math.round(map(exercise.afterMood.mood, 0, 500, 1, 5));

          return exercise;
        });
    });
  }

}
