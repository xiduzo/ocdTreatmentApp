import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { Auth } from 'aws-amplify';

import { SignUpPage } from '@/pages/auth/signup/signup'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private username: string;
  private password: string;

  public signinButtonEnabled: boolean = true;

  constructor(
    private appCtrl: App,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    const loader = this.loadingCtrl.create({
      content: "Loading user data...",
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
    this.signinButtonEnabled = false;
    Auth.signIn(this.username, this.password)
      .then(user => {
        console.log(user);
        this.showMessage(`Welcome back ${user.username}!`);
      })
      .catch(error => {
        this.signinButtonEnabled = true;
        this.showMessage(error.message);
        console.log(error);
      })
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
