import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { Badge } from '@/lib/badge/Badge';
import { BadgeEarnedModal } from '@/modals/badgeEarned/badgeEarned';

@Component({
  selector: 'badge',
  templateUrl: 'badge.html'
})
export class BadgeModal {
  public badge: Badge = new Badge();

  constructor(public params: NavParams, public modalCtrl: ModalController) {
    this.badge = new Badge(this.params.get('badge'));
  }

  testCompletion = async (): Promise<void> => {
    const modal = await this.modalCtrl.create({
      component: BadgeEarnedModal,
      componentProps: {
        badge: this.badge
      }
    });

    modal.present();
  };

  close() {
    // TODO: fix this with angular routing
    // this.viewCtrl.dismiss();
  }
}
