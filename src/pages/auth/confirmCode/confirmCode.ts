import { Component } from '@angular/core';

import { Auth } from 'aws-amplify';

import { ToastController } from 'ionic-angular';

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
  private registerForm: FormGroup;
  private username: AbstractControl;
  private email: AbstractControl;
  private password: AbstractControl;
  private password_repeat: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {}
}
