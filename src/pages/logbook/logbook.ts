import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'

import { map } from '../../lib/helpers';

import { Exercise } from '../../lib/Exercise';

import { EventsService } from 'angular-event-service';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {

  public exercises: Array<Exercise> = [];

  constructor(
    private storage: Storage,
    private eventService: EventsService
  ) {
  }

  ionViewWillEnter() {
    this.eventService.on('exercise_update', this.exerciseUpdate.bind(this));
  }

  ionViewWillLoad() {
    this.getExercises();
  }

  ionViewWillLeave() {
    this.eventService.destroyListener('exercise_update', this.exerciseUpdate);
  }

  exerciseUpdate(exercise: Exercise) {
    const localExercise = this.exercises.find(currExercise => currExercise.id === exercise.id);

    [exercise.beforeMood, exercise.afterMood].forEach(mood => {
      if(mood.mood) mood.mappedMood = mood.getMappedMood();
    });

    if(!localExercise) {
      // Add the exercise to the start of the array for reversed chronological order
      this.exercises.unshift(exercise);
    } else {
      this.exercises[this.exercises.indexOf(localExercise)] = exercise;
    }
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
