import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

export class Badge {

  constructor(
    private name: string,
    private description: string,
    private stages: Array<number>,
    private points: number,
    private triggers: Array<string>,
    private storage: Storage
  ) {
    // console.log(this.storage, Storage);
    this.storage.get('fearLadder').then((val) => {
      console.log(val);
    });
  }

  getProgress() {
  }

  setPoints(value) {
    console.log(value, this.storage);
    // this.storage.set(this.name, value);
  }
}

@Injectable()
export class BadgeFactory {

  constructor(private storage:Storage) {
  }

  public createBadge(
    name: string,
    description:string,
    stages: Array<number>,
    points: number,
    triggers: Array<string>
  ) {
    return new Badge(name, description, stages, points, triggers, this.storage);
  }
}
