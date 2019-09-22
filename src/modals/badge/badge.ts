import { Component } from '@angular/core'
import { NavParams, ViewController, ModalController } from 'ionic-angular'

import { Badge, getCurrentStage } from '@lib/badge/Badge'
import { ICurrentBadgeStage } from '@stores/badge/badge.model'

@Component({
  selector: 'badge-modal',
  templateUrl: 'badge.html',
})
export class BadgeModal {
  public badge: Badge = new Badge()
  public currentStage: ICurrentBadgeStage
  public currentStageIndex: number

  constructor(public viewCtrl: ViewController, public params: NavParams, public modalCtrl: ModalController) {
    this.badge = new Badge(this.params.get('badge'))
    this.currentStage = getCurrentStage(this.badge)
    this.currentStageIndex = this.badge.stages.indexOf(this.currentStage.stage)
  }

  close() {
    this.viewCtrl.dismiss()
  }
}
