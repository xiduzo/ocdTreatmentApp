import { Component, Input } from '@angular/core';

@Component({
  selector: 'spirit-mood-indicator',
  templateUrl: 'moodIndicator.component.html'
})
export class SpiritMoodIndicator {
  @Input('mood') readonly mood: number;
  @Input('afterMood') readonly afterMood: number;

  constructor() {}
}
