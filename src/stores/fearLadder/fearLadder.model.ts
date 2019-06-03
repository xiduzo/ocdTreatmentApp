import { IStep } from '@/stores/exercise/exercise.model';

export interface IFearLadder {
  stepNumber: number;
  completion: number;
  steps: IStep[];
}
