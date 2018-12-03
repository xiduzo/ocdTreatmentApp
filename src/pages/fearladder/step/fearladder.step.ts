import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Step, Fear }  from '../../../lib/Exercise';

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
      console.log(this.params.get('step'), this.step);
      this.buttonText = 'SAVE';
      this.headerText = 'FEARLADDER_STEP_HEADER_EDIT';
    } else {
      this.step.addEmptyTriggers();
      this.step.fear = new Fear();
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addFear() {
    this.viewCtrl.dismiss({step: this.step});
  }


}
