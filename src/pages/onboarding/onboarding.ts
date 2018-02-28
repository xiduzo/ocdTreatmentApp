import { Component, ViewChild } from '@angular/core';
import { App, Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { Storage } from '@ionic/storage';

import { Restangular } from 'ngx-restangular';
import { AuthService } from '../../lib/services';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  @ViewChild(Slides) slides: Slides;

  skipMessage:string = "skip";
  jwtToken:string;

  constructor(
    private appCtrl: App,
    private storage: Storage,
    private restangular: Restangular,
    private authService: AuthService
  ) {
  }


  ngOnInit() {
    this.restangular.all('ladders/level').getList().subscribe((resp) => {
      console.log(resp.plain());
    });
    // console.log(this.authService.getLocalToken());
    // if(!authService.getJwtToken()) {
    //   console.log(true);
    // }
    // let data = {
    //   username: "sander",
    //   password: "sandertjuh94"
    // };
    //
    // this.restangular.all('/ladder/level').getList().subscribe( (response) => {
    //   console.log(true);
    //   console.log(response.plain());
    // });
    // this.restangular.all('/api-token-auth').post(data).subscribe( (response) => {
    //   console.log(response.plain());
    //   // this.restangular.configuration.defaultHeaders = {'Authorization': response.token};
    //   // this.restangular.all('/api-token-verify').post({ token: response.token }).subscribe( (response) => {
    //   //   console.log(response.plain());
    //   // });
    // });
    // this.restangular.one('/api/patient').getList().subscribe( (response) => {
    //   console.log(response.plain());
    // });
  }

  skip() {
    this.appCtrl.getRootNav().push(TabsPage);
    this.storage.set('onboardingCompleted', true);
  }

  slideChanged() {
    this.skipMessage = this.slides.isEnd() ? "Got it" : "skip";
  }

}
