import { Step } from './Exercise';
import { UUID } from 'angular2-uuid';
import { FEAR_COMPLETION_POSITIVE_LIMIT } from './constants';

export class Level {
  public id: string;
  public number: number;
  public steps: Array<Step>;
  public completion: number;

  constructor({
    id = UUID.UUID(),
    number = 1,
    steps = [],
    completion = 0
  } = {}) {
    this.id = id;
    this.number = number;
    this.steps = steps.map(step => new Step(step));
    this.completion = completion;
  }

  isLevelDone(): boolean {
    return this.completion >= 100;
  }

  calculateCompletion(): number {
    const stepsCompleted = this.steps.filter(step => step.fear.completion >= FEAR_COMPLETION_POSITIVE_LIMIT);
    return Math.floor(stepsCompleted.length * 100 / this.steps.length);
  }
}
