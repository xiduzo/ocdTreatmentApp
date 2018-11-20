import { UUID } from 'angular2-uuid';

export class Step {
  constructor(
    public id:string = UUID.UUID(),
    public fearRating:number = 1,
    public triggers:Array<Trigger> = [],
    public fear:Fear = null
  ) {
    this.id = id;
    this.fearRating = fearRating;
    this.triggers = triggers;
    this.fear = fear;
  }

  addEmptyTriggers() {
    this.triggers.push(new Trigger('INTENSITY_OBSESSIVE_THOUGHTS'));
    this.triggers.push(new Trigger('INTENSITY_COMPULSIVE_BEHAVIOUR'));
  }
}

export class Trigger {
  constructor(
    public verbose:string,
    public range:number = 0,
    public explanation:string = null,
    public enabled:boolean = false
  ) {
    this.verbose = verbose;
    this.range = range;
    this.explanation = explanation;
    this.enabled = enabled;
  }
}

export class Fear {
  constructor(
    public completion:number = 0,
    public situation:string = null,
    public without:string = null
  ) {
    this.completion = completion;
    this.situation = situation;
    this.without = without;
  }
}

export class Exercise {
  constructor(
    public id:string = UUID.UUID(),
    public afterMood:Mood,
    public beforeMood:Mood,
    public step:Step,
    public start:string, // moment
    public end:string, // moment
    public erp:Erp
  ) {
    this.id = id;
    this.afterMood = afterMood;
    this.beforeMood = beforeMood;
    this.step = step;
    this.start = start;
    this.end = end;
    this.erp = erp;
  }
}

export class Mood {
  constructor(
    public mood:number,
    public explanation:string
  ) {
    this.mood = mood;
    this.explanation = explanation;
  }
}

export class Erp {
  constructor(
    public gaveInToCompulsion:boolean,
    public start:string, // moment
    public end:string // moment
  ) {
    this.gaveInToCompulsion = gaveInToCompulsion;
    this.start = start;
    this.end = end;
  }
}
