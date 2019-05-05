import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ViewController, ModalController, Platform } from 'ionic-angular';

import { RatingPage } from '@/pages/rating/rating'; // actually a modal - to lazy to care

import { TranslateService } from 'ng2-translate';
import { availableLanguages, sysOptions, ILanguageCode } from '@/lib/language';

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
  public languages: Array<ILanguageCode>;

  constructor(
    private viewCtrl: ViewController,
    private translate: TranslateService,
    private storage: Storage,
    private modalCtrl: ModalController,
    private file: File,
    private emailComposer: EmailComposer,
    private platform: Platform
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

  close() {
    this.viewCtrl.dismiss();
  }

  getDataDir(): string {
    // https://ionicframework.com/docs/v3/api/platform/Platform/
    // "on Android, if you need to use external memory, use .externalDataDirectory"
    if (this.platform.is('android')) return this.file.externalDataDirectory

    return this.file.dataDirectory
  }

  mailData() {
    const fileName: string = `data-${moment(moment.now()).format('DDMMYYYY')}.json`;

    this.file.writeFile(this.getDataDir(), fileName, JSON.stringify({ a: 2, b: 4 }), { replace: true }).then(response => {
      const email = {
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
    const ratingModal = this.modalCtrl.create(RatingPage);
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
