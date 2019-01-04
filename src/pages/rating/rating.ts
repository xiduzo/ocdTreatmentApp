import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

import { ViewController } from 'ionic-angular';

import moment from 'moment';

import brain from 'brain.js';

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
    console.log(brain);
    let output = {};
    if (this.rating > 0) {
      output = { positive: Math.abs(this.rating / 100) }
    } else {
      output = { negative: Math.abs(this.rating / 100) }
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
    // console.log(this.ratings);
    // console.log(JSON.stringify(this.ratings));
    console.log("ttrained model");
    const config = {
      binaryThresh: 0.5,
      hiddenLayers: [20,20,20],
      iterations: 200000,
      errorThresh: 0.001,
      log: true,
      learningRate: 0.2
    };
    const net = new brain.NeuralNetwork(config);

    net.train(this.ratings);
    const trained = net.toJSON();
    console.log("model");
    console.log("=======================");
    console.log(JSON.stringify(trained));

    const output = net.run({
      "beforeMood": 444,
      "afterMood": 77,
      "duration": 1126,
      "erpDuration": 155,
      "fearRating": 4,
      "gaveInToCompulsion": false
    });
    console.log("output");
    console.log("=======================");
    console.log(output);
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
