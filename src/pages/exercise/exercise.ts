import { Component } from '@angular/core';
import { App, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  public test:string;

  constructor(
    public appCtrl: App,
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
    this.resetLevels();
  }

  resetLevels() {
    this.levels = [];
    // Build the levels array
    for(let i = 1; i <= 8; i++) {
      this.levels.push({ level: i, steps: [], completion: 0 });
    }
    this.getExersises();
  }

  getExersises() {
    this.storage.get('fearLadder').then((fearLadder) => {
      fearLadder.forEach(step => {
        this.levels.find(level => level.level === step.fearRating).steps.push(step);
      });

      // We don't need to see the levels which has no steps
      this.levels = this.levels.filter(level => { return level.steps.length > 0 });
      this.setLevelsMonsterAndCompletion();
    });

  }

  setLevelsMonsterAndCompletion() {
    this.levels.forEach(level => {
      level.completion = level.steps.filter(steps => { return steps.fear.completion >= 100;}).length * 100 / level.steps.length;
      level.monster = 'assets/imgs/monsters/monster-0'+level.level+'.png';
    });

  }

  addFearsAndCompulsions() {
    let modal = this.modalCtrl.create(FearladderModal);

    modal.onDidDismiss(data => {
      this.setLevelsMonsterAndCompletion();

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
    if(!level.steps.length) return;

    // Also dont need to go there if the level is done
    if(level.done) return;

    this.appCtrl.getRootNav().push(ExerciseListPage, {
      level: level
    });
  }


}
