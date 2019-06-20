import regression from 'regression';
import { calculateRegressionPoints } from '@lib/regression';
import { mapRange } from '@lib/helpers';
import { IMood } from '@stores/exercise/exercise.model';

const oldProbability = 30;
const newProbability = 7;
const regressionDeviation = 0.175; // Percentage => 0.2 = 20%

export const poissonThreshold = 40;

const poissonGoodMultiplier = 1 / newProbability / (1 / oldProbability);
const poissonBadMultiplier =
  (newProbability - 1) /
  newProbability /
  ((oldProbability - 1) / oldProbability);

export function calculateNewPoissonValue(
  currentPoissonValue: number,
  beforeMood: IMood,
  afterMood: IMood
): number {
  if (!currentPoissonValue) currentPoissonValue = 1;

  const mappedAfterMood = mapRange(afterMood.mood, 0, 500, 1, 5);
  const mappedBeforeMood = mapRange(beforeMood.mood, 0, 500, 1, 5);

  const regressionPoints = calculateRegressionPoints();

  // TODO
  // optimize this, so we only calculate the regression polynomial only once in the app
  const prediction = regression
    .polynomial(regressionPoints)
    .predict(mappedAfterMood);
  const predictedYValue = prediction[1];

  let newPoissonValue: number = isMoodWithinRange(
    mappedBeforeMood,
    predictedYValue
  )
    ? currentPoissonValue * poissonGoodMultiplier
    : currentPoissonValue * poissonBadMultiplier;

  if (newPoissonValue < 1) newPoissonValue = 1; // Reset when poisson value get below 1

  console.log(newPoissonValue);

  return newPoissonValue;
}

function isMoodWithinRange(
  mappedBeforeMood: number,
  predictedYValue: number
): boolean {
  const lowerLimit = predictedYValue * (1 - regressionDeviation);
  const upperLimit = predictedYValue * (1 + regressionDeviation);

  return mappedBeforeMood >= lowerLimit && mappedBeforeMood <= upperLimit;
}
