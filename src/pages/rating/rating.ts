import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import brain from 'brain.js';
import moment from 'moment';

import { ViewController } from 'ionic-angular';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})

export class RatingPage {
  public currentRating;
  public currentRatingIndex = 0;
  public exercises = [];
  public rating = 0;

  constructor(
    private viewCtrl: ViewController,
    private storage: Storage
  ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  getDiff() {
    this.currentRating.timeDiff = moment.duration(
      moment(this.currentRating.end).diff(
        moment(this.currentRating.start)
      )
    ).asSeconds();
    this.currentRating.erpDiff = moment.duration(
      moment(this.currentRating.erp.end).diff(
        moment(this.currentRating.erp.start)
      )
    ).asSeconds();
  }

  next() {
    this.currentRatingIndex++;
    this.currentRating = this.exercises[this.currentRatingIndex];
    this.getDiff();
  }

  rate() {
    this.rating = 0;
    this.next();
  }

  ionViewDidLoad() {
    this.storage.get('exercises').then(exercises => {
      console.log(exercises);
      this.exercises = exercises;
      this.currentRating = this.exercises[this.currentRatingIndex];
      this.getDiff();
    });
  }
}
