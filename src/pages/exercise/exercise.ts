import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { Restangular } from 'ngx-restangular';

import { ExerciseListPage } from '../exercise/list/exercise.list';

import {
  animateChild,
  query,
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { UserService } from '../../lib/services';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html',
  animations: [
    trigger('showLevelMonster', [
      state('void', style({transform: 'scale(0)'})),
      state('*', style({transform: 'scale(1)'})),
      transition('void => *', animate('300ms 200ms ease-in'))
    ]),
    trigger('showList', [
      transition(':enter, :leave', [
        query('@*', animateChild(), { optional: true })
      ])
    ]),
    trigger('showLevelProgress', [
      state('void', style({opacity: '0'})),
      state('*', style({opacity: '1'})),
      transition('void => *', animate('100ms 400ms ease-in'))
    ]),
    trigger('showSeperator', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('void => *', animate('750ms 200ms ease-in'))
    ]),
  ]
})
export class ExercisePage {

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

  ionViewDidLoad() {
    this.profile = this.userService.getUser();
    this.getExersises();
  }

  getExersises() {
    const filters = {
      patient: this.profile
    };
    this.restangular.all('ladders/exercise').getList(filters).subscribe((resp) => {
      resp.data.forEach(exercise => {
        this.levels.find(item => item.level === exercise.fear_rating).exercises.push(exercise);
      });
      this.setLevelsMonsterAndCompletion();
    });
  }

  setLevelsMonsterAndCompletion() {
    this.levels.forEach(level => {
      level.done = level.exercises.find(exercise => exercise.completed === false) ? false : true;

      // Get the level completion rate for the progress bar
      level.completion = level.done ? 100 : level.exercises.filter(exercise => exercise.completed === true).length * 100 / level.exercises.length;

      level.monster = 'assets/imgs/monsters/monster-0'+level.level+'.png';
      // TODO
      // fix monster icon based on completion
      // if(level.completion === 100) {
      //   level.monster = 'assets/imgs/monsters/level'+level.level+'_100.png';
      // } else if(level.completion > 49) {
      //   level.monster = 'assets/imgs/monsters/level'+level.level+'_50.png';
      // } else {
      //   level.monster = 'assets/imgs/monsters/level'+level.level+'_0.png';
      // }
    });

  }

  goToLevel(level) {
    // Dont need to go there if there are no exercises
    if(!level.exercises.length) return;

    // Also dont need to go there if the level is done
    if(level.done) return;

    this.appCtrl.getRootNav().push(ExerciseListPage, {
      level: level
    });
  }


}
