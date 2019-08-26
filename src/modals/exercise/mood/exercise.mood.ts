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

import { IExercise, IMood, ITrigger } from '@stores/exercise/exercise.model';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { select } from '@angular-redux/store';
import { Observable, Subscription } from 'rxjs';
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
  @select() readonly exercises$: Observable<IExerciseState>;
  private exerciseSubscription: Subscription;
  private currentExercise: IExercise;

  public mood: IMood = new Mood({ mood: 0 });
  public moodClass: string = 'content';
  public moodNumber: number = 1;
  public beforeMeasure: boolean = false;

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
    this.exerciseSubscription = this.exercises$.subscribe(
      (exerciseState: IExerciseState) => {
        this.currentExercise = { ...exerciseState.current };
      }
    );
  }

  ionViewWillEnter = (): void => {
    this.beforeMeasure = this.params.get('before');
  };

  setMood = (): void => {
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
  };

  startExercise = async (): Promise<void> => {
    this.exerciseActions.editExercise({ beforeMood: this.mood });

    const modal: Modal = await this.modalCtrl.create(ExerciseDuringModal);
    await modal.present();

    this.close();
  };

  finishExercise = async (): Promise<void> => {
    this.exerciseActions.editExercise({ afterMood: this.mood });

    const hasATriggerEnabled: any = this.currentExercise.step.triggers.find(
      (trigger: ITrigger) => trigger.enabled
    );

    const modal: Modal = await this.modalCtrl.create(
      hasATriggerEnabled ? ExerciseTriggerModal : ExerciseSuccessModal
    );
    await modal.present();

    this.close();
  };
  close = (): void => {
    this.exerciseSubscription.unsubscribe();

    this.viewCtrl.dismiss();
  };
}
