import { Component, Input, OnInit } from '@angular/core';
import { IBadge, ICurrentBadgeStage } from '@stores/badge/badge.model';
import { getCurrentStage } from '@lib/badge/Badge';

@Component({
  selector: 'spirit-badge',
  templateUrl: 'badge.component.html'
})
export class BadgeComponent implements OnInit {
  @Input('badge') readonly badge: IBadge;

  public currentStage: ICurrentBadgeStage;

  constructor() {}

  ngOnInit() {
    this.currentStage = getCurrentStage(this.badge);
  }
}
