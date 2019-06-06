import { Component } from '@angular/core';

import {
  NavParams,
  ViewController,
  ModalController,
  Modal
} from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { ExerciseMoodModal } from '@/modals/exercise/mood/exercise.mood';

import { Exercise, Erp } from '@/lib/Exercise';

import { ExerciseActions } from '@/stores/exercise/exercise.action';
import { IErp, IExercise } from '@/stores/exercise/exercise.model';

@Component({
  selector: 'page-exercise-during',
  templateUrl: 'exercise.during.html'
})
export class ExerciseDuringModal {
  public level: any;
  public exercise: Exercise;

  private erp: IErp = new Erp();

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewDidLoad() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');
  }

  ionViewWillEnter() {
    this.erp.start = new Date();
    this.editExercise();
  }

  editExercise(): IExercise {
    this.exerciseActions.editExercise(this.exercise, { erp: this.erp });

    return new Exercise({ ...this.exercise, ...{ erp: this.erp } });
  }

  finishExercise(gaveInToCompulsion: boolean) {
    this.erp.end = new Date();
    this.erp.gaveInToCompulsion = gaveInToCompulsion;
    const exercise: IExercise = this.editExercise();

    const modal: Modal = this.modalCtrl.create(ExerciseMoodModal, {
      level: this.level,
      exercise: exercise,
      before: false
    });

    modal.present();
    this.viewCtrl.dismiss();
  }
}
