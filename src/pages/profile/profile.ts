import { Component } from '@angular/core';
import { App, NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { AuthService, UserService } from '../../lib/services';

import { BadgeModal } from '../badge/badge';
import { Badge, BadgeFactory } from '../../lib/badges/Badge';
import { STREAK_BADGE } from '../../lib/badges/templates/streak';

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

  constructor(
    private appCtrl: App,
    public navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private storage: Storage,
    private emailComposer: EmailComposer,
    private notifications: LocalNotifications,
    private modalCtrl: ModalController,
    private badgeFctry: BadgeFactory,
  ) {
    const badge = this.badgeFctry.createBadge(STREAK_BADGE);
    this.badges.push(badge);
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

  sendFearLadder() {
    this.emailComposer.isAvailable().then((available: boolean) => {
      // TODO https://forum.ionicframework.com/t/how-to-create-a-json-file-ionic-3/105939/3
      alert(available);
      let email = {
        to: 'mail@sanderboer.nl',
        attachments: [
          'file://img/logo.png',
          'res://icon.png',
          'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
          'file://README.pdf'
        ],
        subject: 'Test mail ionic',
        body: 'Whattttttt',
        isHtml: true
      };
      this.emailComposer.open(email);
    });
  }

  showNotification() {
    this.notifications.schedule({
      id: 1,
      title: 'test notification title',
      text: 'test notification text',
      launch: true,
      priority: 2,
      trigger: { at: new Date(new Date().getTime() + 3600) }
    });
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
    let badgeModal = this.modalCtrl.create(BadgeModal);
    badgeModal.present();
  }

}
