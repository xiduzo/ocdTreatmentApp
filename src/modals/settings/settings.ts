import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ViewController, ModalController } from 'ionic-angular';

import { FearladderModal } from '@/modals/fearladder/fearladder';
import { RatingPage } from '@/pages/rating/rating'; // actually a modal - to lazy to care

import { TranslateService } from 'ng2-translate';
import { availableLanguages, sysOptions } from '@/lib/language';

import moment from 'moment';

import { Fear, Trigger, Exercise, Mood, Step, Erp } from '@/lib/Exercise';

import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

@Component({
  selector: 'settings-modal',
  templateUrl: 'settings.html'
})
export class SettingsModal {

  public language: string;
  public languages: any;

  constructor(
    private viewCtrl: ViewController,
    private translate: TranslateService,
    private storage: Storage,
    private modalCtrl: ModalController,
    private file: File,
    private emailComposer: EmailComposer
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

  createCsv(arr) {
    let csvContent = "data:text/csv;charset=utf-8,";

    let header = '';
    for(var key in arr[0]) {
      header += `${key},`;
    }
    header += "\r\n";
    csvContent += header;
    arr.forEach(item => {
      let row = '';
      for(var key in item) {
        row += `${item[key]},`;
      }
      row += "\r\n";
      csvContent += row;
    });
    console.log(encodeURI(csvContent));

    return encodeURI(csvContent);
  }

  mailData() {
    this.file.writeFile(this.file.cacheDirectory, "testfile.txt", JSON.stringify({ a: 2, b: 4 }), { replace: true }).then(response => {
      let email = {
        to: 'sanderboer_feyenoord@hotmail.com',
        attachments: [
          response.nativeURL
        ],
        subject: 'test',
        body: 'How are you? Nice greetings from Leipzig',
        isHtml: false
      };
      this.emailComposer.open(email);
    });
  }

  openRatingPage() {
    let ratingModal = this.modalCtrl.create(RatingPage);
    ratingModal.present();
  }

  clearLocalStorage() {
    this.storage.clear();
    location.reload();
  }

  resetMockData() {
    let fearLadder = [];
    for (let i = 0; i < 15; i++) {
      fearLadder.push(new Step({
        fearRating: Math.ceil(Math.random() * 8),
        triggers: [
          new Trigger({
            verbose: 'INTENSITY_OBSESSIVE_THOUGHTS',
            enabled: Math.random() >= 0.4,
            amount: Math.round(Math.random() * 5)
          }),
          new Trigger({
            verbose: 'INTENSITY_COMPULSIVE_BEHAVIOUR',
            enabled: Math.random() >= 0.4,
            amount: Math.round(Math.random() * 5)
          })
        ],
        fear: new Fear({
          completion: Math.random() > 0.2 ? 100 : 0,
          situation: 'Lorem ipsum dolor sit amet',
          without: 'consectetur adipiscing'
        })
      }));
    }

    this.storage.set('fearLadder', fearLadder);

    let exercises = [];
    for (let i = 0; i < 25; i++) {
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
        step: fearLadder[Math.round(Math.random() * fearLadder.length - 1)],
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
            .toDate(),
          gaveInToCompulsion: Math.random() > 0.5
        })
      }));
    }

    this.storage.set('exercises', exercises);
  }
}
