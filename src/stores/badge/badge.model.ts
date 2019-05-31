export interface IBadge {
  name: string;
  verbose: string;
  description: string;
  states: IStage[];
  currentStage: IStage;
  totalPointsGained: number;
  finishedStages: boolean;
}

export interface IStage {
  amountNeeder: number;
  description: string;
  image: string;
}
