import { Component } from '@angular/core';
import { App, NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { TranslateService } from 'ng2-translate';

import { AuthService, UserService } from '../../lib/services';
import { availableLanguages, sysOptions } from '../../lib/constants';

import { FearladderModal } from '../fearladder/fearladder';

import { BadgeModal } from '../badge/badge';

import { UUID } from 'angular2-uuid';

import * as _ from 'lodash';

import moment from 'moment';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public language:string;
  public languages:any;
  public personalGoal:string;

  constructor(
    private appCtrl: App,
    public navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private storage: Storage,
    private translate: TranslateService,
    private emailComposer: EmailComposer,
    private notifications: LocalNotifications,
    private modalCtrl: ModalController
  ) {
    this.languages = availableLanguages;
  }

  ionViewDidLoad() {
    this.storage.get('language').then((val) => {
      this.language = val;
    });

    this.storage.get('personalGoal').then((goal) => {
      if(!goal) return;

      this.personalGoal = goal;
    });
  }

  updateAppLanguage() {
    this.translate.use(this.language);
    sysOptions.systemLanguage = this.language;
    this.storage.set('language', this.language);
  }

  sendFearLadder() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      // TODO https://forum.ionicframework.com/t/how-to-create-a-json-file-ionic-3/105939/3
      alert(available);
      let email = {
        to: 'mail@sanderboer.nl',
        attachments: [
        'file://img/logo.png',
        'res://icon.png',
        'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        'file://README.pdf'
        ],
        subject: 'Test mail ionic',
        body: 'Whattttttt',
        isHtml: true
      };
      this.emailComposer.open(email);
    });
  }

  showNotification() {
    this.notifications.schedule({
      id: 1,
      title: 'test notification title',
      text: 'test notification text',
      launch: true,
      priority: 2,
      trigger: { at: new Date(new Date().getTime() + 3600) }
    });
  }

  safePersonalGoal() {
    this.storage.set('personalGoal', this.personalGoal);
  }

  logout() {
    this.authService.removeLocalToken();
    this.userService.removeUser();
    // this.storage.set('onboardingCompleted', false);

    // Because we initiate with the login page we can pop the current app to
    // return to the login page
    this.appCtrl.getRootNav().pop();
  }

  resetMockData() {
    var fearLadder = [
      {
        "id": UUID.UUID(),
        "fearRating": 1,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 100,
          "situation": "Walk around public places, such as the mall",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 1,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Sit on bench at the mall",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 2,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 100,
          "situation": "Touch items in a store",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 2,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Touch a railing at the mall",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 2,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Sit on a bench at the mall and touch bench with hands",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 3,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Touch table in the food court",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 4,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Use hands to push open doors to mall entrance",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 5,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Use public phone at mall",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 5,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Touch garbage can in the mall",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 6,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Touch knob on mall bathroom door",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 7,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Touch counter and taps in mall bathroom",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 7,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Use hands to open and close stall door",
          "without": "Washing my hands"
        }
      },
      {
        "id": UUID.UUID(),
        "fearRating": 8,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "exercise": {
          "completion": 0,
          "situation": "Use toilet at mall",
          "without": "Washing my hands"
        }
      },
    ];

    this.storage.set('fearLadder', fearLadder);

    var exercises = [];
    for(var i = 0; i < 250; i++) {
      var begin = moment(moment.now())
        .subtract(Math.round(Math.random() * 90), "days")
        .subtract(Math.round(Math.random() * 12), "hours")
        .subtract(Math.round(Math.random() * 50), "minutes")
        .subtract(Math.round(Math.random() * 50), "seconds");

      var beforeMoods = [
        "I'm feeling a bit anxtious",
        "I don't want to do this exercise",
        "I have a hard week",
        "I am feeling good",
        "I think I can handle this exercise today!",
        "I have a good feeling about this"
      ];

      var afterMoods = [
        "This was scarier than expected",
        "I do not have this under control",
        "I failed completely",
        "This went better than expected",
        "It could have been way worse",
        "I think I got this exercise under control!"
      ];

      var tempObj = {
        id: UUID.UUID(),
        afterMood: {
          mood: Math.floor(Math.random() * 500),
          explanation: Math.random() > 0.75 ? _.sample(afterMoods) : null
        },
        beforeMood: {
          mood: Math.floor(Math.random() * 500),
          explanation: Math.random() > 0.75 ? _.sample(beforeMoods) : null
        },
        gaveInToCompulsion: Math.random() > 0.5 ? true : false,
        step: _.sample(fearLadder),
        start: begin.format(),
        end: moment(begin)
          .add(Math.round(Math.random() * 20), "minutes")
          .add(Math.round(Math.random() * 50), "seconds")
          .format(),
        erp: {
          begin: moment(begin)
            .add(Math.round(Math.random() * 2), "minutes")
            .add(Math.round(Math.random() * 50), "seconds")
            .format(),
          end: moment(begin)
            .add(Math.round(Math.random() * 2) + 2, "minutes")
            .add(Math.round(Math.random() * 50), "seconds")
            .format(),
        }
      };

      _.forEach(tempObj.step.triggers, (trigger) => {
        if(trigger.enabled) {
          trigger.range = Math.round(Math.random() * 5);
          trigger.explanation = "";
        }
      })

      exercises.push(tempObj);
    }

    exercises = _.orderBy(exercises, 'start');
    this.storage.set('exercises', exercises);
  }

  editFearLadder() {
    let fearLadderModal = this.modalCtrl.create(FearladderModal);
    fearLadderModal.present();
  }

  showBadge(badge) {
    let badgeModal = this.modalCtrl.create(BadgeModal);
    badgeModal.present();
  }

}
