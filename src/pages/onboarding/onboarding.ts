import { Component, ViewChild } from '@angular/core';
import { TabsPage } from '@/pages/tabs/tabs';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  @ViewChild('slides', { static: true }) slides: any;

  public buttonText: string = 'ONBOARDING_NEXT';
  public isEnd: boolean = false;
  public isBeginning: boolean = true;

  public _slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  public _slides: Array<string> = [
    'ONBOARDING_SLIDE_1',
    'ONBOARDING_SLIDE_2',
    'ONBOARDING_SLIDE_3',
    'ONBOARDING_SLIDE_4',
    'ONBOARDING_SLIDE_5',
    'ONBOARDING_SLIDE_6'
  ];

  constructor(private storage: Storage) {}

  ionViewDidEnter() {
    // Prevent the user from swiping into the void
    this.slides.lockSwipeToPrev(true);
  }

  done() {
    // this.appCtrl.getRootNav().pop(); // Remove the onboarding from the stack
    // TODO: fix this with angular routing
    // this.appCtrl.getRootNav().push(TabsPage);
    this.storage.set('onboardingCompleted', true);
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  nextSlide() {
    // If we are at the end, we're done with onboarding
    if (this.slides.isEnd()) this.done();
    else this.slides.slideNext();
  }

  ionSlideDidChange() {
    this.isEnd = this.slides.isEnd();
    this.isBeginning = this.slides.isBeginning();

    // Prevent users from 'over swiping'
    this.slides.lockSwipeToNext(this.isEnd);
    this.slides.lockSwipeToPrev(this.isBeginning);

    // Change text in main button
    this.buttonText = this.isEnd ? 'ONBOARDING_GOT_IT' : 'ONBOARDING_NEXT';
  }
}
