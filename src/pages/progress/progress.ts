import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import moment from 'moment';
import regression from 'regression';

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
        type: 'scatter',
        height: 350,
        animation: false,
        marginBottom: 35
      },
      title: { text: ''},
      xAxis: {
        title: {
          text: '', // after
        },
        min: 1,
        max: 5,
        categories: [
          '',
          '<span class="graphMood graphMood--content">\u2022</span>',
          '<span class="graphMood graphMood--ok">\u2022</span>',
          '<span class="graphMood graphMood--meh">\u2022</span>',
          '<span class="graphMood graphMood--worried">\u2022</span>',
          '<span class="graphMood graphMood--panic">\u2022</span>',
        ],
        labels: {
          userHTML: true,
          padding: 0,
          y: 40
        },
        tickWidth: 0,
        lineWidth: 2

      },
      yAxis: {
        title: { text: '' }, // after
        min: 1,
        max: 5,
        categories: [
          '',
          '<span class="graphMood graphMood--content">\u2022</span>',
          '<span class="graphMood graphMood--ok">\u2022</span>',
          '<span class="graphMood graphMood--meh">\u2022</span>',
          '<span class="graphMood graphMood--worried">\u2022</span>',
          '<span class="graphMood graphMood--panic">\u2022</span>',
        ],
        labels: {
          useHTML: true,
          // x: 10
        },
        gridLineWidth: 0,
        lineWidth: 2
      },
      legend: { enabled: false },
      series: [
        {
          type: 'arearange',
          name: 'Prefered line',
          color: '#FCD28A',
          fillOpacity: 0.4,
          lineColor: '#FCD28A',
          lineWidth: 2,
          marker: { enabled: false },
          enableMouseTracking: false,
          data: [
            // [1, 3.5, 5],
            // [1.25, 3.48, 4.99],
            // [1.5, 3.45, 4.98],
            // [1.75, 3.4, 4.965],
            // [2, 3.35, 4.95],
            // [2.25, 3.3, 4.9],
            // [2.5, 3.2, 4.83],
            // [2.75, 3.1, 4.75],
            // [3, 3, 4.6],
            // [3.25, 2.9, 4.44],
            // [3.5, 2.75, 4.25],
            // [3.75, 2.55, 4],
            // [4, 2.3, 3.75],
            // [4.25, 2, 3.5],
            // [4.5, 1.7, 3.1],
            // [4.75, 1.4, 2.3],
            // [5, 1, 1]
            // [1, 3.5, 5],
            // [5, 1, 2.5]
          ]
        },
        {
          // https://github.com/virtualstaticvoid/highcharts_trendline
          type: 'line',
          dashStyle: 'Dash',
          name: 'Regression Line',
          data: [],
          color: '#F17879',
          marker: { enabled: false },
          states: { hover: { lineWidth: 0 } },
          enableMouseTracking: false,
        },
        {
          name: 'Observations',
          data: [],
          color: '#7D8CA9',
          // enableMouseTracking: false,
          marker: { symbol: 'round', radius: 6 }
        },
      ],
      credits: { href: null, text: '' }
    }
  }

  ionViewDidEnter() {
    // Every time the view entered, try to update the graph
    this.getExercises();
  }

  // Use this for editing the chart dynamicly later on
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
    // Clear the observations
    const observations = this.chart.series[this.chart.series.length-1].data.length;
    for(let i = 0; i < observations; i++) {
      this.chart.series[this.chart.series.length-1].removePoint(0);
    }

    // Clear the regression line
    const regression = this.chart.series[this.chart.series.length-2].data.length;
    for(let i = 0; i < regression; i++) {
      this.chart.series[this.chart.series.length-2].removePoint(0);
    }

    // Update the graph again
    this.addPointsToGraph(this.exercises, moment(this.endWeek).week());
  }

  addPointsToGraph(exercises:any, weekNumber:number) {
    this.thisWeeksExercises = exercises
    // Get the exercises for this week
    .filter((exercise) => { return moment(exercise.start).week() === weekNumber})
    .forEach(exercise => {
      // Check if there is a before and aftermood registered
      if((exercise.hasOwnProperty('beforeMood') && exercise.hasOwnProperty('afterMood'))) {
        this.chart.series[this.chart.series.length-1].addPoint([
          map(exercise.afterMood.mood, 0, 500, 1, 5),
          map(exercise.beforeMood.mood, 0, 500, 1, 5)
        ]);
      }
    });

    // Update the regression line
    // https://github.com/Tom-Alexander/regression-js
    regression
    .linear(this.chart.series[this.chart.series.length-1].data
    // Only need the mapped x and y values
    .map(point => { return [point.x, point.y]})).points
    // Sort in order to for a smooth line
    .sort()
    .forEach(point => {
      // Add the points to the graph
      this.chart.series[this.chart.series.length-2].addPoint(point);
    });

    // Update the stats
    this.updateStats(exercises, weekNumber);
  }

  updateStats(exercises:any, weekNumber:number) {
    this.thisWeeksExercises = exercises
    // Get the exercises for this week
    .filter((exercise) => { return moment(exercise.start).week() === weekNumber})

    this.previousWeeksExercises = exercises
    // Get the exercises for this week
    .filter((exercise) => { return moment(exercise.start).week() === weekNumber - 1})
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