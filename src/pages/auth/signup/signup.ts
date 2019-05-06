import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  private registerForm: FormGroup;
  private username: AbstractControl;
  private email: AbstractControl;
  private password: AbstractControl;
  private password_repeat: AbstractControl;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): { [key: string]: any } => {
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
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_repeat: ['', [Validators.required]],
    }, { validator: this.matchingPasswords('password', 'password_repeat') });

    this.username = this.registerForm.controls['username'];
    this.email = this.registerForm.controls['email'];
    this.password = this.registerForm.controls['password'];
    this.password_repeat = this.registerForm.controls['password_repeat'];
  }

  signUp() {
    
  }
}
