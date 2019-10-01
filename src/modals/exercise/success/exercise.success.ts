import { Component } from '@angular/core'
import { ViewController, Modal, ModalController } from 'ionic-angular'
import {
  NativePageTransitions,
  NativeTransitionOptions,
} from '@ionic-native/native-page-transitions'
import { BadgeEarnedModal } from '@modals/badgeEarned/badgeEarned'

import { confettiSettings } from '@lib/Confetti'

declare var ConfettiGenerator: any
import 'confetti-js'
import moment from 'moment'

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
import { IBadge, ICurrentBadgeStage, IStage } from '@stores/badge/badge.model'
import { getCurrentStage } from '@lib/badge/Badge'

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

  private badges: IBadge[]

  private transitionOptions: NativeTransitionOptions = {
    direction: 'left',
  }

  constructor(
    public viewCtrl: ViewController,
    private nativePageTransitions: NativePageTransitions,
    private exerciseActions: ExerciseActions,
    private fearLadderActions: FearLadderActions,
    private badgeActions: BadgeActions,
    private modalCtrl: ModalController
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
      const currentStage = getCurrentStage(badge)
      if (badge.name === 'firstTimeBadge') this.updateFirstTimeBadge(badge, currentStage)
      if (badge.name === 'streakBadge') this.updateStreakBadge(badge, currentStage)
      if (badge.name === 'exerciseBadge') this.updateExerciseBadge(badge, currentStage)
    })
  }

  finalStageCompleted = (badge: IBadge, currentStage: ICurrentBadgeStage): boolean => {
    const finalStageIndex = badge.stages.length - 1
    // Check if the current stage is the final stage
    if (badge.stages.indexOf(currentStage.stage) === finalStageIndex) {
      // Check if the current stage is finished
      if (currentStage.pointsToNextStage === currentStage.stage.amountNeeded) {
        return true
      }
    }
    return false
  }

  stageCompleted = async (badge: IBadge, completedStage: IStage): Promise<void> => {
    const modal: Modal = this.modalCtrl.create(BadgeEarnedModal, {
      badge,
      completedStage,
    })
    modal.present()
    this.close()
  }

  updateBadge = (badge: IBadge, currentStage: ICurrentBadgeStage): void => {
    badge.totalPointsGained += 1
    this.badgeActions.updateBadge(badge)

    // Show modal when we complete a stage
    if (currentStage.pointsToNextStage + 1 === currentStage.stage.amountNeeded) {
      this.stageCompleted(badge, currentStage.stage)
    }
  }

  updateFirstTimeBadge = (badge: IBadge, currentStage: ICurrentBadgeStage): void => {
    if (badge.totalPointsGained > 0) return
    if (this.finalStageCompleted(badge, currentStage)) return

    this.updateBadge(badge, currentStage)
  }

  updateStreakBadge = (badge: IBadge, currentStage: ICurrentBadgeStage): void => {
    if (this.finalStageCompleted(badge, currentStage)) return

    if (!this.canUpdateStreak(currentStage)) {
      // Reset our streak
      badge.totalPointsGained -= currentStage.pointsToNextStage
    }

    this.updateBadge(badge, currentStage)
  }

  updateExerciseBadge = (badge: IBadge, currentStage: ICurrentBadgeStage): void => {
    if (this.finalStageCompleted(badge, currentStage)) return

    this.updateBadge(badge, currentStage)
  }

  hasDoneExerciseOnDay = (daysBack: number): boolean => {
    const exercise = this.exercises
      .reverse()
      .find((exercise: IExercise): boolean =>
        moment(exercise.start).isSame(moment().subtract(daysBack, 'days'), 'date')
      )

    if (!exercise) return false

    return true
  }

  canUpdateStreak = (currentStage: ICurrentBadgeStage): boolean => {
    // If we have nothing to compare to, return false
    if (this.exercises.length < currentStage.pointsToNextStage + 1) return false

    // Check if we are still on streak
    for (let daysBack = 0; daysBack <= currentStage.pointsToNextStage; daysBack++) {
      const canCallNext = this.hasDoneExerciseOnDay(daysBack)
      if (!canCallNext) return false
    }

    // We have a winner!
    return true
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
