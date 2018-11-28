import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ViewController, ModalController } from 'ionic-angular';

import { FearladderModal } from '../fearladder/fearladder';

import { TranslateService } from 'ng2-translate';
import { availableLanguages, sysOptions } from '../../lib/language';

import moment from 'moment';

import { Fear, Trigger, Exercise, Mood, Step, Erp } from '../../lib/exercise';

import { File } from '@ionic-native/file';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public language:string;
  public languages:any;

  constructor(
    private viewCtrl: ViewController,
    private translate: TranslateService,
    private storage: Storage,
    private modalCtrl: ModalController,
    private file: File
  ) {
    this.languages = availableLanguages;
  }

  ionViewDidLoad() {
    this.storage.get('language').then((val) => {
      this.language = val;
    });
  }

  updateAppLanguage() {
    this.translate.use(this.language);
    sysOptions.systemLanguage = this.language;
    this.storage.set('language', this.language);
  }

  editFearLadder() {
    let fearLadderModal = this.modalCtrl.create(FearladderModal);
    fearLadderModal.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  mailData() {
    this.file.writeFile(this.file.dataDirectory, "testfile.json", JSON.stringify({a: 2, b: 4}), {replace:true}).then(response => {
      console.log(response);
    });
  }

  resetMockData() {
    let fearLadder = [];
    for(let i = 0; i < 50; i++) {
      fearLadder.push(new Step({
        fearRating: Math.ceil(Math.random() * 8),
        triggers: [
          new Trigger({
            verbose: 'INTENSITY_OBSESSIVE_THOUGHTS',
            enabled: Math.random() >= 0.4
          }),
          new Trigger({
            verbose: 'INTENSITY_COMPULSIVE_BEHAVIOUR',
            enabled: Math.random() >= 0.4
          })
        ],
        fear: new Fear({
          completion: Math.random() > 0.3 ? 100 : 0,
          situation: 'Lorem ipsum dolor sit amet',
          without: 'consectetur adipiscing'
        })
      }));
    }

    this.storage.set('fearLadder', fearLadder);

    let exercises = [];
    for(let i = 0; i < 250; i++) {
      let begin = moment(moment.now())
        .subtract(Math.round(Math.random() * 90), "days")
        .subtract(Math.round(Math.random() * 12), "hours")
        .subtract(Math.round(Math.random() * 50), "minutes")
        .subtract(Math.round(Math.random() * 50), "seconds");

        exercises.push(new Exercise({
          beforeMood: new Mood({
            mood: Math.round(Math.random() * 500)
          }),
          afterMood: new Mood({
            mood: Math.round(Math.random() * 500)
          }),
          start: begin.toDate(),
          end: moment(begin)
            .add(Math.round(Math.random() * 20), "minutes")
            .add(Math.round(Math.random() * 50), "seconds")
            .toDate(),
          erp: new Erp({
            start: moment(begin)
              .add(Math.round(Math.random() * 2), "minutes")
              .add(Math.round(Math.random() * 50), "seconds")
              .toDate(),
            end: moment(begin)
              .add(Math.round(Math.random() * 2) + 2, "minutes")
              .add(Math.round(Math.random() * 50), "seconds")
              .toDate()
          })
        }));
    }

    this.storage.set('exercises', exercises);
  }
}
