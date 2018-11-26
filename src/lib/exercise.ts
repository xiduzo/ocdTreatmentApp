import { UUID } from 'angular2-uuid';

export class Step {
  public id:string;
  public fearRating:number;
  public triggers:Array<Trigger>;
  public fear:Fear;

  constructor({
    id = UUID.UUID(),
    fearRating = 0,
    triggers = [
      new Trigger({verbose:'INTENSITY_OBSESSIVE_THOUGHTS'}),
      new Trigger({verbose:'INTENSITY_COMPULSIVE_BEHAVIOUR'})
    ],
    fear = new Fear()
  } = {}) {
    this.id = id;
    this.fearRating = fearRating;
    this.triggers = triggers.map(trigger => {
      return new Trigger(trigger);
    });
    this.fear = new Fear(fear);
  }

  addEmptyTriggers() {
    this.triggers.push(new Trigger({verbose:'INTENSITY_OBSESSIVE_THOUGHTS'}));
    this.triggers.push(new Trigger({verbose:'INTENSITY_COMPULSIVE_BEHAVIOUR'}));
  }
}

export class Trigger {
  public verbose:string;
  public range:number;
  public explanation:string;
  public enabled:boolean;

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
  public completion:number;
  public situation:string;
  public without:string;

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
  public id:string;
  public afterMood:Mood;
  public beforeMood:Mood;
  public step:Step;
  public start:Date;
  public end:Date;
  public erp:Erp;

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
}

export class Mood {
  public mood:number;
  public explanation:string;

  constructor({
    mood = 0,
    explanation = ''
  } = {}) {
    this.mood = mood;
    this.explanation = explanation;
  }
}

export class Erp {
  public gaveInToCompulsion:boolean;
  public start:Date;
  public end:Date;

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
