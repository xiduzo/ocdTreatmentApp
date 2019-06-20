import { Component, Input } from '@angular/core';
import { IExercise } from '@stores/exercise/exercise.model';

@Component({
  selector: 'spirit-logbook-item',
  templateUrl: 'logbookItem.component.html'
})
export class SpiritLogbookItem {
  @Input('exercise') readonly exercise: IExercise;

  constructor() {}

  toggleExerciseContent = (exercise: IExercise): void => {
    exercise['openedContent'] = !exercise['openedContent'];
  };
}
