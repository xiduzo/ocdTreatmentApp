import { Component, ViewChild } from '@angular/core';
import { App, Content } from 'ionic-angular';

import {
  animateChild,
  query,
  trigger,
  state,
  style,
  animate,
  transition,
  stagger,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
  animations: [
    trigger('isLevelSelected', [
      state('no', style({ height: '0vh', opacity: 0})),
      state('yes', style({ height: '16vh', opacity: 1})),
      transition('no => yes', animate('650ms ease-in', keyframes([
        style({height: '0vh', opacity: 0, offset: 0}),
        style({height: '16vh', opacity: 0, offset: 0.3}),
        style({height: '17vh', opacity: 0.2, offset: 0.4}),
        style({height: '18vh', opacity: 0.4, offset: 0.6}),
        style({height: '17vh', opacity: 0.8, offset: 0.7}),
        style({height: '16vh', opacity: 1, offset: 1})
      ]))),
      transition('yes => no', animate('200ms ease-in', keyframes([
        style({height: '16vh', offset: 0}),
        style({height: '18vh', offset: 0.2}),
        style({height: '19vh', offset: 0.25}),
        style({height: '18vh', offset: 0.3}),
        style({height: '16vh', offset: 0.6}),
        style({height: '0vh', offset: 1})
      ]))),
    ]),
    trigger('showList', [
      transition(':enter, :leave', [
        query('@*', animateChild())
      ])
    ]),
    trigger('showLevel', [
      // state('void', style({transform: 'scale(0)'})),
      // state('*', style({transform: 'scale(1)'})),
      transition('* => *', [
        query(':enter', [
          stagger(100, [
              animate('300ms ease-in')
            ]
          )
        ], { optional: true })
      ])
      // transition('void => *', animate('300ms 200ms ease-in'))
    ]),
    trigger('showExercise', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('void => *', animate('350ms 650ms ease-in'))
    ]),
    trigger('showSeperator', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('void => *', animate('750ms 200ms ease-in'))
    ]),
  ]
})
export class ExercisePage {
  @ViewChild(Content) content: Content;

  public isLevelSelected:string = 'no';
  public selectedLevel:any = null;

  public levels:Array<any> = [
    {
      name: 'level 1',
      monster: 'assets/imgs/monsters/monster1.png',
      monsterBeaten: 'assets/imgs/monsters/monster1.png',
      open: true,
      done: false,
      exercises: [1,2,3,4,5,6,7,8,9]
    },
    {
      name: 'level 2',
      monster: 'assets/imgs/monsters/monster1.png',
      monsterBeaten: 'assets/imgs/monsters/monster1.png',
      open: false,
      done: false,
      exercises: [1,2,3,4,5]
    },
    {
      name: 'level 3',
      monster: 'assets/imgs/monsters/monster1.png',
      monsterBeaten: 'assets/imgs/monsters/monster1.png',
      open: false,
      done: false,
      exercises: [1,2,3,4,5]
    },
    {
      name: 'level 4',
      monster: 'assets/imgs/monsters/monster1.png',
      monsterBeaten: 'assets/imgs/monsters/monster1.png',
      open: false,
      done: false,
      exercises: [1,2,3,4,5]
    },
  ]

  constructor(
    public appCtrl: App
  ) {

  }

  ionViewDidLoad() {
    console.log("ExercisePage loaded");
  }

  goToLevel(level) {
    this.isLevelSelected = 'yes';
    this.selectedLevel = level;
  }

  goToLevelOverview() {
    this.selectedLevel = null;
    this.isLevelSelected = 'no';
  }

  resizeContent() {
    this.content.resize();
  }

  selectExercise() {
    this.appCtrl.getRootNav().push();
  }

}
