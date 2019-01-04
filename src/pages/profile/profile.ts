import { Component } from '@angular/core';
import { App, NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';

import { AuthService, UserService } from '../../lib/services';

import { Badge, BadgeFactory } from '../../lib/badges/Badge';
import { STREAK_BADGE } from '../../lib/badges/templates/streak';
import { EXERCISE_BADGE } from '../../lib/badges/templates/exercise';

import { SettingsPage } from '../settings/settings';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [BadgeFactory]
})
export class ProfilePage {

  public personalGoal: string;
  public editGoal: boolean = false;
  public view: string = 'achievements';
  public badges: Array<Badge> = [];
  private badgeTemplates: Array<any> = [
    STREAK_BADGE,
    EXERCISE_BADGE
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
    let settingsModal = this.modalCtrl.create(SettingsPage);
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
