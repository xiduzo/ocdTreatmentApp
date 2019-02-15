import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Badge } from '../../lib/badge/Badge';

import { EventsService } from 'angular-event-service';

@Component({
  selector: 'badge',
  templateUrl: 'badge.html'
})
export class BadgeModal {

  public badge: Badge = new Badge();

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams,
    private eventService: EventsService,
  ) {
    this.badge = new Badge(this.params.get('badge'));
  }

  close() {
    this.viewCtrl.dismiss();
  }


}
