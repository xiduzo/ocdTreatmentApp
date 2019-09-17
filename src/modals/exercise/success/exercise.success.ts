import { Component } from '@angular/core'
import { ViewController } from 'ionic-angular'
import {
  NativePageTransitions,
  NativeTransitionOptions,
} from '@ionic-native/native-page-transitions'

import { confettiSettings } from '@lib/Confetti'

declare var ConfettiGenerator: any
import 'confetti-js'

import { Fear } from '@lib/Exercise'

import { IExercise, IFear } from '@stores/exercise/exercise.model'
import { ExerciseActions } from '@stores/exercise/exercise.action'
import { FearLadderActions } from '@stores/fearLadder/fearLadder.action'
import { BadgeActions } from '@stores/badge/badge.action'
import { calculateNewPoissonValue } from '@lib/poisson'
import { Observable } from 'rxjs/Observable'
import { IExerciseState } from '@stores/exercise/exercise.reducer'
import { IBadgeState } from '@stores/badge/badge.reducer'
import { select } from '@angular-redux/store'
import { Subscription } from 'rxjs'

@Component({
  selector: 'page-exercise-success',
  templateUrl: 'exercise.success.html',
})
export class ExerciseSuccessModal {
  @select() readonly exercises$: Observable<IExerciseState>
  @select() readonly badges$: Observable<IBadgeState>
  private exerciseSubscription: Subscription

  private badgeSubscription: Subscription
  private currentExercise: IExercise
  private exercises: IExercise[]

  private badges: IBadge

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left',
  }

  constructor(
    public viewCtrl: ViewController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions,
    private fearLadderActions: FearLadderActions,
    private badgeActions: BadgeActions
  ) {
    this.nativePageTransitions.slide(this.transitionOptions)

    this.exerciseSubscription = this.exercises$.subscribe((exerciseState: IExerciseState) => {
      this.currentExercise = { ...exerciseState.current }
      this.exercises = exerciseState.list
    })

    this.badgeSubscription = this.badges$.subscribe((badgeState: IBadgeState) => {
      this.badges = badgeState.list
    })
  }

  ionViewWillEnter = (): void => {
    this.updateStepCompletion()
  }

  ionViewDidEnter = (): void => {
    this.badges.forEach((badge: IBadge): void => {
      if (badge.name === 'firstTimeBadge') this.updateFirstTimeBadge(badge)
      if (badge.name === 'streakBadge') this.updateStreakBadge(badge)
    })
  }

  updateFirstTimeBadge = (badge: IBadge): void => {
    if (badge.totalPointsGained > 0) return
    badge.totalPointsGained += 1
    this.badgeActions.updateBadge(badge)
  }

  updateStreakBadge = (badge: IBadge): void => {
    // TODO streak algorithm
    console.log(badge, this.exercises)
    this.badgeActions.updateBadge(badge)
  }

  renderConfetti = (): void => {
    try {
      const confetti = new ConfettiGenerator(confettiSettings)
      confetti.render()
    } catch (e) {
      console.log(e)
    }
  }

  updateStepCompletion = (): void => {
    const newPoissonValue = calculateNewPoissonValue(
      this.currentExercise.step.fear.poissonValue,
      this.currentExercise.beforeMood,
      this.currentExercise.afterMood
    )

    const fear: IFear = new Fear(this.currentExercise.step.fear)

    // When we increase the poissonValue, show some confetti!
    if (newPoissonValue > fear.poissonValue) this.renderConfetti()

    fear.poissonValue = newPoissonValue

    this.exerciseActions.editExercise({
      end: new Date(),
    })

    this.fearLadderActions.editFearLadderStep(this.currentExercise.step, {
      fear: fear,
    })
  }
  close = (): void => {
    this.exerciseSubscription.unsubscribe()
    this.badgeSubscription.unsubscribe()
    this.viewCtrl.dismiss()
  }
}
