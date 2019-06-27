import { IStage, IBadge } from '@stores/badge/badge.model';

export class Badge {
  public name: string;
  public verbose: string;
  public description: string;
  public stages: IStage[];
  public totalPointsGained: number = 0;

  constructor({
    name = '',
    verbose = '',
    description = '',
    stages = [new Stage()]
  } = {}) {
    this.name = name;
    this.verbose = verbose;
    this.description = description;
    this.stages = stages.map(stage => new Stage(stage));
  }
}

export class Stage {
  public amountNeeded: number;
  public description: string;
  public image: string;

  constructor({ amountNeeded = 0, description = '', image = '' } = {}) {
    this.amountNeeded = amountNeeded;
    this.description = description;
    this.image = image;
  }
}
