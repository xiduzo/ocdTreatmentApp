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

  public buttonText:string = "skip";

  public _slides:any = [
    'ONBOARDING_SLIDE_1',
    'ONBOARDING_SLIDE_2',
    'ONBOARDING_SLIDE_3',
    'ONBOARDING_SLIDE_4',
    'ONBOARDING_SLIDE_5',
    'ONBOARDING_SLIDE_6'
  ];

  constructor(
    private appCtrl: App,
    private storage: Storage
  ) {
  }

  done() {
    this.appCtrl.getRootNav().pop(); // Remove the onboarding from the stack
    this.appCtrl.getRootNav().push(TabsPage);
    this.storage.set('onboardingCompleted', true);
  }

  slideChanged() {
    this.buttonText = this.slides.isEnd() ? "ONBOARDING_GOT_IT" : "ONBOARDING_SKIP";
  }

}
