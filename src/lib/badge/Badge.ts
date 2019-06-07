import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';

import { BadgeModal } from '@/modals/badge/badge';

export class Badge {
  public name: string;
  public verbose: string;
  public description: string;
  public stages: Array<Stage>;
  private storage: Storage;
  private modalCtrl: ModalController;
  public currentStage: Stage = new Stage();
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
      .then(() => {
        this.setCurrentStage().then(stage => (this.currentStage = stage));
      })
      .catch(error => console.log(error));
  }

  showModal = async (): Promise<void> => {
    const badgeModal = await this.modalCtrl.create({
      component: BadgeModal,
      componentProps: {
        badge: this
      }
    });

    badgeModal.present();
  };

  setCurrentStage = (): Promise<Stage> => {
    let pickedStage = null;
    let points = this.totalPointsGained;

    this.stages.forEach(stage => {
      if (pickedStage) return;

      if (stage.amountNeeded > points) {
        pickedStage = stage;
        this.pointsProgressToNextStage = points;
      } else {
        points -= stage.amountNeeded;
      }
    });

    if (!pickedStage) {
      this.finishedStages = true;
      pickedStage = this.stages[this.stages.length - 1];
    }

    return new Promise<Stage>((resolve, reject) => {
      if (!pickedStage) reject('No stage picked');
      else resolve(pickedStage);
    });
  };

  async getProgress(): Promise<number> {
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

    return await new Promise<number>((resolve, reject) => {
      if (isNaN(this.totalPointsGained)) reject('Points is not a number');
      else resolve(this.totalPointsGained);
    });
  }

  async addProgress(amount: number): Promise<boolean> {
    if (!this.name) return;

    this.totalPointsGained += amount;
    this.pointsProgressToNextStage += amount;
    await this.setProgress(this.totalPointsGained);

    return new Promise<boolean>((resolve, reject) => {
      if (!this.name) reject('No name provided');
      // Return a boolean value to see if we completed this stage
      else
        resolve(
          this.pointsProgressToNextStage >= this.currentStage.amountNeeded
        );
    });
  }

  async setProgress(amount: number): Promise<any> {
    if (!this.name) return;

    await this.storage.set(this.name, amount);

    return new Promise<any>((resolve, reject) => {
      if (!this.name) reject('No name provided');
      else resolve();
    });
  }
}

export class Stage {
  public amountNeeded: number;
  public description: string;
  public image: string;

  constructor({ amountNeeded = 0, description = '', image = '' } = {}) {
    this.amountNeeded = amountNeeded;
    this.description = description;
    this.image = image;
  }
}

@Injectable()
export class BadgeFactory {
  constructor(private storage: Storage, private modalCtrl: ModalController) {}

  public createBadge(badge: Badge) {
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
