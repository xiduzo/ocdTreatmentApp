import { Component, Input } from '@angular/core';
import { IStep } from '@stores/exercise/exercise.model';

@Component({
  selector: 'spirit-exercise-level-step',
  templateUrl: 'exerciseLevelStep.component.html'
})
export class ExerciseLevelStepComponent {
  @Input('step') readonly step: IStep;

  constructor() {}
}
