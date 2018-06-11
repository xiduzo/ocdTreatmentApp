import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'badge',
  templateUrl: 'badge.html'
})
export class BadgeModal {

  constructor(
    public viewCtrl: ViewController
  ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }


}
