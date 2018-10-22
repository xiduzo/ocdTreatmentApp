import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Broadcaster } from '@ionic-native/broadcaster';
import { ModalController } from 'ionic-angular';

import { FearladderModal } from '../pages/fearladder/fearladder';

import * as _ from 'lodash';

export class Badge {
  // Set to default 0 as we later on going to calculate them
  private activeStage:number = 0;
  private points: number = 0;

  constructor(
    private name: string,
    private description: string,
    private stages: Array<number>,
    private triggers: Array<string>,
    private storage: Storage,
    private broadcaster: Broadcaster,
    private modalCtrl: ModalController
  ) {
    // Set properties from constructor
    this.name = name;
    this.description = description;
    this.stages = stages;
    this.triggers = triggers;

    // Set properties from localstorage
    this.storage.get(name).then((val) => {
      // We dont need to do things when it's not in local storage yet
      if(!val) return;

      // Set the points of the badge
      this.points = val;
    });

    // Create trigger events
    _.forEach(this.triggers, (trigger) => {
      this.broadcaster.addEventListener(trigger).subscribe(event => {
        console.log(event);
        let modal;

        switch(event.type) {
          case 'badge_points_updated':
            console.log(true);
            modal = this.modalCtrl.create(FearladderModal);
            break;
          default:
            break;
        }

        modal.present();
      });
    });
  }

  getProgress():number {
    let pointsLeftForStage = this.points;

    _.forEach(this.stages, (stagePoints, index) => {
      if(pointsLeftForStage >= stagePoints) {
        this.activeStage = index; // Set the current stage
        pointsLeftForStage -= stagePoints; // Next stage needs to exclude to points from previous stage(s)
      }
    });

    return pointsLeftForStage;
  }

  setPoints(amount) {
    this.points = amount; // Update the badge itself
    this.storage.set(this.name, this.points); // Put data into localstorage
  }
}

@Injectable()
export class BadgeFactory {

  constructor(
    private storage:Storage,
    private broadcaster: Broadcaster,
    private modalCtrl: ModalController
  ) {
  }

  public createBadge(
    name: string,
    description:string,
    stages: Array<number>,
    triggers: Array<string>
  ) {
    return new Badge(name, description, stages, triggers, this.storage, this.broadcaster, this.modalCtrl);
  }
}
