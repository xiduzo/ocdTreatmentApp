import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Exercise } from '@/lib/Exercise';

import { EventsService } from 'angular-event-service';

import { PaginationInstance } from 'ngx-pagination';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@/stores/exercise/exercise.reducer';
import { ExerciseActions } from '@/stores/exercise/exercise.action';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {
  // public exercises: IExerciseState;
  @select() readonly exercises$: Observable<IExerciseState>;

  public exercises: Array<Exercise> = [];
  public paginationSettings: PaginationInstance = {
    currentPage: 1,
    itemsPerPage: 25
  };

  constructor(
    private storage: Storage,
    private eventService: EventsService, // private store: NgRedux<IAppState>,
    private exerciseActions: ExerciseActions // private store: NgRedux<IAppState>
  ) {
    this.exerciseActions.loadExercises();
    setTimeout(() => {
      this.exerciseActions.addExercise(new Exercise());
    }, 2000);
  }

  ionViewWillLoad() {
    this.getExercises();
    this.eventService.on('exercise_update', this.exerciseUpdate.bind(this));
  }

  ionViewWillUnload() {
    this.eventService.destroyListener('exercise_update', this.exerciseUpdate);
  }

  loadMoreExercises(infiniteScrollEvent: any) {
    console.log(infiniteScrollEvent);
  }

  exerciseUpdate(exercise: Exercise) {
    const localExercise = this.exercises.find(
      currExercise => currExercise.id === exercise.id
    );

    [exercise.beforeMood, exercise.afterMood].forEach(mood => {
      if (mood.mood !== null) mood.mappedMood = mood.getMappedMood();
    });

    if (!localExercise) {
      // Add to the start of the array for display purposes
      this.exercises.unshift(exercise);
    } else {
      this.exercises[this.exercises.indexOf(localExercise)] = exercise;
    }
  }

  toggleExerciseContent(exercise: Exercise) {
    exercise['openedContent'] = !exercise['openedContent'];
  }

  getExercises() {
    this.storage.get('exercises').then(exercises => {
      if (!exercises) return;
      this.exercises = exercises
        // TODO, fix that this will show arr by start DESC
        // .sort((a:Exercise, b:Exercise) => <any>b.start - <any>a.start)
        .map((localExercise: Exercise) => {
          const exercise = new Exercise(localExercise);

          [exercise.beforeMood, exercise.afterMood].forEach(mood => {
            if (mood.mood !== null) mood.mappedMood = mood.getMappedMood();
          });

          return exercise;
        });
    });
  }
}
