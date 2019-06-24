import { Component, Input, OnInit } from '@angular/core';
import { IStep } from '@stores/exercise/exercise.model';
import { getLevelCompletion } from '@lib/Level';

@Component({
  selector: 'spirit-exercise-level-step',
  templateUrl: 'exerciseLevelStep.component.html'
})
export class ExerciseLevelStepComponent implements OnInit {
  @Input('step') readonly step: IStep;

  public stepCompletion: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.stepCompletion = getLevelCompletion([this.step]);
  }
}
