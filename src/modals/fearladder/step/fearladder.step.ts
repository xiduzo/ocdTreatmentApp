import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { Step, Fear } from '@lib/Exercise';
import { IStep } from '@stores/exercise/exercise.model';

@Component({
  selector: 'fearLadder-step-modal',
  templateUrl: 'fearLadder.step.html'
})
export class FearLadderStepModal {
  public step: IStep = new Step({ fearRating: 1 });

  public buttonText: string = 'ADD';
  public headerText: string = 'FEAR_LADDER_STEP_HEADER_ADD';

  public editStep: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private params: NavParams
  ) {}

  ionViewDidEnter() {
    // For when we edit a step
    if (this.params.get('step')) {
      this.step = this.params.get('step');
      this.editStep = true;

      // Change the button texts
      this.buttonText = 'SAVE';
      this.headerText = 'FEAR_LADDER_STEP_HEADER_EDIT';
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addFear() {
    this.viewCtrl.dismiss({ step: this.step });
  }

  removeFear() {
    const confirmation = this.alertCtrl.create({
      title: 'Are you sure you want to remove this fear?',
      message: 'This action is irreversible',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Remove fear',
          handler: () =>
            this.viewCtrl.dismiss({ step: this.step, remove: true })
        }
      ]
    });

    confirmation.present();
  }
}
