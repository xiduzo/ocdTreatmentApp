import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Badge, Stage } from '../../lib/badge/Badge';

declare var ConfettiGenerator: any;
import "confetti-js";

@Component({
  selector: 'badge-earned-modal',
  templateUrl: 'badgeEarned.html'
})
export class BadgeEarnedModal {

  public badge: Badge = new Badge();
  public previousStage: Stage;
  public currValue: number = 1000;
  public maxValue: number = 1000;
  public time: number = 3 * 1000;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
  ) {
    this.badge = new Badge(this.params.get('badge'));
  }

  ionViewWillEnter() {
    this.previousStage = this.badge.stages[this.badge.stages.indexOf(this.badge.currentStage) - 1];
    this.decreaseValue();
  }

  decreaseValue() {
    this.currValue--;

    if(this.currValue > 0) {
      setTimeout(() => {
        this.decreaseValue();
      }, this.time / this.maxValue)
    } else {
      const confettiSettings = {
        target: 'confetti',
        clock: 10,
        max: 50,
      };

      const confetti = new ConfettiGenerator(confettiSettings);

      confetti.render();
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
