import { Component } from '@angular/core';
import { App } from 'ionic-angular';
//import { ToastController } from 'ionic-angular';

import { AuthService, UserService } from '@/lib/services';
import { OnboardingPage } from '@/pages/onboarding/onboarding';
import { SignUpPage } from '@/pages/signup/signup'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private username:string;
  private password:string;
  private err:any;

  constructor(
    private appCtrl: App,
    private authService: AuthService,
    //private toastCtrl: ToastController,
    private userService: UserService
  ) {
  }

  login() {
    this.err = { text: 'logging in'};
    const data = {
      username: this.username,
      password: this.password
    };
  }

  signUp() {
    this.appCtrl.getRootNav().push(SignUpPage);
  }

}
