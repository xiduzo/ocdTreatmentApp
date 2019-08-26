import { Component, ViewChild } from '@angular/core';
import { ModalController, TextInput, Modal } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SettingsModal } from '@modals/settings/settings';
import { FearLadderModal } from '@modals/fearLadder/fearLadder';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IBadgeState } from '@stores/badge/badge.reducer';
import { IBadge } from '@stores/badge/badge.model';
import { BadgeModal } from '@modals/badge/badge';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  @ViewChild('personalGoal') personalGoalTextArea: TextInput;
  @select() readonly badges$: Observable<IBadgeState>;

  public personalGoalText: string;
  public editGoal: boolean = false;

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {}

  ionViewWillLoad = (): void => {
    this.getPersonalGoal();
  };

  getPersonalGoal = (): void => {
    this.storage.get('personalGoal').then((goal: string) => {
      if (!goal) return;

      this.personalGoalText = goal;
    });
  };

  safePersonalGoal = (goal: string): void => {
    this.personalGoalText = goal;
    this.storage.set('personalGoal', goal);
  };

  editPersonalGoal = async (): Promise<void> => {
    const prompt = await this.alertCtrl.create({
      title: 'Goal',
      message: 'What would you like to achieve',
      inputs: [
        {
          name: 'goal',
          placeholder: this.personalGoalText
            ? this.personalGoalText
            : 'No goal specified yet'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {}
        },
        {
          text: 'Save',
          handler: (data: any) => this.safePersonalGoal(data.goal)
        }
      ]
    });
    await prompt.present();
  };

  openSettings = async (): Promise<void> => {
    const modal: Modal = await this.modalCtrl.create(SettingsModal);
    await modal.present();
  };

  openFearLadder = async (): Promise<void> => {
    const modal: Modal = await this.modalCtrl.create(FearLadderModal);
    await modal.present();
  };

  openBadge = async (badge: IBadge): Promise<void> => {
    const modal: Modal = await this.modalCtrl.create(BadgeModal, {
      badge
    });
    await modal.present();
  };
}
