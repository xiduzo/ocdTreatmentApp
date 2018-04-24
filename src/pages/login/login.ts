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
  private err:any;

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
      if(response.data.plain().length === 1) {
        this.userService.setUser(response.data.plain()[0].profile);
        this.authService.getJwtToken(data)
        .then((resp:any) => {
          this.authService.setLocalToken(resp.token);
          this.appCtrl.getRootNav().push(OnboardingPage);
        })
        .catch((err) => {
          this.err = err;
          // this.toastCtrl.create({
          //   message: 'Wrong combination of username and password',
          //   position: 'middle',
          //   duration: 3000
          // }).present();
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
