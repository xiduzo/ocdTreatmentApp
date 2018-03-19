import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { TabsPage } from '../../tabs/tabs';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'page-exercise-detail',
  templateUrl: 'exercise.detail.html',
  animations: [
    trigger('trackMood', [
      state('content', style({background: 'rgb(252, 201, 138)'})),
      state('ok', style({background: 'rgb(145, 207, 204)'})),
      state('meh', style({background: 'rgb(214, 217, 204)'})),
      state('panic', style({background: 'rgb(82, 156, 204)'})),
      state('worried', style({background: 'rgb(240,120,121)'})),
      transition('* => *', animate('350ms ease-in'))
    ])
  ]
})
export class ExerciseDetailPage {
  public props:any = {
    segments: 5,
    strokeWidth: 35,
    radius: 150,
    gradientColorFrom: '#F2EAD7',
    gradientColorTo: '#F2EAD7',
    bgCircleColor: '#F2EAD7',
    showClockFace: false
  }

  public mood:string = 'content';

  constructor(
    public appCtrl: App
  ) {

  }

  ionViewDidEnter() {
  }

  ionViewDidLoad() {
  }

  setMood(event) {
    if(event.angleLength >= 5 || event.angleLength <= 1) {
      this.mood = 'content';
    } else if(event.angleLength >= 4) {
      this.mood = 'ok';
    } else if(event.angleLength >= 3) {
      this.mood = 'meh';
    } else if(event.angleLength >= 2) {
      this.mood = 'panic';
    } else if(event.angleLength >= 1) {
      this.mood = 'worried';
    }
    console.log(event);
  }

  stopExercise() {
    this.appCtrl.getRootNav().push(TabsPage);
    this.appCtrl.getRootNav().getActiveChildNav().select(1);
    // console.log(this.appCtrl.getRootNav());
  }

}
