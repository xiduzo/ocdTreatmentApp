import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'ybocs',
  templateUrl: 'ybocs.html'
})
export class YbocsModal {

  constructor(
    public viewCtrl: ViewController
  ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }


}
