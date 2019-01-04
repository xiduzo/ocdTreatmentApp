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
    this.badge = this.params.get('badge');
    console.log(this.badge);
  }

  close() {
    this.viewCtrl.dismiss();
  }


}
