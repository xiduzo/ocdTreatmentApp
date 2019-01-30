import { UUID } from 'angular2-uuid';
import moment from 'moment';

export class Step {
  public id: string;
  public fearRating: number;
  public triggers: Array<Trigger>;
  public fear: Fear;

  constructor({
    id = UUID.UUID(),
    fearRating = 0,
    triggers = [
      new Trigger({ verbose: 'INTENSITY_OBSESSIVE_THOUGHTS' }),
      new Trigger({ verbose: 'INTENSITY_COMPULSIVE_BEHAVIOUR' })
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
  public range: number;
  public explanation: string;
  public enabled: boolean;

  constructor({
    verbose = '',
    range = 0,
    explanation = '',
    enabled = false
  } = {}) {
    this.verbose = verbose;
    this.range = range;
    this.explanation = explanation;
    this.enabled = enabled;
  }
}

export class Fear {
  public completion: number;
  public situation: string;
  public without: string;

  constructor({
    completion = 0,
    situation = '',
    without = ''
  } = {}) {
    this.completion = completion;
    this.situation = situation;
    this.without = without;
  }
}

export class Exercise {
  public id: string;
  public afterMood: Mood;
  public beforeMood: Mood;
  public step: Step;
  public start: Date;
  public end: Date;
  public erp: Erp;

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
    return moment.duration(
      moment(this.end).diff(
        moment(this.start)
      )
    ).asSeconds();
  }

  getTotalTimeDifference(): number {
    if (!this.erp) return null;
    if (!this.erp.start || !this.erp.end) return null;
    return moment.duration(
      moment(this.erp.end).diff(
        moment(this.erp.start)
      )
    ).asSeconds();
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
      points += trigger.range * -7.5;
    });

    // Duration
    points += this.getErpTimeDifference() / this.getTotalTimeDifference() * 25;

    return Math.round(points);
  }

}

export class Mood {
  public mood: number;
  public explanation: string;

  constructor({
    mood = null,
    explanation = ''
  } = {}) {
    this.mood = mood;
    this.explanation = explanation;
  }
}

export class Erp {
  public gaveInToCompulsion: boolean;
  public start: Date;
  public end: Date;

  constructor({
    gaveInToCompulsion = false,
    start = null,
    end = null
  } = {}) {
    this.gaveInToCompulsion = gaveInToCompulsion;
    this.start = start;
    this.end = end;
  }
}
