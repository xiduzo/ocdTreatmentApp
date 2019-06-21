import { Component, Input } from '@angular/core';
import { IFearLadder } from '@stores/fearLadder/fearLadder.model';

@Component({
  selector: 'spirit-exercise-level',
  templateUrl: 'exerciseLevel.component.html'
})
export class ExerciseLevelComponent {
  @Input('level') readonly level: IFearLadder;

  constructor() {}
}
