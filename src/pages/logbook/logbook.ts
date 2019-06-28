import { Component } from '@angular/core';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@stores/exercise/exercise.reducer';
import { IExercise } from '@stores/exercise/exercise.model';

import moment from 'moment';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {
  @select() readonly exercises$: Observable<IExerciseState>;
  public exercises: IExercise[] = [];

  constructor() {
    this.exercises$.subscribe((exerciseState: IExerciseState) => {
      this.exercises = [...exerciseState.list];
      this.filterAndSortExercises();
    });
  }

  trackByFn = (index: number): number => index;

  filterAndSortExercises = (): void => {
    // TODO: add optional filtering
    this.exercises.sort((a: IExercise, b: IExercise) => {
      return moment(b.start).unix() - moment(a.start).unix();
    });
  };
}
