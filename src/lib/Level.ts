import { POISSON_THRESHOLD } from './constants';
import { IStep } from '@stores/exercise/exercise.model';
import { IFearLadder } from '@stores/fearLadder/fearLadder.model';

export function getLevelCompletion(steps: IStep[]): number {
  return (
    steps
      // Map to array of completion percentages
      .map(
        (step: IStep): number => {
          // Use constant to calculate completion of step
          let completion: number =
            (step.fear.poissonValue * 100) / POISSON_THRESHOLD;
          return completion > 100 ? 100 : completion;
        }
      )
      // Combine all the percentages into one number
      .reduce(
        (previousValue: number, currentValue: number): number =>
          currentValue + previousValue,
        0 // <-- Starting count of reduce
      ) / steps.length // Divide by amount of steps we have
  );
}

export function generateLevelsFromFearLadderSteps(
  steps: IStep[]
): IFearLadder[] {
  return steps
    .reduce((a, b) => {
      (a[b['fearRating']] = a[b['fearRating']] || []).push(b);
      return a;
    }, [])
    .filter(arr => arr.length)
    .map(
      (steps: IStep[]): IFearLadder => {
        return {
          stepNumber: steps[0].fearRating,
          steps: steps,
          completion: getLevelCompletion(steps)
        };
      }
    );
}
