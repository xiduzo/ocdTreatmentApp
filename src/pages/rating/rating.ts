import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ViewController } from '@ionic/angular';

import moment from 'moment';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})

export class RatingPage {
  public currentRating;
  public currentRatingIndex = 0;
  public exercises = [];
  public ratings = []
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

  calculateRating() {
    console.log(this.currentRating);
    const moodDiff = this.currentRating.beforeMood.mood - this.currentRating.afterMood.mood;

    let points = 0;

    // Mood diff
    points += moodDiff * 0.25;

    // fearRating
    points += this.currentRating.step.fearRating * 5;

    // triggers
    this.currentRating.step.triggers.forEach(trigger => {
      points += trigger.amount * -7.5;
    });

    // duration
    points += this.currentRating.erpDiff / this.currentRating.timeDiff * 25;

    console.log(`
      moodDiff: ${moodDiff},
      fearRating: ${this.currentRating.step.fearRating},
      erpDuration: ${this.currentRating.erpDiff},
      totalDuration: ${this.currentRating.timeDiff},
      obsessive_thoughts: ${this.currentRating.step.triggers[0].range},
      compulsive behaviour: ${this.currentRating.step.triggers[1].range},
      points: ${points}
      `);
    this.next();
  }

  rate() {
    let output = {};
    if (this.rating > 0) {
      output = { positive: Math.abs(this.rating / 100) }
    } else {
      output = { negative: Math.abs(this.rating / 100) }
    }

    const tempObj = {
      input: this.currentRating,
      output: output
    }
    this.ratings.push(tempObj);
    this.rating = 0;
    this.next();
  }

  save() {
    // this.file.writeFile(this.file.dataDirectory, "ratings.json", JSON.stringify(this.ratings), { replace: true }).then(response => {
    //   let email = {
    //     to: 'sanderboer_feyenoord@hotmail.com',
    //     attachments: [
    //       response.nativeURL
    //     ],
    //     subject: 'ratings',
    //     body: 'ratings file',
    //     isHtml: false
    //   };
    //   this.emailComposer.open(email);
    // });
  }


  ionViewDidLoad() {
    this.storage.get('exercises').then(exercises => {
      this.exercises = exercises;
      this.currentRating = this.exercises[this.currentRatingIndex];
      this.getDiff();
    });
  }
}
