import { Component } from '@angular/core';

import { Exercise } from '@/lib/Exercise';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@/stores/exercise/exercise.reducer';
import { ExerciseActions } from '@/stores/exercise/exercise.action';

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {
  @select() readonly exercises$: Observable<IExerciseState>;

  constructor(
    private exerciseActions: ExerciseActions // private store: NgRedux<IAppState>
  ) {
    setTimeout(() => {
      this.exerciseActions.addExercise(new Exercise());
    }, 2000);
  }

  toggleExerciseContent(exercise: Exercise) {
    exercise['openedContent'] = !exercise['openedContent'];
  }
}
