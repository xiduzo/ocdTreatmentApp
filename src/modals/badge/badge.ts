import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from '@ionic/angular';

import { Badge } from '@/lib/badge/Badge';
import { BadgeEarnedModal } from '@/modals/badgeEarned/badgeEarned';

@Component({
  selector: 'badge',
  templateUrl: 'badge.html'
})
export class BadgeModal {
  public badge: Badge = new Badge();

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    public modalCtrl: ModalController
  ) {
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
    this.viewCtrl.dismiss();
  }
}
