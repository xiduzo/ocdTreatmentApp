import { Component } from '@angular/core'

import { Auth } from 'aws-amplify'

import { App, ToastController, NavParams } from 'ionic-angular'
import { clearUserName, passwordCriteria } from '@lib/helpers'
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
  public password: AbstractControl
  public code: AbstractControl
  public actionButtonEnabled: boolean = true
  public receivedCode: boolean = false

  constructor(
    private toastCtrl: ToastController,
    private params: NavParams,
    private formBuilder: FormBuilder,
    private appCtrl: App
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group(
      {
        username: [ '', <any>[ Validators.required, Validators.minLength(6) ] ],
        code: [ '', <any>[] ],
        password: [ '', <any>[ Validators.minLength(8) ] ],
      },
      {
        validator: passwordCriteria('password'),
      }
    )

    this.username = this.forgotPasswordForm.controls['username']
    this.password = this.forgotPasswordForm.controls['password']
    this.code = this.forgotPasswordForm.controls['code']
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

  action = (): void => {
    if (!this.receivedCode) {
      return this.sendVerificationCode()
    }

    return this.resetPassword()
  }

  sendVerificationCode = (): void => {
    const username = this.username.value
    Auth.forgotPassword(username)
      .then((data) => {
        this.showMessage(
          `Confirmation code has been resend to ${data.CodeDeliveryDetails.Destination}`
        )
        this.receivedCode = true
      })
      .catch((error) => {
        this.showMessage(error.message ? error.message : error)
      })
  }

  resetPassword = (): void => {
    const username = this.username.value
    const code = this.code.value
    const new_password = this.password.value

    Auth.forgotPasswordSubmit(username, code, new_password)
      .then((data) => {
        console.log(`confirmed`)
      })
      .catch((error) => {
        this.showMessage(error.message ? error.message : error)
      })
  }
}
