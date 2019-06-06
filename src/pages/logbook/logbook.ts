import { Component } from '@angular/core';

import { Exercise } from '@/lib/Exercise';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { IExerciseState } from '@/stores/exercise/exercise.reducer';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {
  @select() readonly exercises$: Observable<IExerciseState>;

  constructor() {}

  toggleExerciseContent(exercise: Exercise) {
    exercise['openedContent'] = !exercise['openedContent'];
  }
}
