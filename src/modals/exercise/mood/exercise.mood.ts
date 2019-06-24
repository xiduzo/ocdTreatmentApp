import { Component } from '@angular/core';

import { NavParams, ViewController, ModalController } from 'ionic-angular';
import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';

import { mapRange } from '@lib/helpers';
import { Mood } from '@lib/Exercise';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { ExerciseDuringModal } from '@modals/exercise/during/exercise.during';
import { ExerciseTriggerModal } from '@modals/exercise/trigger/exercise.trigger';
import { ExerciseSuccessModal } from '@modals/exercise/success/exercise.success';

import { IStep, IExercise, IMood } from '@stores/exercise/exercise.model';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { IFearLadderState } from '@stores/fearLadder/fearLadder.reducer';
import { IExerciseState } from '@stores/exercise/exercise.reducer';

@Component({
  selector: 'exercise-mood-modal',
  templateUrl: 'exercise.mood.html',
  animations: [
    trigger('trackMood', [
      state('content', style({ background: 'rgb(252, 201, 138)' })),
      state('ok', style({ background: 'rgb(145, 207, 204)' })),
      state('meh', style({ background: 'rgb(214, 217, 204)' })),
      state('panic', style({ background: 'rgb(240,120,121)' })),
      state('worried', style({ background: 'rgb(82, 156, 204)' })),
      transition('* => *', animate('350ms ease-in'))
    ])
  ]
})
export class ExerciseMoodModal {
  public mood: IMood = new Mood({ mood: 0 });
  public moodClass: string = 'content';
  public moodNumber: number = 1;

  private level: IStep[];
  private exercise: IExercise;
  public beforeMeasure: boolean = false;

  @select() readonly exercises$: Observable<IExerciseState>;

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

  ionViewWillEnter() {
    this.beforeMeasure = this.params.get('before');
  }

  setMood() {
    // We want to have a more accurate tracking for the therapist
    // But for the user we use a 1-5 scale
    this.moodNumber = Math.round(mapRange(this.mood.mood, 0, 500, 1, 5));

    switch (this.moodNumber) {
      case 1:
        this.moodClass = 'content';
        break;
      case 2:
        this.moodClass = 'ok';
        break;
      case 3:
        this.moodClass = 'meh';
        break;
      case 4:
        this.moodClass = 'worried';
        break;
      case 5:
        this.moodClass = 'panic';
        break;
    }
  }

  startExercise(): void {
    this.exerciseActions.editExercise({
      beforeMood: this.mood
    });

    const duringModal = this.modalCtrl.create(ExerciseDuringModal);

    duringModal.present();
    this.viewCtrl.dismiss();
  }

  finishExercise(): void {
    this.exerciseActions.editExercise({
      afterMood: this.mood
    });

    this.exercises$.subscribe((exerciseState: IExerciseState) => {
      const hasATriggerEnabled = exerciseState.current.step.triggers.find(
        trigger => trigger.enabled
      );

      const modal = this.modalCtrl.create(
        hasATriggerEnabled ? ExerciseTriggerModal : ExerciseSuccessModal
      );

      modal.present();
      this.viewCtrl.dismiss();
    });
  }

  stopExercise() {
    this.viewCtrl.dismiss();
  }
}
