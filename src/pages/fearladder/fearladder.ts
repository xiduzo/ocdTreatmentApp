import { Component } from '@angular/core';
import { ViewController, ModalController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FearladderStepModal } from '../fearladder/step/fearladder.step';

import { Step }  from '../../lib/exercise';

@Component({
  selector: 'fearladder-modal',
  templateUrl: 'fearladder.html'
})
export class FearladderModal {
  public fearLadder:Array<Step> = [];

  constructor(
    private viewCtrl: ViewController,
    private storage: Storage,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    this.storage.get('fearLadder').then((fearLadder) => {
      fearLadder.forEach(step => {
        this.fearLadder.push(new Step(step));
      });
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  updateLocalFearLadder() {
    // Update fearladder
    this.storage.set('fearLadder', this.fearLadder);
  }

  addStep() {
    let modal = this.modalCtrl.create(FearladderStepModal);

    modal.onDidDismiss((data) => {
      if(!data) return; // Modal has been closed

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

  removeStep(step) {
    this.fearLadder.splice(this.fearLadder.indexOf(step), 1);
    this.updateLocalFearLadder();
  }

  editStep(step) {
    console.log(step);
    let modal = this.modalCtrl.create(FearladderStepModal, {step: step});

    modal.onDidDismiss((data) => {
      if(!data) return; // Modal has been closed

      this.fearLadder[this.fearLadder.indexOf(step)] = data.step;
      this.updateLocalFearLadder();

      let toast = this.toastCtrl.create({
        message: 'Fear edited successfully',
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
    });

    modal.present();
  }
}
