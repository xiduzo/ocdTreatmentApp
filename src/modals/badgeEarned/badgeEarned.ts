import { Component } from '@angular/core'
import { NavParams, ViewController } from 'ionic-angular'

import { Badge } from '@lib/badge/Badge'

import { confettiSettings } from '@lib/Confetti'
declare var ConfettiGenerator: any
import 'confetti-js'

import { IStage } from '@stores/badge/badge.model'

@Component({
  selector: 'badge-earned-modal',
  templateUrl: 'badgeEarned.html',
})
export class BadgeEarnedModal {
  public badge: Badge = new Badge()
  public completedStage: IStage

  constructor(public viewCtrl: ViewController, public params: NavParams) {
    this.badge = this.params.get('badge')
    this.completedStage = this.params.get('completedStage')
  }
  ionViewDidEnter = (): void => {
    this.renderConfetti()
  }

  renderConfetti = (): void => {
    try {
      setTimeout(() => {
        const confetti = new ConfettiGenerator({
          ...confettiSettings,
          target: 'confetti__badge-earned',
        })
        confetti.render()
      }, 1000)
    } catch (e) {
      console.log(e)
    }
  }
  close = (): void => {
    this.viewCtrl.dismiss()
  }
}
