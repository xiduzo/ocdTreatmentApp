import { Component } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';

import { FearLadderStepModal } from '@/modals/fearLadder/step/fearLadder.step';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { IFearLadderState } from '@/stores/fearLadder/fearLadder.reducer';
import { FearLadderActions } from '@/stores/fearLadder/fearLadder.action';
import { IStep } from '@/stores/exercise/exercise.model';
import { IFearLadder } from '@/stores/fearLadder/fearLadder.model';

import { generateLevelsFromFearLadderSteps } from '@/lib/Level';

@Component({
  selector: 'fearLadder-modal',
  templateUrl: 'fearLadder.html'
})
export class FearLadderModal {
  @select() readonly fearLadder$: Observable<IFearLadderState>;

  public levels: IFearLadder[] = [];

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private fearLadderActions: FearLadderActions
  ) {
    // When user visits fearLadder from home screen for the first time
    if (this.params.get('addNewFear')) this.addStep();

    this.fearLadder$.subscribe((fearLadderState: IFearLadderState) => {
      this.levels = generateLevelsFromFearLadderSteps(
        fearLadderState.steps || []
      );
    });
  }

  close() {
    // TODO: fix this with angular routing
    // this.viewCtrl.dismiss();
  }
  addStep = async (): Promise<void> => {
    let modal = await this.modalCtrl.create({
      component: FearLadderStepModal
    });

    // TODO
    // FIX THIS CALLBACK
    // modal.onDidDismiss(data => {
    //   if (!data) return; // Modal has been closed

    //   this.fearLadderActions.addFearLadderStep(data.step);

    //   let toast = this.toastCtrl.create({
    //     message: 'Fear added successfully',
    //     duration: 2000,
    //     position: 'bottom'
    //   });

    //   toast.present();
    // });

    modal.present();
  };

  editStep = async (step: IStep): Promise<void> => {
    const modal = await this.modalCtrl.create({
      component: FearLadderStepModal,
      componentProps: {
        step: step
      }
    });

    // TODO
    // FIX THIS CALLBACK
    // modal.onDidDismiss(data => {
    //   if (!data) return; // Modal has been closed

    //   let toastParams = {
    //     duration: 2000,
    //     position: 'bottom',
    //     message: ''
    //   };

    //   if (data.remove) {
    //     toastParams.message = 'Fear removed successfully';
    //     this.fearLadderActions.removeFearLadderStep(step);
    //   } else {
    //     toastParams.message = 'Fear edited successfully';
    //     this.fearLadderActions.editFearLadderStep(step, { ...data.step });
    //   }

    //   const toast = this.toastCtrl.create(toastParams);
    //   toast.present();
    // });

    modal.present();
  };
}
