import { Component } from '@angular/core';
import { App, NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';

import { AuthService, UserService } from '../../lib/services';

import { Badge, BadgeFactory } from '../../lib/badge/Badge';

import { STREAK_BADGE } from '../../lib/badge/templates/streak';
import { EXERCISE_BADGE } from '../../lib/badge/templates/exercise';
import { FIRST_TIME_BADGE } from '../../lib/badge/templates/firstTime';
// import { TEST_ONE_BADGE } from '../../lib/badges/templates/test1';
// import { TEST_TWO_BADGE } from '../../lib/badges/templates/test2';
// import { TEST_THREE_BADGE } from '../../lib/badges/templates/test3';

import { SettingsModal } from '../../modals/settings/settings';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [BadgeFactory]
})
export class ProfilePage {

  public personalGoal: string;
  public editGoal: boolean = false;
  public view: string = 'journey';
  public badges: Array<Badge> = [];
  private badgeTemplates: Array<any> = [
    STREAK_BADGE,
    EXERCISE_BADGE,
    FIRST_TIME_BADGE,
    // TEST_ONE_BADGE,
    // TEST_TWO_BADGE,
    // TEST_THREE_BADGE,
  ];

  constructor(
    private appCtrl: App,
    public navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private storage: Storage,
    private emailComposer: EmailComposer,
    private modalCtrl: ModalController,
    private badgeFctry: BadgeFactory,
  ) {
    this.badgeTemplates.forEach(badge => {
      this.badges.push(this.badgeFctry.createBadge(badge));
    });
  }

  ionViewDidLoad() {
    this.storage.get('personalGoal').then((goal) => {
      if (!goal) return;

      this.personalGoal = goal;
    });
  }

  openSettings() {
    let settingsModal = this.modalCtrl.create(SettingsModal);
    settingsModal.present();
  }

  safePersonalGoal() {
    this.storage.set('personalGoal', this.personalGoal);
  }

  logout() {
    this.authService.removeLocalToken();
    this.userService.removeUser();
    // this.storage.set('onboardingCompleted', false);

    // Because we initiate with the login page we can pop the current app to
    // return to the login page
    this.appCtrl.getRootNav().pop();
  }

  showBadge(badge) {
    badge.showModal();
  }

}
