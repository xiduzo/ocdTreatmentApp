import { Component, ViewChild } from '@angular/core';
import { App, Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  @ViewChild(Slides) slides: Slides;

  skipMessage:string = "skip";

  constructor(
    private appCtrl: App,
    private storage: Storage
  ) {
  }


  ngOnInit() {
    // this.restangular.all('ladders/level').getList().subscribe((resp) => {
    //   console.log(resp.plain());
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
