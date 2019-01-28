import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Badge } from '../Badge';

@Component({
  selector: 'badge',
  templateUrl: 'badge.html'
})
export class BadgeModal {

  public badge: Badge = new Badge();

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    this.badge = new Badge(this.params.get('badge'));
    console.log(this.badge);
  }

  addProgress() {
    this.badge.addProgress(1);
  }

  close() {
    this.viewCtrl.dismiss();
  }


}
