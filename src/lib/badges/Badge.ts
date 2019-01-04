import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { BadgeModal } from './modal/badge';

export class Badge {
  private name: string;
  private verbose: string;
  private description: string;
  private stages: Array<Stage>;
  private storage: Storage;
  private modalCtrl: ModalController;

  private currentStage: Stage = new Stage();
  private totalPointsGained: number = 0;
  private pointsProgressToNextStage: number = 0;

  constructor({
    name = '',
    verbose = '',
    description = '',
    stages = [new Stage()],
    storage = undefined,
    modalCtrl = undefined
  } = {}) {
    this.name = name;
    this.verbose = verbose;
    this.description = description;
    this.stages = stages.map(stage => new Stage(stage));
    this.storage = storage;
    this.modalCtrl = modalCtrl;

    this.getProgress()
      .then(() => this.currentStage = this.setCurrentStage())
      .catch(error => {
        console.log(error);
      });
  }

  showModal(): void {
    const badgeModal = this.modalCtrl.create(BadgeModal, { badge: this });
    badgeModal.present();
  }

  setCurrentStage(): Stage {
    // always return a stage
    if (this.totalPointsGained === 0) return this.stages[0];

    let tempPoints: number = this.totalPointsGained;
    let returnedStage: Stage;

    return this.stages.map(stage => {
      if (tempPoints >= stage.amountNeeded) tempPoints -= amountNeeded;
      if (tempPoints === 0) return stage;
      // TODO: set the pointsProgressToNextStage
      if (tempPoints < stage.amountNeeded) return stage;
      // TODO: return stage if its the last one
    });
    // const stage = this.stages.filter(stage => this.points < stage.amountNeeded)[0];
    // if (stage) return stage;
    // else return this.stages[this.stages.length - 1];
  }

  async getProgress(): Promise<any> {
    if (!this.name) return;

    await this.storage.get(this.name).then(response => {
      response = parseInt(response);
      // Make sure we get a number as a response fo sho
      if (isNaN(response)) {
        this.storage.set(this.name, 0);
        this.getProgress(); // Call again bc we know we have a number in storage now
      }
      this.totalPointsGained = response || 0;
    });

    return new Promise((resolve, reject) => {
      if (isNaN(this.totalPointsGained)) reject("Points is not a number");
      else resolve();
    });
  }
}

class Stage {
  public amountNeeded: number;
  public description: string;
  public image: string;

  constructor({
    amountNeeded = 0,
    description = '',
    image = ''
  } = {}) {
    this.amountNeeded = amountNeeded;
    this.description = description;
    this.image = image;
  }
}

@Injectable()
export class BadgeFactory {

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController
  ) {
  }

  public createBadge(badge) {
    return new Badge({
      name: badge.name,
      verbose: badge.verbose,
      description: badge.description,
      stages: badge.stages,
      storage: this.storage,
      modalCtrl: this.modalCtrl
    });
  }
}
