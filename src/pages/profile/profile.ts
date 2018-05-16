import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from 'ng2-translate';

import { AuthService, UserService } from '../../lib/services';

import { availableLanguages, sysOptions } from '../../lib/constants';

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
    private translate: TranslateService
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

  logout() {
    this.authService.removeLocalToken();
    this.userService.removeUser();
    // this.storage.set('onboardingCompleted', false);

    // Because we initiate with the login page we can pop the current app to
    // return to the login page
    this.appCtrl.getRootNav().pop();
  }

}
