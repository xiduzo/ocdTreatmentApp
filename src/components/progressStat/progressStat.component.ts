import { Component, Input } from '@angular/core';

@Component({
  selector: 'spirit-progress-stat',
  templateUrl: 'progressStat.component.html'
})
export class ProgressStatComponent {
  @Input('icon') readonly icon: string;
  @Input('title') readonly title: string;
  @Input('amount') readonly amount: number;
  @Input('item') readonly item: string;
  @Input('previousAmount') readonly previousAmount: number;

  constructor() {}
}
