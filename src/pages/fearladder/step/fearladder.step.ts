import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Step }  from '../../../lib/exercise';

import { UUID } from 'angular2-uuid';

@Component({
  selector: 'fearladder-step-modal',
  templateUrl: 'fearladder.step.html'
})
export class FearladderStepModal {
  public step:Step = new Step();

  public buttonText:string = 'ADD';
  public headerText:string = 'FEARLADDER_STEP_HEADER_ADD';

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {
  }

  ionViewDidEnter() {
    // For when we edit a step
    if(this.params.get('step')) {
      this.step = this.params.get('step');
      this.buttonText = 'SAVE';
      this.headerText = 'FEARLADDER_STEP_HEADER_EDIT';
    };
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addFear() {
    this.viewCtrl.dismiss({step: this.step});
  }


}
