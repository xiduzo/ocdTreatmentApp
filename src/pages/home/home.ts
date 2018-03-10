import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private restangular: Restangular
  ) {

  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    // this.restangular.all('ladders/level').getList().subscribe((resp) => {
    //   console.log(resp.plain());
    // });
  }

}
