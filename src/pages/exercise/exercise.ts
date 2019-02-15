import { Component } from '@angular/core';
import { App, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ExerciseListModal } from '../../modals/exercise/list/exercise.list';

import { ToastController } from 'ionic-angular';

import { FearladderModal } from '../../modals/fearladder/fearladder';

import { EventsService } from 'angular-event-service';

import { Level } from '../../lib/Level';
import { Step } from '../../lib/Exercise';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {

  public levels: Array<Level>;

  constructor(
    public appCtrl: App,
    private storage: Storage,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private eventService: EventsService,
    private translate: TranslateService
  ) {
  }

  ionViewWillLoad() {
    this.getExersises();
    this.eventService.on('new_level_completion', this.newLevelCompletion.bind(this));
    this.eventService.on('changed_fearladder', this.newFearladder.bind(this));
  }

  ionViewWillUnload() {
    this.eventService.destroyListener('new_level_completion', this.newLevelCompletion);
    this.eventService.destroyListener('changed_fearladder', this.newFearladder);
  }

  newLevelCompletion(level: Level) {
    const localLevel = this.levels.find(currLevel => currLevel.number === level.number);

    if(localLevel) {
      this.levels[this.levels.indexOf(localLevel)].completion = level.completion;
      this.levels[this.levels.indexOf(localLevel)].isLevelDone();
    }
  }

  newFearladder(fearladder: Array<Step>) {
    this.getExersises();
  }

  getExersises() {
    this.storage.get('fearLadder').then(fearLadder => {
      if (!fearLadder) return this.levels = [];
      this.levels = [1, 2, 3, 4, 5, 6, 7, 8].map(level => new Level({ number: level }));

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
    let modal = this.modalCtrl.create(FearladderModal, {
      addNewFear: true
    });

    modal.onDidDismiss(data => {
      this.setLevelsMonsterAndCompletion();

      this.translate.get('MESSAGE_CHANGE_FEAR_LADDER').subscribe(text => {
        let toast = this.toastCtrl.create({
          message: text,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Ok',
          dismissOnPageChange: true
        });
        toast.present();
      });
    });

    modal.present();
  }

  goToLevel(level) {
    // Dont need to go there if there are no exercises
    if (!level.steps.length) return;

    // Also dont need to go there if the level is done
    if (level.done) return;

    this.appCtrl.getRootNav().push(ExerciseListModal, {
      level: level
    });
  }


}
