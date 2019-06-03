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

import { ExerciseSuccessModal } from '@/modals/exercise/success/exercise.success';

import { Trigger, Exercise } from '@/lib/Exercise';
import { IStep, IExercise, ITrigger } from '@/stores/exercise/exercise.model';
import { ExerciseActions } from '@/stores/exercise/exercise.action';

@Component({
  selector: 'page-exercise-trigger',
  templateUrl: 'exercise.trigger.html'
})
export class ExerciseTriggerModal {
  private level: IStep[];
  private exercise: IExercise;
  public triggers: ITrigger[];
  public range: any = { min: 0, max: 5 };
  private transitionOptions: NativeTransitionOptions = {
    direction: 'left'
  };

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions);
  }

  ionViewWillEnter() {
    this.level = this.params.get('level');
    this.exercise = this.params.get('exercise');

    // Only use triggers the user selected
    this.triggers = this.exercise.step.triggers.filter(
      trigger => trigger.enabled
    );
  }

  editExercise(): IExercise {
    const change = {
      end: new Date(),
      step: {
        ...this.exercise.step,
        triggers: {
          ...this.exercise.step.triggers,
          ...this.triggers
        }
      }
    };
    this.exerciseActions.editExercise(this.exercise, change);

    return { ...this.exercise, ...change };
  }

  done() {
    const exercise = this.editExercise();

    const modal: Modal = this.modalCtrl.create(ExerciseSuccessModal, {
      exercise: exercise
    });

    modal.present();
    this.viewCtrl.dismiss();
  }
}
