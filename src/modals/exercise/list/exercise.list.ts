import { Component } from '@angular/core';
import {
  NavParams,
  ModalController,
  ViewController,
  Modal
} from 'ionic-angular';

import { ExerciseMoodModal } from '@modals/exercise/mood/exercise.mood';

import { Exercise } from '@lib/Exercise';
import { POISSON_THRESHOLD } from '@lib/constants';
import { getLevelCompletion } from '@lib/Level';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { IStep, IExercise } from '@stores/exercise/exercise.model';
import { ExerciseActions } from '@stores/exercise/exercise.action';
import { IFearLadder } from '@stores/fearLadder/fearLadder.model';
import { IFearLadderState } from '@stores/fearLadder/fearLadder.reducer';

@Component({
  selector: 'exercise-list-page',
  templateUrl: 'exercise.list.html'
})
export class ExerciseListModal {
  @select() readonly fearLadder$: Observable<IFearLadderState>;
  public level: IFearLadder;
  public POISSON_THRESHOLD: number = POISSON_THRESHOLD;

  private fearLadderSubscription: Subscription;

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private exerciseActions: ExerciseActions
  ) {
    this.fearLadderSubscription = this.fearLadder$.subscribe(
      (fearLadderState: IFearLadderState) => {
        const stepNumber = this.params.get('stepNumber');
        const steps = fearLadderState.steps.filter(
          (step: IStep) => step.fearRating == stepNumber
        );
        this.level = {
          steps: steps,
          stepNumber: stepNumber,
          completion: getLevelCompletion(steps || [])
        };
      }
    );
  }

  close = (): void => {
    this.fearLadderSubscription.unsubscribe();
    this.viewCtrl.dismiss();
  };

  selectStep = async (step: IStep): Promise<void> => {
    // We can't start an exercise when you've completed it
    if ((step.fear.poissonValue * 100) / POISSON_THRESHOLD >= 100) return;

    const exercise: IExercise = new Exercise({
      start: new Date(),
      step: step
    });

    this.exerciseActions.selectExercise(exercise);
    this.exerciseActions.addExercise(exercise);

    const modal: Modal = await this.modalCtrl.create(ExerciseMoodModal, {
      before: true
    });
    await modal.present();
  };
}
