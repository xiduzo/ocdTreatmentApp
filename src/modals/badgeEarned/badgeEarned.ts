import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

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

  constructor(public params: NavParams) {
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
    // TODO: Fix this with angular routing
    // this.viewCtrl.dismiss();
  }
}
