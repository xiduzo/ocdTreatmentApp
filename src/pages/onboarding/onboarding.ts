import { Component, ViewChild } from '@angular/core';
import { App, Slides } from 'ionic-angular';
import { TabsPage } from '@/pages/tabs/tabs';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  @ViewChild(Slides) slides: Slides;

  public buttonText: string = "ONBOARDING_SKIP";
  public isEnd: boolean = false;
  public isBeginning: boolean = true;

  public _slides: any = [
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
    this.appCtrl.getRootNav().push(TabsPage);
    this.storage.set('onboardingCompleted', true);
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    this.slides.slideNext();
  }

  slideChanged() {
    // Toggle button states
    this.isEnd = this.slides.isEnd();
    this.isBeginning = this.slides.isBeginning();

    // Prevent users from 'overswiping'
    this.slides.lockSwipeToNext(this.isEnd);
    this.slides.lockSwipeToPrev(this.isBeginning);

    // Change text in main button
    this.buttonText = this.slides.isEnd() ? "ONBOARDING_GOT_IT" : "ONBOARDING_SKIP";
  }

}
