import { Pipe, PipeTransform } from '@angular/core';
import { Storage } from '@ionic/storage';

import moment from 'moment';

import { sysOptions } from '@lib/language';

@Pipe({ name: 'relativeTime' })
export class relativeTimePipe implements PipeTransform {
  constructor(private storage: Storage) {}
  async transform(time: number) {
    if (!time) return false;

    let locale: string;
    await this.storage.get('language').then((val: string) => {
      locale = val;
    });

    moment.locale(locale || sysOptions.systemLanguage);
    return moment(time).fromNow();
  }
}
