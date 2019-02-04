import { Component } from '@angular/core';
import { App, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ExerciseListPage } from '../exercise/list/exercise.list';

import { UserService } from '../../lib/services';

import { ToastController } from 'ionic-angular';

import { FearladderModal } from '../fearladder/fearladder';

import { EventsService } from 'angular-event-service';

import { Level } from '../../lib/Level';
import { Step } from '../../lib/Exercise';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {

  private profile: string;
  public levels: Array<Level>;
  public test: string;

  constructor(
    public appCtrl: App,
    private userService: UserService,
    private storage: Storage,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private eventService: EventsService
  ) {
  }

  ionViewDidLoad() {
    this.profile = this.userService.getUser();
    this.setLevels();
  }

  ionViewWillEnter() {
    this.eventService.on('new_level_completion', this.newLevelCompletion.bind(this));
  }

  ionViewWillLeave() {
    this.eventService.destroyListener('new_level_completion', this.newLevelCompletion);
  }

  newLevelCompletion(level: Level) {
    console.log(level);
    this.levels.find(currLevel => currLevel.id === level.id).completion = level.completion;
    this.getExersises();
  }

  setLevels() {
    this.levels = [1, 2, 3, 4, 5, 6, 7, 8].map(level => new Level({ number: level }));
    this.getExersises();
  }

  getExersises() {
    this.storage.get('fearLadder').then(fearLadder => {
      if (!fearLadder) return;

      // TODO: fix this ugly code, it could be done faster I think
      this.levels.forEach(level => level.steps = []);
      fearLadder.forEach(step => {
        this.levels.find(level => level.number === step.fearRating).steps.push(new Step(step));
      });

      // We don't need to see the levels which has no steps
      this.levels = this.levels.filter(level => level.steps.length > 0);
      this.setLevelsMonsterAndCompletion();
    });

  }

  setLevelsMonsterAndCompletion() {
    this.levels.forEach(level => {
      level.calculateCompletion();
      level.isLevelDone();
      level.monster = `assets/imgs/monsters/monster-0${level.number}.svg`;
      level.monster_sized = `assets/imgs/monsters/monster-0${level.number}_sized.svg`;
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
    if (!level.steps.length) return;

    // Also dont need to go there if the level is done
    if (level.done) return;

    this.appCtrl.getRootNav().push(ExerciseListPage, {
      level: level
    });
  }


}
