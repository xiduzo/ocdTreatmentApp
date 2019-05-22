import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { Auth } from 'aws-amplify';

import { SignUpPage } from '@/pages/auth/signup/signup';
import { ConfirmCodePage } from '@/pages/auth/confirmCode/confirmCode';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private username: string;
  private password: string;
  public signInButtonEnabled: boolean = true;

  constructor(
    private appCtrl: App,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const loader = this.loadingCtrl.create({
      content: 'Loading user data...',
      duration: 60 * 1000
    });

    loader.present();

    Auth.currentAuthenticatedUser()
      .then(() => {
        loader.dismiss();
        // Auth user is handled in app.components.ts
      })
      .catch(error => {
        loader.dismiss();
      });
  }

  login() {
    this.signInButtonEnabled = false;
    Auth.signIn(this.username, this.password)
      .then(user => {
        this.showMessage(`Welcome back ${user.username}!`);
      })
      .catch(error => {
        this.signInButtonEnabled = true;
        switch (error.code) {
          case 'UserNotConfirmedException':
            this.appCtrl.getRootNav().push(ConfirmCodePage, {
              user: { username: this.username }
            });
            break;
          default:
            console.log(error);
            this.showMessage(error.message);
            break;
        }
      });
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000
    });

    toast.present();
  }

  signUp() {
    this.appCtrl.getRootNav().push(SignUpPage);
  }
}
