import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'spirit-empty-state',
  templateUrl: 'emptyState.component.html'
})
export class EmptyStateComponent {
  @Input('title') readonly title: string;
  @Input('subtitle') readonly subtitle: string;
  @Input('imageSource') readonly imageSource: string;
  @Input('buttonText') readonly buttonText: string;
  @Output('callback') readonly callback: EventEmitter<any> = new EventEmitter<
    any
  >();

  constructor() {}

  buttonClick = (): any => {
    this.callback.emit();
  };
}
