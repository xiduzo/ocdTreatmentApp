import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { Auth } from 'aws-amplify';

import { ToastController } from 'ionic-angular';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { ConfirmCodePage } from '@/pages/auth/confirmCode/confirmCode';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {
  private registerForm: FormGroup;
  private username: AbstractControl;
  private email: AbstractControl;
  private password: AbstractControl;

  public signupButtonEnabled: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private appCtrl: App
  ) {}

  passwordCriteria(passwordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/gm;

      const matches = regex.exec(group.controls[passwordKey].value);

      if (!matches) {
        return {
          weakPassword: true
        };
      }
    };
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', <any>[Validators.required, Validators.minLength(6)]],
        email: ['', <any>[Validators.required, Validators.email]],
        password: ['', <any>[Validators.required, Validators.minLength(6)]]
      },
      {
        validator: this.passwordCriteria('password')
      }
    );

    this.username = this.registerForm.controls['username'];
    this.email = this.registerForm.controls['email'];
    this.password = this.registerForm.controls['password'];
  }

  async showMessage(message: string) {
    console.log(message);
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000
    });

    toast.present();
  }

  back() {
    this.appCtrl.getRootNav().pop();
  }

  signUp() {
    this.signupButtonEnabled = false;
    Auth.signUp({
      username: this.username.value,
      password: this.password.value,
      attributes: {
        email: this.email.value
      }
    })
      .then((response: any) => {
        this.appCtrl.getRootNav().pop();
        this.appCtrl.getRootNav().push(ConfirmCodePage, {
          user: response.user
        });
      })
      .catch(error => {
        this.signupButtonEnabled = true;
        switch (error.code) {
          case 'UsernameExistsException':
            this.showMessage(`Username and/or email already registered`);
            break;
          // case 'InvalidParameterException':
          // this.showMessage(`Username and/or email already registered`);
          case 'InvalidPasswordException':
            const regex = /(?<=: ).*$/gm;
            const matches = regex.exec(error.message);
            this.showMessage(matches[0]);
          default:
            console.log(error);
        }
      });
  }
}
