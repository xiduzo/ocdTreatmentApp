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
    return (
      level
        // Map to array of completion percentages
        .map(
          (step: IStep): number =>
            // Use constant to calculate completion of step
            (step.fear.completion * 100) / FEAR_COMPLETION_POSITIVE_LIMIT
        )
        // Combine all the percentages into one number
        .reduce(
          (previousValue: number, currentValue: number): number =>
            currentValue + previousValue,
          0 // <-- Starting count of reduce
        ) / level.length // Divide by amount of steps we have
    );
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

    // Also don't need to go there if the level is done
    // if (level.done) return;

    this.appCtrl.getRootNav().push(ExerciseListModal, {
      level: level
    });
  }
}
