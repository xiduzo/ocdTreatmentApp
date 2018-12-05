import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Broadcaster } from '@ionic-native/broadcaster';
import { ModalController } from 'ionic-angular';

import * as _ from 'lodash';

export class Badge {
  private name: string;
  private verbose: string;
  private points: number;
  private stages: Array<any>;

  constructor({
    name = '',
    verbose = '',
    points = 0,
    stages = [],
  } = {}) {
    this.name = name;
    this.verbose = verbose;
    this.points = points;
    this.stages = stages;
    // // Set properties from localstorage
    // this.storage.get(name).then((val) => {
    //   // We dont need to do things when it's not in local storage yet
    //   if(!val) return;
    //
    //   // Set the points of the badge
    //   this.points = val;
    // });

  }

  getProgress():number {
    let pointsLeftForStage = this.points;

    // _.forEach(this.stages, (stagePoints, index) => {
    //   if(pointsLeftForStage >= stagePoints) {
    //     this.activeStage = index; // Set the current stage
    //     pointsLeftForStage -= stagePoints; // Next stage needs to exclude to points from previous stage(s)
    //   }
    // });

    return pointsLeftForStage;
  }

  // setPoints(amount) {
  //   this.points = amount; // Update the badge itself
  //   this.storage.set(this.name, this.points); // Put data into localstorage
  // }
}

// @Injectable()
// export class BadgeFactory {
//
//   constructor(
//     private storage:Storage,
//     private broadcaster: Broadcaster,
//     private modalCtrl: ModalController
//   ) {
//   }
//
//   public createBadge(
//     name: string,
//     description:string,
//     stages: Array<number>,
//     triggers: Array<string>
//   ) {
//     return new Badge(name, description, stages, triggers, this.storage, this.broadcaster, this.modalCtrl);
//   }
// }
