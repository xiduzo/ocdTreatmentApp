import { Component, ViewChild } from '@angular/core';
import { App, NavController, ModalController, TextInput } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Badge, BadgeFactory } from '@/lib/badge/Badge';

import { STREAK_BADGE } from '@/lib/badge/templates/streak';
import { EXERCISE_BADGE } from '@/lib/badge/templates/exercise';
import { FIRST_TIME_BADGE } from '@/lib/badge/templates/firstTime';
// import { TEST_ONE_BADGE } from '../../lib/badges/templates/test1';
// import { TEST_TWO_BADGE } from '../../lib/badges/templates/test2';
// import { TEST_THREE_BADGE } from '../../lib/badges/templates/test3';

import { SettingsModal } from '@/modals/settings/settings';
import { FearladderModal } from '@/modals/fearladder/fearladder';
import { EventsService } from 'angular-event-service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [BadgeFactory]
})
export class ProfilePage {
  @ViewChild('personalGoal') personalGoalTextArea: TextInput;

  public personalGoalText: string;
  public editGoal: boolean = false;
  public view: string = 'journey';
  public badges: Array<Badge> = [];
  private badgeTemplates: Array<any> = [
    STREAK_BADGE,
    EXERCISE_BADGE,
    FIRST_TIME_BADGE
    // TEST_ONE_BADGE,
    // TEST_TWO_BADGE,
    // TEST_THREE_BADGE,
  ];

  constructor(
    private appCtrl: App,
    public navCtrl: NavController,
    private storage: Storage,
    private modalCtrl: ModalController,
    private badgeFctry: BadgeFactory,
    private eventService: EventsService
  ) {
    this.badgeTemplates.forEach(badge => {
      this.badges.push(this.badgeFctry.createBadge(badge));
    });
  }

  ionViewWillLoad() {
    this.getPersonalGoal();
    this.eventService.on('badge_update', this.updateBadge.bind(this));
  }

  ionViewWillUnload() {
    this.eventService.destroyListener('badge_update', this.updateBadge);
  }

  updateBadge(badge: Badge) {
    const localBadge = this.badges.find(
      currBadge => currBadge.name == badge.name
    );

    if (localBadge) {
      localBadge.getProgress().then(() => {
        localBadge
          .setCurrentStage()
          .then(response => {
            localBadge.currentStage = response;
          })
          .catch(err => {
            console.log(`err: ${err}`);
          });
      });
    }
  }

  getPersonalGoal() {
    this.storage.get('personalGoal').then(goal => {
      if (!goal) return;

      this.personalGoalText = goal;
    });
  }

  safePersonalGoal() {
    this.storage.set('personalGoal', this.personalGoalText);
  }

  togglePersonalGoalEdit() {
    this.editGoal = !this.editGoal;

    // We need to wait a bit before the element is added to the DOM
    setTimeout(() => {
      if (this.editGoal) this.personalGoalTextArea.setFocus();
    }, 100);
  }

  openSettings() {
    let settingsModal = this.modalCtrl.create(SettingsModal);
    settingsModal.present();
  }

  openFearLadder() {
    let fearladderModal = this.modalCtrl.create(FearladderModal);
    fearladderModal.present();
  }

  showBadge(badge) {
    badge.showModal();
  }
}
