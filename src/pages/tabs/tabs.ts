import { Component, ViewChild } from '@angular/core';
import { NavParams, Tabs } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { ExercisePage } from '../exercise/exercise';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabRef: Tabs;

  loaded:boolean = false;
  tabIndex:number = 0;

  HomePageRoot = HomePage;
  ExercisePageRoot = ExercisePage;
  ProfilePageRoot = ProfilePage;

  constructor(
    private nativePageTransitions: NativePageTransitions,
    private navParams: NavParams
  ) {

  }

  private getAnimationDirection(index):string {
    var currentIndex = this.tabIndex;

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

  ionViewWillEnter() {
    if(this.navParams.get('opentab')) {
      this.tabRef.select(this.navParams.get('opentab'));
    }
  }
}
