import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import moment from 'moment';

import { map } from '../../lib/helpers';

@Component({
  selector: 'progress-home',
  templateUrl: 'progress.html'
})
export class ProgressPage {

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

  public chart:any;
  public exercises:any;

  constructor(
    private storage: Storage
  ) {
    this._chartOptions = {
      chart: {
        height: 250,
        animation: false
      },
      title: { text: ''},
      xAxis: {
        min: 1,
        max: 5,
        title: { text: 'BEFORE' }
      },
      yAxis: {
        min: 1,
        max: 5,
        title: { text: 'AFTER' }
      },
      legend: { enabled: false },
      series: [
          {
            type: 'line',
            name: 'Regression Line',
            data: [
              [1, 1.11], [5, 4.51]
            ],
            color: '#FCD28A',
            marker: { enabled: false },
            states: { hover: { lineWidth: 0 } },
            enableMouseTracking: false
        }, {
            type: 'scatter',
            name: 'Observations',
            data: [],
            marker: { symbol: 'round', radius: 4 }
        }
      ],
      credits: { href: null, text: '' }
    }
  }

  ionViewDidEnter() {
    // Every time the view entered, try to update the graph
    this.addPointsToGraph();
  }

  setChart(chart) {
    this.chart = chart;
  }

  addPointsToGraph() {
    this.storage.get('exercises').then((exercises) => {
      exercises
      // We can only use exercises with a before and after mood track
      .filter((exercise) => {
        exercise.exerciseId = exercise.exercise.id; // For grouping
        return (exercise.beforeMood.mood >= 0 && exercise.afterMood.mood >= 0);
      })
      // To prevent doubles we filter out ones not found in the chart yet
      .filter((exercise) => {
        // If there is nothing to compare with yet just return
        if(!this.exercises) return exercise;

        // Only return the new exercises
        return !this.exercises.find(point => point.id === exercise.id);
      })
      .forEach(exercise => {
        this.chart.series[1].addPoint([
          map(exercise.beforeMood.mood, 0, 500, 1, 5),
          map(exercise.afterMood.mood, 0, 500, 1, 5)
        ]);
      });

      // Now we can update the stored exercises for the page
      this.exercises = exercises;
    });
  }

  changeWeek(direction:number) {
    // Based on the direction we move one week back or forward
    this.endWeek = moment(this.endWeek).add((direction > 0 ? 7 : - 7), 'days');
    this.startWeek = moment(this.startWeek).add((direction > 0 ? 7 : - 7), 'days');

    // Cant go further than this week
    this.canSelectNextWeek = moment(this.endWeek).week() === moment(moment.now()).week() ? false : true;
  }

}
