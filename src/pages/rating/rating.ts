import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

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
  public ratings = []
  public rating = 0;
  private net = new brain.NeuralNetwork();

  constructor(
    private viewCtrl: ViewController,
    private storage: Storage,
    private file: File,
    private emailComposer: EmailComposer
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
    console.log(JSON.stringify(this.exercises[this.currentRatingIndex]));
    const exercise = this.exercises[this.currentRatingIndex];
    let output = {};
    if(this.rating > 0) {
      output = { positive: this.rating / 100}
    } else {
      output = { negative: this.rating/100}
    }
    let input = {
      beforeMood: this.currentRating.beforeMood.mood,
      afterMood: this.currentRating.afterMood.mood,
      duration: this.currentRating.timeDiff,
      erpDuration: this.currentRating.erpDiff,
      fearRating: this.currentRating.step.fearRating,
      gaveInToCompulsion: this.currentRating.erp.gaveInToCompulsion
    }
    const tempObj = {
      input: input,
      output: output
    }
    this.ratings.push(tempObj);
    this.rating = 0;
    this.next();
  }

  save() {
    this.file.writeFile(this.file.externalDataDirectory, "ratings.json", this.ratings, {replace:true}).then(response => {
      let email = {
        to: 'sanderboer_feyenoord@hotmail.com',
        attachments: [
          response.nativeURL
        ],
        subject: 'ratings',
        body: 'ratings file',
        isHtml: false
      };
      this.emailComposer.open(email);
    });
  }


  ionViewDidLoad() {
    this.storage.get('exercises').then(exercises => {
      this.exercises = exercises;
      this.currentRating = this.exercises[this.currentRatingIndex];
      this.getDiff();
    });
  }
}
