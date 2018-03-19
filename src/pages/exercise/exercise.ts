import { Component, ViewChild } from '@angular/core';
import { App, Content } from 'ionic-angular';

import { Restangular } from 'ngx-restangular';
import { ExerciseDetailPage } from '../exercise/detail/exercise.detail';

import {
  animateChild,
  query,
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

import { UserService } from '../../lib/services';

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
        query('@*', animateChild(), { optional: true })
      ])
    ]),
    trigger('showLevelMonster', [
      state('void', style({transform: 'scale(0)'})),
      state('*', style({transform: 'scale(1)'})),
      transition('void => *', animate('300ms 200ms ease-in'))
    ]),
    trigger('showLevelProgress', [
      state('void', style({opacity: '0'})),
      state('*', style({opacity: '1'})),
      transition('void => *', animate('100ms 400ms ease-in'))
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
  private profile:string;
  public activeLevel:any;

  public levels:Array<any> = [
    { level: 1, exercises: [] },
    { level: 2, exercises: [] },
    { level: 3, exercises: [] },
    { level: 4, exercises: [] },
    { level: 5, exercises: [] },
    { level: 6, exercises: [] },
    { level: 7, exercises: [] },
    { level: 8, exercises: [] },
  ];

  constructor(
    public appCtrl: App,
    private restangular: Restangular,
    private userService: UserService
  ) {

  }

  ionViewDidEnter() {
    this.setLevelsMonsterAndCompletion();
  }

  ionViewDidLoad() {
    this.profile = this.userService.getUser();
    this.getExersises();
  }

  getExersises() {
    const filters = {
      patient: this.profile
    };
    this.restangular.all('ladders/exercise').getList(filters).subscribe((resp) => {
      resp.forEach(exercise => {
        this.levels.find(item => item.level === exercise.fear_rating).exercises.push(exercise);
      });
      this.setLevelsMonsterAndCompletion();
    });
  }

  setLevelsMonsterAndCompletion() {
    this.levels.forEach(level => {
      level.done = level.exercises.find(exercise => exercise.completed === false) ? false : true;

      level.completion = level.done ? 100 : level.exercises.filter(exercise => exercise.completed === true).length * 100 / level.exercises.length;

      if(level.completion === 100) {
        level.monster = 'assets/imgs/monsters/level'+level.level+'_100.png';
      } else if(level.completion > 49) {
        level.monster = 'assets/imgs/monsters/level'+level.level+'_50.png';
      } else {
        level.monster = 'assets/imgs/monsters/level'+level.level+'_0.png';
      }
    });

    this.setActiveLevel();
  }

  setActiveLevel() {
    const uncompletedLevels = this.levels.filter(level => level.done === false);

    if(uncompletedLevels.length) {
      this.activeLevel = uncompletedLevels[0];
      this.activeLevel.completedExercises = this.activeLevel.exercises.filter(exercise => exercise.completed === true).length;
    }

    this.resizeContent();
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
    this.appCtrl.getRootNav().push(ExerciseDetailPage);
  }

}
