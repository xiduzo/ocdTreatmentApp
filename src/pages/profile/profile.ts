import { Component, ViewChild } from '@angular/core';
import { ModalController, TextInput, Modal } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SettingsModal } from '@modals/settings/settings';
import { FearLadderModal } from '@modals/fearLadder/fearLadder';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  @ViewChild('personalGoal') personalGoalTextArea: TextInput;

  public personalGoalText: string;
  public editGoal: boolean = false;

  constructor(private storage: Storage, private modalCtrl: ModalController) {}

  ionViewWillLoad = (): void => {
    this.getPersonalGoal();
  };

  getPersonalGoal = (): void => {
    this.storage.get('personalGoal').then((goal: string) => {
      if (!goal) return;

      this.personalGoalText = goal;
    });
  };

  safePersonalGoal = (): void => {
    this.storage.set('personalGoal', this.personalGoalText);
  };

  togglePersonalGoalEdit = (): void => {
    this.editGoal = !this.editGoal;

    // We need to wait a bit before the element is added to the DOM
    setTimeout(() => {
      if (this.editGoal) this.personalGoalTextArea.setFocus();
    }, 100);
  };

  openSettings = async (): Promise<void> => {
    const modal: Modal = await this.modalCtrl.create(SettingsModal);
    await modal.present();
  };

  openFearLadder = async (): Promise<void> => {
    const modal: Modal = await this.modalCtrl.create(FearLadderModal);
    await modal.present();
  };
}
