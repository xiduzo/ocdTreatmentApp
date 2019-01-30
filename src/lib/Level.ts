import { Step } from './Exercise';
import { UUID } from 'angular2-uuid';

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
    this.completion = completion
  }
}
