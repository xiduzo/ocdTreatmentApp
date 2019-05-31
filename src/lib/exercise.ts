import { UUID } from 'angular2-uuid';
import moment from 'moment';

import { mapRange } from '@/lib/helpers';
import {
  IMood,
  IStep,
  IErp,
  ITrigger,
  IFear
} from '@/stores/exercise/exercise.model';

export class Step {
  public id: string;
  public fearRating: number;
  public triggers: ITrigger[];
  public fear: IFear;

  constructor({
    id = UUID.UUID(),
    fearRating = 1,
    triggers = [
      new Trigger({ verbose: 'INTENSITY_OBSESSIVE_THOUGHTS' }),
      new Trigger({ verbose: 'INTENSITY_COMPULSIVE_BEHAVIOR' })
    ],
    fear = new Fear()
  } = {}) {
    this.id = id;
    this.fearRating = fearRating;
    this.triggers = triggers.map(trigger => new Trigger(trigger));
    this.fear = new Fear(fear);
  }
}

export class Trigger {
  public verbose: string;
  public amount: number;
  public explanation: string;
  public enabled: boolean;

  constructor({
    verbose = '',
    amount = 0,
    explanation = '',
    enabled = false
  } = {}) {
    this.verbose = verbose;
    this.amount = amount;
    this.explanation = explanation;
    this.enabled = enabled;
  }
}

export class Fear {
  public completion: number;
  public situation: string;
  public without: string;

  constructor({ completion = 0, situation = '', without = '' } = {}) {
    this.completion = completion;
    this.situation = situation;
    this.without = without;
  }
}

export class Exercise {
  public id: string;
  public afterMood: IMood;
  public beforeMood: IMood;
  public step: IStep;
  public start: Date;
  public end: Date;
  public erp: IErp;

  constructor({
    id = UUID.UUID(),
    afterMood = new Mood(),
    beforeMood = new Mood(),
    step = new Step(),
    start = new Date(), // moment
    end = null, // moment
    erp = new Erp()
  } = {}) {
    this.id = id;
    this.afterMood = new Mood(afterMood);
    this.beforeMood = new Mood(beforeMood);
    this.step = new Step(step);
    this.start = start;
    this.end = end;
    this.erp = new Erp(erp);
  }

  getErpTimeDifference(): number {
    if (!this.start || !this.end) return null;
    return moment
      .duration(moment(this.end).diff(moment(this.start)))
      .asSeconds();
  }

  getTotalTimeDifference(): number {
    if (!this.erp) return null;
    if (!this.erp.start || !this.erp.end) return null;
    return moment
      .duration(moment(this.erp.end).diff(moment(this.erp.start)))
      .asSeconds();
  }

  getPointsForExercise(): number {
    let points: number = 0;

    // Mood diff
    points += (this.beforeMood.mood - this.afterMood.mood) * 0.25;

    // Fear rating
    points += this.step.fearRating * 5;

    // Gave in to compulsion
    points += this.erp.gaveInToCompulsion ? 25 : -25;

    // Triggers
    this.step.triggers.forEach(trigger => {
      points += trigger.amount * -7.5;
    });

    // Duration
    points +=
      (this.getErpTimeDifference() / this.getTotalTimeDifference()) * 25;

    return Math.round(points);
  }
}

export class Mood {
  public mood: number;
  public explanation: string;

  public mappedMood: number = undefined;

  constructor({ mood = null, explanation = '' } = {}) {
    this.mood = mood;
    this.explanation = explanation;
  }

  getMappedMood(): number {
    this.mappedMood = Math.round(mapRange(this.mood, 0, 500, 1, 5));

    return this.mappedMood;
  }
}

export class Erp {
  public gaveInToCompulsion: boolean;
  public start: Date;
  public end: Date;

  constructor({ gaveInToCompulsion = false, start = null, end = null } = {}) {
    this.gaveInToCompulsion = gaveInToCompulsion;
    this.start = start;
    this.end = end;
  }
}
