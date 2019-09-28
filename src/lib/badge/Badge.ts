import { IStage, IBadge, ICurrentBadgeStage } from '@stores/badge/badge.model'

export class Badge {
  public name: string
  public verbose: string
  public description: string
  public stages: IStage[]
  public totalPointsGained: number = 0

  constructor({ name = '', verbose = '', description = '', stages = [ new Stage() ], totalPointsGained = 0 } = {}) {
    this.name = name
    this.verbose = verbose
    this.description = description
    this.stages = stages.map((stage) => new Stage(stage))
    this.totalPointsGained = totalPointsGained
  }
}

export class Stage {
  public amountNeeded: number
  public description: string
  public image: string

  constructor({ amountNeeded = 0, description = '', image = '' } = {}) {
    this.amountNeeded = amountNeeded
    this.description = description
    this.image = image
  }
}

export function getCurrentStage(badge: IBadge): ICurrentBadgeStage {
  let { totalPointsGained } = badge
  let currentStageIndex: number = 0

  badge.stages.forEach((stage: IStage) => {
    const isFinalStage = badge.stages.length - 1 === currentStageIndex
    const completedStage = totalPointsGained >= stage.amountNeeded
    if (completedStage && !isFinalStage) {
      totalPointsGained -= stage.amountNeeded
      currentStageIndex++
    }
  })

  return {
    stage: badge.stages[currentStageIndex],
    pointsToNextStage: totalPointsGained,
  }
}
