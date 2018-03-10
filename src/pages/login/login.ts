import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


import { AuthService, UserService } from '../../lib/services';
import { Restangular } from 'ngx-restangular';
import { OnboardingPage } from '../onboarding/onboarding';
import { SignUpPage } from '../signup/signup'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private username:string;
  private password:string;

  constructor(
    private appCtrl: App,
    private restangular: Restangular,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private userService: UserService
  ) {
  }


  ngOnInit() {

  }

  login() {
    const data = {
      username: this.username,
      password: this.password
    };
    this.restangular.one('users/validate').get(data).subscribe((response) => {
      this.userService.setUser(response.plain()[0].profile);
      if(response.plain().length === 1) {
        this.authService.getJwtToken(data)
        .then((resp) => {
          this.authService.setLocalToken(resp.token);
          this.appCtrl.getRootNav().push(OnboardingPage);
        })
        .catch((err) => {
          this.toastCtrl.create({
            message: 'Wrong combination of username and password',
            position: 'middle',
            duration: 3000
          }).present();
        });
      } else {
        console.log("user doesnt exist");
      }
    });
  }

  signUp() {
    this.appCtrl.getRootNav().push(SignUpPage);
  }

}
