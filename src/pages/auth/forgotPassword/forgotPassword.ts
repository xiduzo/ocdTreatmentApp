import { Component } from '@angular/core'

import { Auth } from 'aws-amplify'

import { App, ToastController, NavParams } from 'ionic-angular'
import { clearUserName } from '@lib/helpers'
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'page-forgotPassword',
  templateUrl: 'forgotPassword.html',
})
export class ForgotPasswordPage {
  public isSending: boolean = false
  public hasError: boolean = false
  public forgotPasswordForm: FormGroup
  public username: AbstractControl
  public actionButtonEnabled: boolean = true

  constructor(
    private toastCtrl: ToastController,
    private params: NavParams,
    private formBuilder: FormBuilder,
    private appCtrl: App
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      username: [ '', <any>[ Validators.required, Validators.minLength(6) ] ],
      // email: ['', <any>[Validators.required, Validators.email]],
      // password: ['', <any>[Validators.required, Validators.minLength(8)]],
    })

    this.username = this.forgotPasswordForm.controls['username']
    // this.email = this.registerForm.controls['email']
    // this.password = this.registerForm.controls['password']
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000,
    })

    toast.present()
  }

  back = (): void => {
    this.appCtrl.getRootNav().pop()
  }

  sendVerificationCode = () => {
    Auth.forgotPassword(this.username.value)
      .then(() => {
        console.log(`auth code send`)
      })
      .catch((error) => {
        this.showMessage(error)
      })
  }
}
