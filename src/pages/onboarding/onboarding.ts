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

  public doneMessage:string = "skip";

  public _slides:any = [
    {
      text: 'Obsessions are like little monsters, liing in your mind. The mosnters sometimes take over your thoughts and actions',
      image: 'step1.png'
    },
    {
      text: 'You already defined what monsters live in your mind and some monsters scare you more than others.',
      image: 'step2.png'
    },
    {
      text: 'The more space you allow the mosnters, the more they will grow. You allow them to take over your mind.',
      image: 'step1.png'
    },
    {
      text: 'If you success an exercise and faced the monster successfully you ...',
      image: 'step1.png'
    },
    {
      text: 'By conducting the exercises you allow them less space and give more to yourself.',
      image: 'step1.png'
    },
    {
      text: 'After completing all exercises successfully you give the monster no space at all and it will shrink.',
      image: 'step1.png'
    },
  ]

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

  done() {
    this.appCtrl.getRootNav().push(TabsPage);
    this.storage.set('onboardingCompleted', true);
  }

  slideChanged() {
    this.doneMessage = this.slides.isEnd() ? "Got it" : "skip";
  }

}
