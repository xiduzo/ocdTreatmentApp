import { Component } from '@angular/core';

import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public _chartOptions:any;

  public filter:string = 'all';
  public moods:any = [
    'MOOD_CONTENT',
    'MOOD_OK',
    'MOOD_MEH',
    'MOOD_WORRIED',
    'MOOD_PANIC'
  ];

  public endWeek:any = moment(moment.now()).endOf('week');
  public startWeek:any = moment(moment.now()).startOf('week');
  public canSelectNextWeek:boolean = false;

  constructor(
  ) {

    this._chartOptions = {
      chart: {
        height: 250
      },
      title: { text: ''},
      xAxis: {
        min: 0,
        max: 5,
        title: {
          text: 'BEFORE'
        }
      },
      yAxis: {
        min: 0,
        max: 5,
        title: {
          text: 'AFTER'
        }
      },
      legend: { enabled: false },
      series: [
          {
            type: 'line',
            name: 'Regression Line',
            data: [
              [0, 1.11], [5, 4.51]
            ],
            color: '#FCD28A',
            marker: { enabled: false },
            states: { hover: { lineWidth: 0 } },
            enableMouseTracking: false
        }, {
            type: 'scatter',
            name: 'Observations',
            data: [1, 1.5, 2.8, 3.5, 3.9, 4.2],
            marker: { radius: 4 }
        }
      ],
      credits: { href: null, text: '' }
    }
  }

  // https://www.arduino.cc/reference/en/language/functions/math/map/
  map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  previousWeek() {
    this.endWeek = moment(this.endWeek).subtract(7, 'days');
    this.startWeek = moment(this.startWeek).subtract(7, 'days');
    this.canSelectNextWeek = true;
  }

  nextWeek() {
    this.endWeek = moment(this.endWeek).add(7, 'days');
    this.startWeek = moment(this.startWeek).add(7, 'days');

    // Cant go further than this week
    if(moment(this.endWeek).week() === moment(moment.now()).week()) {
      this.canSelectNextWeek = false;
    }
  }

}
