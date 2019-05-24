import { Component } from '@angular/core';
import {
  NavParams,
  ViewController,
  ModalController,
  ToastController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FearladderStepModal } from '@/modals/fearladder/step/fearladder.step';

import { Step } from '@/lib/Exercise';

import { EventsService } from 'angular-event-service';

@Component({
  selector: 'fearladder-modal',
  templateUrl: 'fearladder.html'
})
export class FearladderModal {
  public fearLadder: Array<Step> = [];

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private storage: Storage,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private eventService: EventsService
  ) {
    this.storage.get('fearLadder').then(fearLadder => {
      if (!fearLadder) return;

      this.fearLadder = fearLadder;
    });

    if (this.params.get('addNewFear')) this.addStep();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  updateLocalFearLadder() {
    this.storage
      .set('fearLadder', this.fearLadder)
      .then(() =>
        this.eventService.broadcast('changed_fearladder', this.fearLadder)
      );
  }

  addStep() {
    let modal = this.modalCtrl.create(FearladderStepModal);

    modal.onDidDismiss(data => {
      if (!data) return; // Modal has been closed

      this.fearLadder.push(data.step);
      this.updateLocalFearLadder();

      let toast = this.toastCtrl.create({
        message: 'Fear added successfully',
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
    });

    modal.present();
  }

  editStep(step) {
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
        this.fearLadder.splice(this.fearLadder.indexOf(step), 1);
      } else {
        toastParams.message = 'Fear edited successfully';
        this.fearLadder[this.fearLadder.indexOf(step)] = data.step;
      }

      this.updateLocalFearLadder();

      const toast = this.toastCtrl.create(toastParams);
      toast.present();
    });

    modal.present();
  }
}
