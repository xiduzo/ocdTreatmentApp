import { Component } from '@angular/core';
import { App, ModalController } from 'ionic-angular';

import { ExerciseListModal } from '@modals/exercise/list/exercise.list';

import { ToastController } from 'ionic-angular';

import { FearLadderModal } from '@modals/fearLadder/fearLadder';

import { TranslateService } from '@ngx-translate/core';

import { FEAR_COMPLETION_POSITIVE_LIMIT } from '@lib/constants';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { IFearLadderState } from '@stores/fearLadder/fearLadder.reducer';

import { generateLevelsFromFearLadderSteps } from '@lib/Level';
import { IFearLadder } from '@stores/fearLadder/fearLadder.model';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {
  @select() readonly fearLadder$: Observable<IFearLadderState>;

  public levels: IFearLadder[] = [];

  public emptyStateCallBack: Function;

  constructor(
    public appCtrl: App,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {
    this.fearLadder$.subscribe((fearLadderState: IFearLadderState) => {
      this.levels = generateLevelsFromFearLadderSteps(
        fearLadderState.steps || []
      );
    });
  }

  ngOnInit = (): void => {
    this.addFearsAndCompulsions = this.addFearsAndCompulsions.bind(this);
  };

  addFearsAndCompulsions = async (event: any) => {
    let modal = await this.modalCtrl.create(FearLadderModal, {
      addNewFear: true
    });

    modal.onDidDismiss((data: any) => {
      this.translate
        .get('MESSAGE_CHANGE_FEAR_LADDER')
        .subscribe(async (text: string) => {
          const toast = await this.toastCtrl.create({
            message: text,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Ok',
            dismissOnPageChange: true
          });
          await toast.present();
        });
    });

    await modal.present();
  };

  goToLevel = (level: IFearLadder): void => {
    this.appCtrl.getRootNav().push(ExerciseListModal, {
      level: level
    });
  };
}
