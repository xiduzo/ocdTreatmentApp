import { Component } from '@angular/core';
import { App, ModalController } from 'ionic-angular';

import { ExerciseListModal } from '@/modals/exercise/list/exercise.list';

import { ToastController } from 'ionic-angular';

import { FearLadderModal } from '@/modals/fearLadder/fearLadder';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { FEAR_COMPLETION_POSITIVE_LIMIT } from '@/lib/constants';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IFearLadderState } from '@/stores/fearLadder/fearLadder.reducer';
import { IStep } from '@/stores/exercise/exercise.model';

import { getLevelCompletion } from '@/lib/Level';
import { IFearLadder } from '@/stores/fearLadder/fearLadder.model';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {
  @select() readonly fearLadder$: Observable<IFearLadderState>;

  public levels: IFearLadder[] = [];

  constructor(
    public appCtrl: App,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {
    this.fearLadder$.subscribe((fearLadderState: IFearLadderState) => {
      this.levels = fearLadderState.steps
        .reduce((a, b) => {
          (a[b['fearRating']] = a[b['fearRating']] || []).push(b);
          return a;
        }, [])
        .filter(arr => arr.length)
        .map(
          (steps: IStep[]): IFearLadder => {
            return {
              stepNumber: steps[0].fearRating,
              steps: steps,
              completion: getLevelCompletion(steps)
            };
          }
        );
    });
  }

  addFearsAndCompulsions() {
    let modal = this.modalCtrl.create(FearLadderModal, {
      addNewFear: true
    });

    modal.onDidDismiss(data => {
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

  goToLevel(level: IFearLadder): void {
    // Don't need to go there if there are no exercises
    if (!level.steps.length) return;

    this.appCtrl.getRootNav().push(ExerciseListModal, {
      level: level
    });
  }
}
