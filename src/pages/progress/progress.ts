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
  public exercises:any = [];
  public thisWeeksExercises:any = [];
  public previousWeeksExercises:any = [];

  constructor(
    private storage: Storage
  ) {
    this._chartOptions = {
      chart: {
        height: 350,
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
    this.getExercises();
  }

  setChart(chart) {
    this.chart = chart;
  }

  getExercises() {
    this.exercises = [];
    this.storage.get('exercises').then((exercises) => {
      if(!exercises) return;

      this.exercises = exercises;

      // Now update the graph
      this.addPointsToGraph(exercises, moment(this.endWeek).week());
    });
  }

  clearPoints() {
    const length = this.chart.series[1].data.length;
    for(let i = 0; i < length; i++) {
      this.chart.series[1].removePoint(0);
    }
    // Update the graph again
    this.addPointsToGraph(this.exercises, moment(this.endWeek).week());
  }

  addPointsToGraph(exercises:any, weekNumber:number) {
    this.thisWeeksExercises = exercises
    // Get the exercises for this week
    .filter((exercise) => {
      if(moment(exercise.start).week() == weekNumber) {
        return exercise;
      }
    })
    .forEach(exercise => {
      // Check if there is a before and aftermood registered
      if((exercise.hasOwnProperty('beforeMood') && exercise.hasOwnProperty('afterMood'))) {
        this.chart.series[1].addPoint([
          map(exercise.beforeMood.mood, 0, 500, 1, 5),
          map(exercise.afterMood.mood, 0, 500, 1, 5)
        ]);
      }
    });

    this.updateStats(exercises, weekNumber);
  }

  updateStats(exercises:any, weekNumber:number) {
    this.thisWeeksExercises = exercises
    // Get the exercises for this week
    .filter((exercise) => {
      if(moment(exercise.start).week() == weekNumber) {
        return exercise;
      }
    });

    this.previousWeeksExercises = exercises
    // Get the exercises for this week
    .filter((exercise) => {
      if(moment(exercise.start).week() == weekNumber - 1) {
        return exercise;
      }
    });

    console.log(this.thisWeeksExercises, this.previousWeeksExercises);
  }

  changeWeek(direction:number) {
    // Based on the direction we move one week back or forward
    this.endWeek = moment(this.endWeek).add((direction > 0 ? 7 : - 7), 'days');
    this.startWeek = moment(this.startWeek).add((direction > 0 ? 7 : - 7), 'days');

    // Cant go further than this week
    this.canSelectNextWeek = moment(this.endWeek).week() === moment(moment.now()).week() ? false : true;

    this.clearPoints();
  }

}
