import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import moment from 'moment';
import regression from 'regression';

import { mapRange } from '../../lib/helpers';

import { Exercise } from '../../lib/Exercise';

import { EventsService } from 'angular-event-service';

@Component({
  selector: 'progress-home',
  templateUrl: 'progress.html'
})
export class ProgressPage {

  public _chartOptions:any;
  public chart:any;
  private graphCategories: Array<string> = [
    '',
    'content',
    'ok',
    'meh',
    'worried',
    'panic'
  ].map(x => `<span class="graphMood graphMood--${x}">\u2022</span>`);

  public endWeek:object = moment(moment.now()).endOf('week');
  public startWeek:object = moment(moment.now()).startOf('week');
  public canSelectNextWeek:boolean = false;

  public exercises:Array<Exercise> = [];
  public thisWeeksExercises:Array<Exercise> = [];
  public previousWeeksExercises:Array<Exercise> = [];

  private lastAddedExercise: Exercise;
  private hasAddedNewExercises: boolean = false;

  constructor(
    private storage: Storage,
    private eventService: EventsService
  ) {
    this._chartOptions = {
      chart: {
        type: 'scatter',
        height: 350,
        animation: false,
        marginBottom: 35
      },
      title: { text: ''},
      xAxis: { // after
        title: {
          text: '',
        },
        min: 1,
        max: 5,
        categories: this.graphCategories,
        labels: {
          userHTML: true,
          // padding: 0,
          y: 40
        },
        tickWidth: 0,
        lineWidth: 2

      },
      yAxis: { // befre
        title: { text: '' },
        min: 1,
        max: 5,
        categories: this.graphCategories,
        labels: {
          useHTML: true,
        },
        gridLineWidth: 0,
        lineWidth: 2
      },
      legend: { enabled: false },
      series: [
        {
          // https://github.com/virtualstaticvoid/highcharts_trendline
          type: 'line',
          dashStyle: 'Dash',
          name: 'Regression Line',
          data: [],
          color: '#F07879',
          marker: { enabled: false },
          states: { hover: { lineWidth: 0 } },
          enableMouseTracking: false,
        },
        {
          name: 'Observations',
          data: [],
          color: '#7D8CA9',
          enableMouseTracking: false,
          marker: { symbol: 'round', radius: 6 }
        },
        // {
        //   name: 'Callibration',
        //   data: [1,2,3,4,5].map(x => [x,x])
        // }
      ],
      credits: { href: null, text: '' }
    }
  }

  ionViewDidEnter() {
    // Every time the view entered, check if we need to recalculate the regression line
    if(this.hasAddedNewExercises) {
      this.addRegressionToGraph();
      this.hasAddedNewExercises = false;
    }
  }

  ionViewWillEnter() {
    this.eventService.on('exercise_update', this.exerciseUpdate.bind(this));
  }

  ionViewWillLoad() {
    this.getExercises();
  }

  ionViewWillLeave() {
    this.eventService.destroyListener('exercise_update', this.exerciseUpdate);
  }

  exerciseUpdate(exercise: Exercise) {
    const localExercise = this.exercises.find(currExercise => currExercise.id === exercise.id);

    [exercise.beforeMood, exercise.afterMood].forEach(mood => {
      if(mood.mood !== null) mood.mappedMood = mood.getMappedMood();
    });

    if(!localExercise) {
      this.exercises.push(exercise);
    } else {
      this.exercises[this.exercises.indexOf(localExercise)] = exercise;
    }

    // Check if we need to add the exercise to the graph or anything else
    this.checkToAddExercise(exercise, localExercise ? true : false);
  }

  checkToAddExercise(exercise: Exercise, exerciseExists: boolean) {
    if(moment(this.endWeek).week() === moment(exercise.start).week()) {
      if(exerciseExists) {
        this.thisWeeksExercises[this.thisWeeksExercises.indexOf(exercise)] = exercise;
      } else {
        this.thisWeeksExercises.push(exercise);
      }

      // Check if we have a before and after mood
      if(exercise.beforeMood.mood !== null && exercise.afterMood.mood !== null) {
        //check if the point has not been added to the graph
        if(!this.lastAddedExercise || this.lastAddedExercise.id !== exercise.id) {
          // Add a point to the graph
          this.addExercisePointToGraph(exercise);
        }

        this.lastAddedExercise = exercise;
        this.hasAddedNewExercises = true; // To recalculate the new regression line on enter
      }
    }

    // CHECK: i think we can not add something to the previous week stats
    // As we have limited the user to go forward in time on the week selector
  }

  // Use this for editing the chart dynamicly later on
  setChart(chart) {
    this.chart = chart;
  }

  addExercisePointToGraph(exercise: Exercise) {
    this.chart.series[1].addPoint([
      mapRange(exercise.afterMood.mood, 0, 500, 1, 5),
      mapRange(exercise.beforeMood.mood, 0, 500, 1, 5)
    ]);

    this.lastAddedExercise = exercise;
  }

  getExercises() {
    this.storage.get('exercises').then((exercises) => {
      if(!exercises) return;

      this.exercises = exercises;

      // Now update the graph
      this.addExercisesToGraph(this.exercises, moment(this.endWeek).week());
    });
  }

  clearSeries(serieNumber: number) {
    const amount = this.chart.series[serieNumber].data.length;
    for(let i = 0; i < amount; i++) {
      this.chart.series[serieNumber].removePoint(0);
    }
  }

  clearRegression() {
    // Remove the regression points
    this.clearSeries(0);
  }

  clearExercises() {
    // Remove the exercises
    this.clearSeries(1);
  }

  addRegressionToGraph() {
    // First clear the old regression line
    this.clearRegression();

    // Update the regression line
    // https://github.com/Tom-Alexander/regression-js
    regression
    .polynomial(
      this.chart.series[1].data
      // Only need the mapped x and y values
      .map(point => [point.x, point.y])
    ).points
    // Sort the points in order to for a smooth line
    .sort()
    .forEach(point => {
      // Add the points to the graph
      this.chart.series[0].addPoint(point);
    });
  }

  addExercisesToGraph(exercises:Array<Exercise>, weekNumber:number) {
    // First clear the old exercises
    this.clearExercises();

    exercises
    // Get the exercises for this week
    .filter(exercise => moment(exercise.start).week() === weekNumber)
    .forEach(exercise => {
      // Check if there is a before- and aftermood
      if(exercise.beforeMood.mood !== null && exercise.afterMood.mood !== null) {
        this.addExercisePointToGraph(exercise);
      }
    });

    // Add the regression line again
    this.addRegressionToGraph();

    // Update the stats
    this.updateStats(exercises, weekNumber);
  }

  updateStats(exercises:any, weekNumber:number) {
    // Get the exercises for this week
    this.thisWeeksExercises = exercises
    .filter(exercise => moment(exercise.start).week() === weekNumber);

    // Get the exercises for previous week
    this.previousWeeksExercises = exercises
    .filter(exercise => moment(exercise.start).week() === weekNumber - 1);
  }

  changeWeek(direction:number) {
    // Based on the direction we move one week back or forward
    this.endWeek = moment(this.endWeek).add((direction > 0 ? 7 : - 7), 'days');
    this.startWeek = moment(this.startWeek).add((direction > 0 ? 7 : - 7), 'days');

    // Cant go further than this week
    this.canSelectNextWeek = !Boolean(moment(this.endWeek).week() === moment(moment.now()).week());

    // Update the graph again
    this.addExercisesToGraph(this.exercises, moment(this.endWeek).week());
  }

}
