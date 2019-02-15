import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';

import { BadgeModal } from '../../modals/badge/badge';

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
  private finishedStages: boolean = false;

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
    let pickedStage = null;
    let points = this.totalPointsGained;

    this.stages.forEach(stage => {
      if(pickedStage) return;

      if(stage.amountNeeded > points) {
        pickedStage = stage;
        this.pointsProgressToNextStage = points;
      } else {
        points -= stage.amountNeeded;
      }
    });

    if(!pickedStage) {
      this.finishedStages = true;
      pickedStage = this.stages[this.stages.length - 1];
    }

    return pickedStage;
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

  addProgress(amount: number) {
    this.storage.get(this.name).then(response => {
      response = parseInt(response);

      this.totalPointsGained += amount;
      this.storage.set(this.name, this.totalPointsGained);

      this.setCurrentStage();
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
