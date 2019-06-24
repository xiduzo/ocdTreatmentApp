import { Component } from '@angular/core';

import { ViewController, ModalController, Modal } from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { ExerciseSuccessModal } from '@modals/exercise/success/exercise.success';

import { Trigger, Exercise } from '@lib/Exercise';
import { IStep, IExercise, ITrigger } from '@stores/exercise/exercise.model';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@stores/exercise/exercise.reducer';

@Component({
  selector: 'page-exercise-trigger',
  templateUrl: 'exercise.trigger.html'
})
export class ExerciseTriggerModal {
  @select() readonly exercises$: Observable<IExerciseState>;
  private exercise: IExercise;
  public triggers: ITrigger[];
  public range: any = { min: 0, max: 5 };
  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.exercises$.subscribe((exerciseState: IExerciseState) => {
      // Only use triggers the user selected
      this.triggers = exerciseState.current.step.triggers.filter(
        trigger => trigger.enabled
      );
    });
  }

  done() {
    // TODO: fix callstack
    // probably need to give step in done function
    this.exercises$.subscribe((exerciseState: IExerciseState) => {
      this.exerciseActions.editExercise({
        step: {
          ...exerciseState.current.step,
          triggers: [...this.triggers]
        }
      });

      const modal: Modal = this.modalCtrl.create(ExerciseSuccessModal);

      modal.present();
      this.viewCtrl.dismiss();
    });
  }
}
