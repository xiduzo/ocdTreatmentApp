import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { UUID } from 'angular2-uuid';

@Component({
  selector: 'fearladder-step-modal',
  templateUrl: 'fearladder.step.html'
})
export class FearladderStepModal {

  public step:any = {
    id: UUID.UUID(),
    fearRating: 1,
    exercise: {
      situation: null,
      without: null
    },
    triggers: {
      obsessieThoughts: false,
      compulsieBehaiour: false
    }
  };
  public buttonText:string = 'add';
  public headerText:string = 'Add new fear';

  constructor(
    public viewCtrl: ViewController,
    private params: NavParams
  ) {

  }

  ionViewDidEnter() {
    // For when we edit a step
    if(this.params.get('step')) {
      this.step = this.params.get('step');
      this.buttonText = 'Save';
      this.headerText = 'Edit fear';
    };
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addFear() {
    this.viewCtrl.dismiss({step: this.step});
  }


}
