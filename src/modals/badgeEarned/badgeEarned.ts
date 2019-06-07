import { Component } from '@angular/core';
import { NavParams, ViewController } from '@ionic/angular';

import { Badge } from '@/lib/badge/Badge';

import { confettiSettings } from '@/lib/Confetti';

declare var ConfettiGenerator: any;
import 'confetti-js';

@Component({
  selector: 'badge-earned-modal',
  templateUrl: 'badgeEarned.html'
})
export class BadgeEarnedModal {
  public badge: Badge = new Badge();

  constructor(public viewCtrl: ViewController, public params: NavParams) {
    this.badge = this.params.get('badge');
  }

  ionViewDidEnter() {
    this.renderConfetti();
  }

  renderConfetti() {
    try {
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    } catch (e) {
      console.log(e);
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
