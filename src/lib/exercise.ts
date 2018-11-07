import { UUID } from 'angular2-uuid';

export class Step {
  private id:string = UUID.UUID();
  private fearRating:number = 1;
  private triggers:Array<Trigger> = [];
  private fear:Fear;

  constructor() {
    this.triggers.push(new Trigger('INTENSITY_OBSESSIVE_THOUGHTS'));
    this.triggers.push(new Trigger('INTENSITY_COMPULSIVE_BEHAVIOUR'));
    this.fear = new Fear();
  }
}

export class Trigger {
  private range:number = 0;
  private explanation:string = null;
  private enabled:boolean = false;

  constructor(
    private verbose:string
  ) {
    this.verbose = verbose;
  }
}

export class Fear {
  private completion:number = 0;
  private situation:string = null;
  private without:string = null;

  constructor() {

  }
}

export class Exercise {
  private id:string = UUID.UUID();
  private afterMood:Mood;
  private beforeMood:Mood;
  private step:Step;
  private start:string; // moment
  private end:string; // moment
  private erp:Erp;
}

export class Mood {
  private mood:number;
  private explanation:string;
}

export class Erp {
  private gaveInToCompulsion:boolean;
  private start:string; // moment
  private end:string; // moment
}
