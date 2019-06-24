import { Component } from '@angular/core';

import { ViewController, ModalController, Modal } from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { ExerciseMoodModal } from '@modals/exercise/mood/exercise.mood';

import { Exercise, Erp } from '@lib/Exercise';

import { ExerciseActions } from '@stores/exercise/exercise.action';
import { IErp, IExercise } from '@stores/exercise/exercise.model';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@stores/exercise/exercise.reducer';

@Component({
  selector: 'page-exercise-during',
  templateUrl: 'exercise.during.html'
})
export class ExerciseDuringModal {
  @select() readonly exercises$: Observable<IExerciseState>;

  private erp: IErp = new Erp();

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.erp.start = new Date();
    this.editExercise();
  }

  editExercise(): void {
    this.exerciseActions.editExercise({ erp: this.erp });
  }

  finishExercise(gaveInToCompulsion: boolean) {
    this.erp.end = new Date();
    this.erp.gaveInToCompulsion = gaveInToCompulsion;

    this.editExercise();

    const modal: Modal = this.modalCtrl.create(ExerciseMoodModal, {
      before: false
    });

    modal.present();
    this.viewCtrl.dismiss();
  }
}
