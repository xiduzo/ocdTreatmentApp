import { Component } from '@angular/core';
import { ViewController, ModalController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FearladderStepModal } from '../fearladder/step/fearladder.step'

@Component({
  selector: 'fearladder-modal',
  templateUrl: 'fearladder.html'
})
export class FearladderModal {

  public fearLadder:Array<any> = [];

  constructor(
    private viewCtrl: ViewController,
    private storage: Storage,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {

  }

  ionViewDidEnter() {
    this.storage.get('fearLadder').then((fearLadder) => {
      if(!fearLadder) return;

      this.fearLadder = fearLadder;
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addStep() {
    let modal = this.modalCtrl.create(FearladderStepModal);

    modal.onDidDismiss((data) => {
      if(!data) return; // Modal has been closed

      // Use concat instead of push to hack array update for 'groupBy' pipe
      this.fearLadder = this.fearLadder.concat([data.step])

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
    let modal = this.modalCtrl.create(FearladderStepModal, {step: step});

    modal.onDidDismiss((data) => {
      if(!data) return; // Modal has been closed

      // There must be a better way to update the angular2 pipes...
      // right...
      // ??
      // B/c this is bullshit
      let fearLadderClone = Object.assign([], this.fearLadder);
      fearLadderClone[fearLadderClone.indexOf(step)] = data.step;
      this.fearLadder = [];
      this.fearLadder = this.fearLadder.concat(fearLadderClone);

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
