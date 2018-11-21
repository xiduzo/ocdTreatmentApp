import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ViewController, ModalController } from 'ionic-angular';

import { FearladderModal } from '../fearladder/fearladder';

import { TranslateService } from 'ng2-translate';
import { availableLanguages, sysOptions } from '../../lib/constants';

import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import moment from 'moment';

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
    private modalCtrl: ModalController
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

  resetMockData() {
    let fearLadder = [
      {
        "id": UUID.UUID(),
        "fearRating": 1,
        "triggers": [
          { "verbose": "INTENSITY_OBSESSIVE_THOUGHTS", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null },
          { "verbose": "INTENSITY_COMPULSIVE_BEHAVIOUR", "enabled": Math.random() > 0.5 ? true : false, "range": 0, "explanation": null }
        ],
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
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
        "fear": {
          "completion": 0,
          "situation": "Use toilet at mall",
          "without": "Washing my hands"
        }
      },
    ];

    this.storage.set('fearLadder', fearLadder);

    let exercises = [];
    for(let i = 0; i < 250; i++) {
      let begin = moment(moment.now())
        .subtract(Math.round(Math.random() * 90), "days")
        .subtract(Math.round(Math.random() * 12), "hours")
        .subtract(Math.round(Math.random() * 50), "minutes")
        .subtract(Math.round(Math.random() * 50), "seconds");

      let beforeMoods = [
        "I'm feeling a bit anxtious",
        "I don't want to do this fear",
        "I have a hard week",
        "I am feeling good",
        "I think I can handle this exercise today!",
        "I have a good feeling about this"
      ];

      let afterMoods = [
        "This was scarier than expected",
        "I do not have this under control",
        "I failed completely",
        "This went better than expected",
        "It could have been way worse",
        "I think I got this exercise under control!"
      ];

      let tempObj = {
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
}
