import { Component } from '@angular/core';
import { App, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Restangular } from 'ngx-restangular';

import { ExerciseListPage } from '../exercise/list/exercise.list';

import { UserService } from '../../lib/services';

import { ToastController } from 'ionic-angular';

import { FearladderModal } from '../fearladder/fearladder';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {

  private profile:string;
  public levels:Array<any>;

  constructor(
    public appCtrl: App,
    private restangular: Restangular,
    private userService: UserService,
    private storage: Storage,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    this.profile = this.userService.getUser();
  }

  ionViewWillEnter() {
    this.levels = [];
    // Build the levels array
    for(let i = 1; i <= 8; i++) {
      this.levels.push({ level: i, exercises: [] });
    }
    this.getExersises();
  }

  getExersises() {
    this.storage.get('fearLadder').then((fearLadder) => {
      fearLadder.forEach(step => {
        this.levels.find(level => level.level === step.fearRating).exercises.push(step);
      });
    });

    // We don't need to see the levels which has no exercises
    this.levels = this.levels.filter(level => { return level.exercises.length > 0 });

    this.setLevelsMonsterAndCompletion();
  }

  setLevelsMonsterAndCompletion() {
    if(!this.levels) return;
    this.levels.forEach(level => {
      level.done = level.exercises.find(item => item.exercise.completion < 100) ? false : true;

      // Get the level completion rate for the progress bar
      level.completion = level.done ? 100 : level.exercises.filter(item => item.exercise.completion >= 100).length * 100 / level.exercises.length;

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

  addFearsAndCompulsions() {
    let modal = this.modalCtrl.create(FearladderModal);

    modal.onDidDismiss(data => {
      // this.levels.push(data);
      // this.setLevelsMonsterAndCompletion();

      let toast = this.toastCtrl.create({
        message: 'You can allways change your fear ladder on your profile page',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok',
        dismissOnPageChange: true
      });
      toast.present();
    });

    modal.present();
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
