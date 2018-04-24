import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';

@Component({
  selector: 'ybocs',
  templateUrl: 'ybocs.html'
})
export class YbocsModal {

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    console.log('select random question');
  }

  close() {
    this.viewCtrl.dismiss();
  }


}
