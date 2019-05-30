import { Component } from '@angular/core';
import { App, ModalController } from 'ionic-angular';

import { ExerciseListModal } from '@/modals/exercise/list/exercise.list';

import { ToastController } from 'ionic-angular';

import { FearladderModal } from '@/modals/fearladder/fearladder';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { FEAR_COMPLETION_POSITIVE_LIMIT } from '@/lib/constants';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IFearLadderState } from '@/stores/fearLadder/fearLadder.reducer';
import { IStep } from '@/stores/exercise/exercise.model';

import { getLevelCompletion } from '@/lib/Level';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {
  @select() readonly fearLadder$: Observable<IFearLadderState>;

  constructor(
    public appCtrl: App,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {}

  getCompletion(level: IStep[]): number {
    return getLevelCompletion(level);
  }

  addFearsAndCompulsions() {
    let modal = this.modalCtrl.create(FearladderModal, {
      addNewFear: true
    });

    modal.onDidDismiss(data => {
      // this.setLevelsMonsterAndCompletion();

      this.translate
        .get('MESSAGE_CHANGE_FEAR_LADDER')
        .subscribe((text: string) => {
          const toast = this.toastCtrl.create({
            message: text,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Ok',
            dismissOnPageChange: true
          });
          toast.present();
        });
    });

    modal.present();
  }

  goToLevel(level: IStep[]): void {
    // Don't need to go there if there are no exercises
    if (!level.length) return;

    this.appCtrl.getRootNav().push(ExerciseListModal, {
      level: level
    });
  }
}
