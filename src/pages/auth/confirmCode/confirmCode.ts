import { Component } from '@angular/core';

import { Auth } from 'aws-amplify';

import { App, ToastController, NavParams } from 'ionic-angular';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'page-confirmCode',
  templateUrl: 'confirmCode.html'
})
export class ConfirmCodePage {
  private confirmCodeForm: FormGroup;
  private confirmationCode: AbstractControl;
  public confirmCodeButtonEnabled: boolean = true;
  private user: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private params: NavParams,
    private appCtrl: App
  ) {
    this.user = this.params.get('user');
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000
    });

    toast.present();
  }

  ngOnInit() {
    this.confirmCodeForm = this.formBuilder.group({
      confirmationCode: ['', <any>[Validators.required]]
    });

    this.confirmationCode = this.confirmCodeForm.controls['confirmationCode'];
  }

  confirmCode(): void {
    this.confirmCodeButtonEnabled = false;
    const { username } = this.user;
    Auth.confirmSignUp(username, this.confirmationCode.value)
      .then(response => {
        // Go back to the sign in page'
        // TODO: sign in automatically
        this.showMessage(`Signup completed, login to continue.`);
        this.appCtrl.getRootNav().pop();
      })
      .catch((error: any) => {
        this.confirmCodeButtonEnabled = true;
        switch (error.code) {
          case 'CodeMismatchException':
            this.showMessage(error.message);
            break;
          // default:
          //   console.log(error);
          //   break;
        }
      });
  }

  resendCode(): void {
    this.confirmCodeButtonEnabled = false;
    const { username } = this.user;
    Auth.resendSignUp(username)
      .then((response: any) => {
        this.confirmCodeButtonEnabled = true;
        this.showMessage(
          `Confirmation code has been resend to ${
            response.CodeDeliveryDetails.Destination
          }`
        );
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
