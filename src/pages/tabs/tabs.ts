import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { ExercisePage } from '../exercise/exercise';
import { ProgressPage } from '../progress/progress';
import { ProfilePage } from '../profile/profile';
import { LogbookPage } from '../logbook/logbook';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabRef: Tabs;

  loaded:boolean = false;
  tabIndex:number = 0;

  ExercisePageRoot = ExercisePage;
  ProgressPageRoot = ProgressPage;
  ProfilePageRoot = ProfilePage;
  LogbookPageRoot = LogbookPage;

  constructor(
    private nativePageTransitions: NativePageTransitions
  ) {
  }

  private getAnimationDirection(index):string {
    let currentIndex = this.tabIndex;

    this.tabIndex = index;

    return (currentIndex < index ? 'left' : 'right');
  }

  public transition(e):void {
    let options: NativeTransitionOptions = {
      direction:this.getAnimationDirection(e.index),
      duration: 250,
      slowdownfactor: -1,
      slidePixels: 0,
      iosdelay: 20,
      androiddelay: 0,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 48
    };

    if (!this.loaded) {
      this.loaded = true;
      return;
    }

    this.nativePageTransitions.slide(options);
  }
}
