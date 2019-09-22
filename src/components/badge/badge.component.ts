import { Component, Input, OnInit } from '@angular/core'
import { IBadge, ICurrentBadgeStage, IStage } from '@stores/badge/badge.model'
import { getCurrentStage } from '@lib/badge/Badge'

@Component({
  selector: 'spirit-badge',
  templateUrl: 'badge.component.html',
})
export class BadgeComponent implements OnInit {
  @Input('badge') readonly badge: IBadge
  @Input('stage') readonly stage?: IStage
  @Input('pointsToNextStage') readonly pointsToNextStage?: number

  public currentStage: ICurrentBadgeStage

  ngOnInit() {
    this.currentStage = this.stage
      ? { stage: this.stage, pointsToNextStage: this.pointsToNextStage }
      : getCurrentStage(this.badge)
  }
}
