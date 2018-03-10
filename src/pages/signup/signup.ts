import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import {
  animateChild,
  query,
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

import { AuthService } from '../../lib/services';
import { Restangular } from 'ngx-restangular';
import { OnboardingPage } from '../onboarding/onboarding';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  animations: [
    trigger('showErrors', [
      transition(':enter, :leave', [
        query('@*', animateChild())
      ])
    ]),
    trigger('showError', [
      state('void', style({transform: 'translateX(-100%)'})),
      state('*', style({transform: 'translateX(0)'})),
      transition('void => *', animate('300ms ease-in'))
    ])
  ]
})
export class SignUpPage {

  // private username:string;
  // private password:string;
  // private password_repeat:string;
  // private email:string;
  // public errors:any = {
  //   email: '',
  //   username: 'test'
  // };

  private registerForm:FormGroup;
  private username:AbstractControl;
  private email:AbstractControl;
  private password:AbstractControl;
  private password_repeat:AbstractControl;

  constructor(
    private appCtrl: App,
    private restangular: Restangular,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) {
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  ngOnInit() {
    // console.log(this.password.value());
    this.registerForm = this.formBuilder.group({
      username:['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      password_repeat:['', [Validators.required]],
    }, { validator: this.matchingPasswords('password', 'password_repeat')});

    this.username = this.registerForm.controls['username'];
    this.email = this.registerForm.controls['email'];
    this.password = this.registerForm.controls['password'];
    this.password_repeat = this.registerForm.controls['password_repeat'];
  }

  signUp() {
    console.log(this.registerForm);
    this.restangular.all('users/create').post({
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value,
      email: this.registerForm.controls.email.value
    })
    .subscribe((resp) => {
      console.log(resp)
    }, (err) => {
      console.log(err);
      if(err.data.email) {
      }
      if(err.data.username) {
      }
    });
  }

  // signUp() {
  //   if(!this.username || !this.password || !this.password_repeat || !this.email) {
  //     return this.toastCtrl.create({
  //       message: 'Please fill in out all the fields',
  //       position: 'middle',
  //       duration: 3000
  //     }).present();
  //   }
  //
  //   if(!this.validateEmail(this.email)) {
  //     return this.toastCtrl.create({
  //       message: 'Provide a valid email',
  //       position: 'middle',
  //       duration: 3000
  //     }).present();
  //   }
  //
  //   if(this.password !== this.password_repeat) {
  //     return this.toastCtrl.create({
  //       message: 'Passwords don\'t match',
  //       position: 'middle',
  //       duration: 3000
  //     }).present();
  //   }
  //
    // this.restangular.all('users/create').post({
    //   username: this.username,
    //   password: this.password,
    //   email: this.email
    // })
    // .subscribe((resp) => {
    //   console.log(resp)
    // }, (err) => {
    //   if(err.data.email) {
    //     this.errors.email = err.data.email;
    //     // this.errors.push(err.data.email);
    //   }
    //   if(err.data.username) {
    //     this.errors.username = err.data.username;
    //     // this.errors.push(err.data.username);
    //   }
    //   console.log(err);
    // });
  // }

}
