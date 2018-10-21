export const badges = [
  {
    verbose: "GO GETTER",
    stages: [
      {
        amountNeeded: 10,
        description: 'Lorem ipsum dolor sit amet',
        image: ''
      },
      {
        amountNeeded: 100,
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        image: ''
      },
      {
        amountNeeded: 1000,
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        image: ''
      }
    ],

  }
];

import { Storage } from '@ionic/storage';
import { Inject } from '@angular/core';

// @Injectable()
export class Badge {

  @Inject(Storage) storage:Storage;

  // private name:string;
  // private description:string;
  // private progress:number;
  // private points:number = 0;

  constructor(
    // private name,
    // private description,
    // private progress,
    // private points,
  ) {
    // console.log(this.storage, Storage);
    // Storage.get('fearLadder').then((val) => {
    //   console.log(val);
    // });
    // console.log(this.storage);
  }

  getProgress() {
    // this.storage.get(this.name).then((val) => {
    //   console.log(val);
    //   return val;
    // });
  }

  setPoints(value) {
    console.log(value, this.storage);
    // this.storage.set(this.name, value);
  }
}
