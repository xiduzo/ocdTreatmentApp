import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import {
  ViewController,
  ModalController,
  LoadingController
} from '@ionic/angular';

import { RatingPage } from '@/pages/rating/rating'; // actually a modal - to lazy to care

import { TranslateService } from 'ng2-translate';
import { availableLanguages, sysOptions, ILanguageCode } from '@/lib/language';

import moment from 'moment';

import { Fear, Trigger, Exercise, Mood, Step, Erp } from '@/lib/Exercise';

import { Auth, Storage as AwsStorage } from 'aws-amplify';

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
    private loadingCtrl: LoadingController
  ) {
    this.languages = availableLanguages;
  }

  ionViewDidLoad() {
    this.storage.get('language').then(val => {
      this.language = val;
    });
  }

  signOut() {
    Auth.signOut().then(() => {
      this.close();
    });
    // .catch(error => {
    //   console.log(error);
    // });
  }

  updateAppLanguage() {
    this.translate.use(this.language);
    sysOptions.systemLanguage = this.language;
    this.storage.set('language', this.language);

    // Update moment language
    moment.locale(this.language);
  }

  close() {
    this.viewCtrl.dismiss();
  }

  sendData = async (): Promise<void> => {
    const loader = await this.loadingCtrl.create({
      message: 'Sending data...',
      duration: 60 * 1000
    });

    loader.present();

    Auth.currentAuthenticatedUser().then(userSession => {
      const { username } = userSession;
      const fileName: string = `${username}/${moment(moment.now()).format(
        'DDMMYYYY@HHmmsssssZ'
      )}.json`;
      this.storage.get('exercises').then(response => {
        AwsStorage.put(fileName, JSON.stringify(response), {
          contentType: 'application/json'
        })
          .then(result => loader.dismiss())
          .catch(err => loader.dismiss());
      });
    });
  };

  openRatingPage = async (): Promise<void> => {
    const ratingModal = await this.modalCtrl.create({
      component: RatingPage
    });

    ratingModal.present();
  };

  clearLocalStorage() {
    this.storage.clear();
    location.reload();
  }

  resetMockData() {
    let fearLadder = [];
    for (let i = 0; i < 15; i++) {
      fearLadder.push(
        new Step({
          fearRating: Math.ceil(Math.random() * 8),
          triggers: [
            new Trigger({
              verbose: 'INTENSITY_OBSESSIVE_THOUGHTS',
              enabled: Math.random() >= 0.4,
              amount: Math.round(Math.random() * 5)
            }),
            new Trigger({
              verbose: 'INTENSITY_COMPULSIVE_BEHAVIOR',
              enabled: Math.random() >= 0.4,
              amount: Math.round(Math.random() * 5)
            })
          ],
          fear: new Fear({
            completion: Math.random() > 0.2 ? 100 : 0,
            situation: 'Lorem ipsum dolor sit amet',
            without: 'consectetur adipiscing'
          })
        })
      );
    }

    this.storage.set('fearLadder', fearLadder);

    let exercises = [];
    for (let i = 0; i < 25; i++) {
      let begin = moment(moment.now())
        .subtract(Math.round(Math.random() * 90), 'days')
        .subtract(Math.round(Math.random() * 12), 'hours')
        .subtract(Math.round(Math.random() * 50), 'minutes')
        .subtract(Math.round(Math.random() * 50), 'seconds');

      exercises.push(
        new Exercise({
          beforeMood: new Mood({
            mood: Math.round(Math.random() * 500)
          }),
          afterMood: new Mood({
            mood: Math.round(Math.random() * 500)
          }),
          step: fearLadder[Math.round(Math.random() * fearLadder.length - 1)],
          start: begin.toDate(),
          end: moment(begin)
            .add(Math.round(Math.random() * 20), 'minutes')
            .add(Math.round(Math.random() * 50), 'seconds')
            .toDate(),
          erp: new Erp({
            start: moment(begin)
              .add(Math.round(Math.random() * 2), 'minutes')
              .add(Math.round(Math.random() * 50), 'seconds')
              .toDate(),
            end: moment(begin)
              .add(Math.round(Math.random() * 2) + 2, 'minutes')
              .add(Math.round(Math.random() * 50), 'seconds')
              .toDate(),
            gaveInToCompulsion: Math.random() > 0.5
          })
        })
      );
    }

    this.storage.set('exercises', exercises);
  }
}
