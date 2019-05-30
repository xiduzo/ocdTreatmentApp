import { Step } from '@/lib/Exercise';
import { UUID } from 'angular2-uuid';
import { FEAR_COMPLETION_POSITIVE_LIMIT } from './constants';
import { IStep } from '@/stores/exercise/exercise.model';

export class Level {
  public id: string;
  public number: number;
  public steps: Array<Step>;
  public completion: number; // Percentage of completed steps

  public done: boolean = false;
  public monster: string;
  public monster_sized: string;

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

    this.calculateCompletion();
    this.isLevelDone();
  }

  isLevelDone() {
    this.done = this.completion >= 100;
  }

  calculateCompletion() {
    const stepsCompleted = this.steps.filter(
      step => step.fear.completion >= FEAR_COMPLETION_POSITIVE_LIMIT
    );
    this.completion = Math.round(
      (stepsCompleted.length * 100) / this.steps.length
    );
  }
}

export function getLevelCompletion(level: IStep[]): number {
  return (
    level
      // Map to array of completion percentages
      .map(
        (step: IStep): number =>
          // Use constant to calculate completion of step
          (step.fear.completion * 100) / FEAR_COMPLETION_POSITIVE_LIMIT
      )
      // Combine all the percentages into one number
      .reduce(
        (previousValue: number, currentValue: number): number =>
          currentValue + previousValue,
        0 // <-- Starting count of reduce
      ) / level.length // Divide by amount of steps we have
  );
}
