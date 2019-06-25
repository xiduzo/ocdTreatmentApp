import { Component } from '@angular/core';

import { ViewController, ModalController, Modal } from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { ExerciseSuccessModal } from '@modals/exercise/success/exercise.success';

import { ITrigger, IExercise } from '@stores/exercise/exercise.model';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IExerciseState } from '@stores/exercise/exercise.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-exercise-trigger',
  templateUrl: 'exercise.trigger.html'
})
export class ExerciseTriggerModal {
  @select() readonly exercises$: Observable<IExerciseState>;
  private currentExercise: IExercise;
  private exerciseSubscription: Subscription;

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

    this.exerciseSubscription = this.exercises$.subscribe(
      (exerciseState: IExerciseState): void => {
        this.currentExercise = { ...exerciseState.current };
        // Only use triggers the user selected
        this.triggers = this.currentExercise.step.triggers.filter(
          trigger => trigger.enabled
        );
      }
    );
  }

  done = async (): void => {
    this.exerciseActions.editExercise({
      step: {
        ...this.currentExercise.step,
        triggers: [...this.triggers]
      }
    });

    const modal: Modal = await this.modalCtrl.create(ExerciseSuccessModal);
    await modal.present();

    this.close();
  };

  close = (): void => {
    this.exerciseSubscription.unsubscribe();
    this.viewCtrl.dismiss();
  };
}
