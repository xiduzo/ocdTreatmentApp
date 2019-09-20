import { Component } from '@angular/core'
import { App } from 'ionic-angular'
import { ToastController, LoadingController } from 'ionic-angular'

import { Auth } from 'aws-amplify'

import { SignUpPage } from '@pages/auth/signup/signup'
import { ConfirmCodePage } from '@pages/auth/confirmCode/confirmCode'

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { clearUserName } from '@lib/helpers'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loginForm: FormGroup
  private username: AbstractControl
  private password: AbstractControl
  public signInButtonEnabled: boolean = true

  constructor(
    private appCtrl: App,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.buildForm()
    const loader = this.loadingCtrl.create({
      content: 'Loading user data...',
      duration: 60 * 1000,
    })

    loader.present()

    Auth.currentAuthenticatedUser()
      .then(() => {
        loader.dismiss()
        // Auth user is handled in app.components.ts
      })
      .catch((error) => {
        loader.dismiss()
      })
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: [ '', <any>[ Validators.required, Validators.minLength(6) ] ],
      password: [ '', <any>[ Validators.required, Validators.minLength(8) ] ],
    })

    this.username = this.loginForm.controls['username']
    this.password = this.loginForm.controls['password']
  }

  login() {
    this.signInButtonEnabled = false
    const username = this.username.value
    const password = this.password.value
    Auth.signIn(clearUserName(username), password)
      .then((user) => {
        this.showMessage(`Welcome back ${user.username}!`)
      })
      .catch((error) => {
        this.signInButtonEnabled = true
        switch (error.code) {
          case 'UserNotConfirmedException':
            this.appCtrl.getRootNav().push(ConfirmCodePage, {
              user: { username, password },
            })
            break
          default:
            this.showMessage(error.message)
            break
        }
      })
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 5000,
    })

    toast.present()
  }

  signUp() {
    this.appCtrl.getRootNav().push(SignUpPage)
  }
}
