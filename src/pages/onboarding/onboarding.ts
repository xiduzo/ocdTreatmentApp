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

  public buttonText:string = "ONBOARDING_SKIP";

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

  ionViewDidEnter() {
    // Prevent the user from swiping into the void
    this.slides.lockSwipeToPrev(true);
  }

  done() {
    // this.appCtrl.getRootNav().pop(); // Remove the onboarding from the stack
    this.appCtrl.getRootNavById('n4').push(TabsPage);
    this.storage.set('onboardingCompleted', true);
  }

  slideChanged() {
    // Prevent users from 'overswiping'
    this.slides.lockSwipeToNext(this.slides.isEnd());
    this.slides.lockSwipeToPrev(this.slides.isBeginning());

    this.buttonText = this.slides.isEnd() ? "ONBOARDING_GOT_IT" : "ONBOARDING_SKIP";
  }

}
