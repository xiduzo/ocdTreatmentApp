import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService, UserService } from '../../lib/services';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(
    private appCtrl: App,
    public navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private storage: Storage
  ) {

  }

  ionViewDidLoad() {
    console.log(true);
  }

  logout() {
    this.authService.removeLocalToken();
    this.userService.removeUser();
    this.storage.set('onboardingCompleted', false);
    this.appCtrl.getRootNav().push(LoginPage);
  }

}
