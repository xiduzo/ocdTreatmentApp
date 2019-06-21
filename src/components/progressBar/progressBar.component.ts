import { Component, Input } from '@angular/core';

@Component({
  selector: 'spirit-progress-bar',
  templateUrl: 'progressBar.component.html'
})
export class ProgressBarComponent {
  @Input('progress') readonly progress: number;

  constructor() {}
}
