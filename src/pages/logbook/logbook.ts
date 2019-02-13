import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'

import { Exercise } from '../../lib/Exercise';

import { EventsService } from 'angular-event-service';

import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html',
})
export class LogbookPage {
  public exercises: Array<Exercise> = [];
  public paginationSettings: PaginationInstance = {
    currentPage: 1,
    itemsPerPage: 25,
  };

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

  loadMoreExercises(infiniteScrollEvent) {
    console.log(infiniteScrollEvent);
  }

  exerciseUpdate(exercise: Exercise) {
    const localExercise = this.exercises.find(currExercise => currExercise.id === exercise.id);

    [exercise.beforeMood, exercise.afterMood].forEach(mood => {
      if(mood.mood !== null) mood.mappedMood = mood.getMappedMood();
    });

    if(!localExercise) {
      this.exercises.push(exercise);
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
      .map(localExercise => {
        const exercise = new Exercise(localExercise);

        [exercise.beforeMood, exercise.afterMood].forEach(mood => {
          if(mood.mood !== null) mood.mappedMood = mood.getMappedMood();
        });

        return exercise;
      });
    });
  }

}
