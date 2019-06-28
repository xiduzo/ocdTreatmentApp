export interface IBadge {
  name: string;
  verbose: string;
  description: string;
  stages: IStage[];
  totalPointsGained: number;

  getCurrentStage?: () => IStage;
}

export interface IStage {
  amountNeeded: number;
  description: string;
  image: string;
}

export interface ICurrentBadgeStage {
  stage: IStage;
  pointsToNextStage: number;
}
