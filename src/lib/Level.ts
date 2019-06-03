import { FEAR_COMPLETION_POSITIVE_LIMIT } from './constants';
import { IStep } from '@/stores/exercise/exercise.model';
export function getLevelCompletion(steps: IStep[]): number {
  return (
    steps
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
      ) / steps.length // Divide by amount of steps we have
  );
}
