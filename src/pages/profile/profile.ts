import { Component } from '@angular/core';
import { App, NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { TranslateService } from 'ng2-translate';

import { AuthService, UserService } from '../../lib/services';
import { availableLanguages, sysOptions } from '../../lib/constants';

import { FearladderModal } from '../fearladder/fearladder';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public language:string;
  public languages:any;

  constructor(
    private appCtrl: App,
    public navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private storage: Storage,
    private translate: TranslateService,
    private emailComposer: EmailComposer,
    private notifications: LocalNotifications,
    private modalCtrl: ModalController
  ) {
    this.languages = availableLanguages;
    this.storage.get('language').then((val) => {
      this.language = val;
    });
  }

  updateAppLanguage() {
    this.translate.use(this.language);
    sysOptions.systemLanguage = this.language;
    this.storage.set('language', this.language);
  }

  sendFearLadder() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
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

  logout() {
    this.authService.removeLocalToken();
    this.userService.removeUser();
    // this.storage.set('onboardingCompleted', false);

    // Because we initiate with the login page we can pop the current app to
    // return to the login page
    this.appCtrl.getRootNav().pop();
  }

  editFearLadder() {
    let modal = this.modalCtrl.create(FearladderModal);
    modal.present();
  }

}
