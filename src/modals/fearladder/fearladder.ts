import { Component } from '@angular/core';
import {
  NavParams,
  ViewController,
  ModalController,
  ToastController
} from 'ionic-angular';

import { FearladderStepModal } from '@/modals/fearladder/step/fearladder.step';

import { Step } from '@/lib/Exercise';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IFearLadderState } from '@/stores/fearLadder/fearLadder.reducer';
import { FearLadderActions } from '@/stores/fearLadder/fearLadder.action';
import { IStep } from '@/stores/exercise/exercise.model';

@Component({
  selector: 'fearladder-modal',
  templateUrl: 'fearladder.html'
})
export class FearladderModal {
  @select() readonly fearLadder$: Observable<IFearLadderState>;
  public fearLadder: Array<Step> = [];

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private fearLadderActions: FearLadderActions
  ) {
    // When user visits fearladder from home screen for the first time
    if (this.params.get('addNewFear')) this.addStep();
  }

  close() {
    this.viewCtrl.dismiss();
  }
  addStep() {
    let modal = this.modalCtrl.create(FearladderStepModal);
    modal.onDidDismiss(data => {
      if (!data) return; // Modal has been closed

      this.fearLadderActions.addFearLadderStep(data.step);

      let toast = this.toastCtrl.create({
        message: 'Fear added successfully',
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
    });

    modal.present();
  }

  editStep(step: IStep) {
    let modal = this.modalCtrl.create(FearladderStepModal, { step: step });

    modal.onDidDismiss(data => {
      if (!data) return; // Modal has been closed

      let toastParams = {
        duration: 2000,
        position: 'bottom',
        message: ''
      };

      if (data.remove) {
        toastParams.message = 'Fear removed successfully';
        this.fearLadderActions.removeFearLadderStep(step);
      } else {
        toastParams.message = 'Fear edited successfully';
        this.fearLadderActions.editFearLadderStep(step, { ...data.step });
      }

      const toast = this.toastCtrl.create(toastParams);
      toast.present();
    });

    modal.present();
  }
}
