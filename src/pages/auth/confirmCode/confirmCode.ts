import { Component } from '@angular/core'

import { Auth } from 'aws-amplify'

import { App, ToastController, NavParams } from 'ionic-angular'
import { clearUserName } from '@lib/helpers'

@Component({
  selector: 'page-confirmCode',
  templateUrl: 'confirmCode.html',
})
export class ConfirmCodePage {
  private user: any
  public isSending: boolean = false
  public hasError: boolean = false

  constructor(private toastCtrl: ToastController, private params: NavParams, private appCtrl: App) {
    this.user = this.params.get('user')
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000,
    })

    toast.present()
  }

  confirmCode(code: number): void {
    this.isSending = true
    this.hasError = false
    const { username, password } = this.user
    Auth.confirmSignUp(username, `${code}`)
      .then((response) => {
        this.appCtrl.getRootNav().pop()
        Auth.signIn(clearUserName(username), password).then((user) => {
          this.showMessage(`Welcome back ${user.username}!`)
        })
      })
      .catch((error: any) => {
        this.isSending = false
        this.hasError = true
        switch (error.code) {
          case 'CodeMismatchException':
            this.showMessage(error.message)
            break
          default:
            // TODO: add more cases
            this.showMessage(error.message)
            break
        }
      })
  }

  resendCode(): void {
    const { username } = this.user
    Auth.resendSignUp(username)
      .then((response: any) => {
        this.showMessage(
          `Confirmation code has been resend to ${response.CodeDeliveryDetails.Destination}`
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
