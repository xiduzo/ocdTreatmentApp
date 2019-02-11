import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'

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

          [exercise.beforeMood, exercise.afterMood].forEach(mood => {
            if(mood.mood) mood.mappedMood = mood.getMappedMood();
          });

          return exercise;
        });
    });
  }

}
