export interface IMood {
  mood: number;
  explanation: string;
  mappedMood: number;
}

export interface ITrigger {
  verbose: string;
  amount: number;
  explanation: string;
  enabled: boolean;
}

export interface IFear {
  completion: number;
  situation: string;
  without: string;
}

export interface IStep {
  id: string;
  fearRating: number;
  triggers: ITrigger[];
  fear: IFear;
}

export interface IErp {
  gaveInToCompulsion: boolean;
  start: Date;
  end: Date;
}

export interface IExercise {
  id: string;
  afterMood: IMood;
  beforeMood: IMood;
  step: IStep;
  start: Date;
  end: Date;
  erp: IErp;
}
