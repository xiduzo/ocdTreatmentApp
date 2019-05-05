import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import moment from 'moment';
import { unitOfTime } from 'moment';
import regression from 'regression';

import { mapRange } from '@/lib/helpers';

import { Exercise } from '@/lib/Exercise';

import { EventsService } from 'angular-event-service';

@Component({
  selector: 'progress-home',
  templateUrl: 'progress.html'
})
export class ProgressPage {

  public _chartOptions: any;
  public chart: any;
  private graphCategories: Array<string> = [
    '',
    'content',
    'ok',
    'meh',
    'worried',
    'panic'
  ].map(x => `<span class="graphMood graphMood--${x}">\u2022</span>`);

  public timeFrame: string = 'month'; // Day / Week / Month / Year
  public endTimeFrame: object = moment(moment.now()).endOf(this.timeFrame as unitOfTime.StartOf);
  public startTimeFrame: object = moment(moment.now()).startOf(this.timeFrame as unitOfTime.StartOf);
  public canSelectNextTimeFrame: boolean = false;

  public exercises: Array<Exercise> = [];
  public thisTimeFrameExercises: Array<Exercise> = [];
  public previousTimeFrameExercises: Array<Exercise> = [];


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
      title: { text: '' },
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

  ionViewWillLoad() {
    this.getExercises();
    this.eventService.on('exercise_update', this.exerciseUpdate.bind(this));
  }

  ionViewDidEnter() {
    // Every time the view entered, check if we need to recalculate the regression line
    if (this.hasAddedNewExercises) {
      this.addRegressionToGraph();
      this.hasAddedNewExercises = false;
    }
  }

  ionViewWillUnload() {
    this.eventService.destroyListener('exercise_update', this.exerciseUpdate);
  }

  exerciseUpdate(exercise: Exercise) {
    const localExercise = this.exercises.find(currExercise => currExercise.id === exercise.id);

    [exercise.beforeMood, exercise.afterMood].forEach(mood => {
      if (mood.mood !== null) mood.mappedMood = mood.getMappedMood();
    });

    if (!localExercise) {
      this.exercises.push(exercise);
    } else {
      this.exercises[this.exercises.indexOf(localExercise)] = exercise;
    }

    // Check if we need to add the exercise to the graph or anything else
    this.checkToAddExercise(exercise, localExercise ? true : false);
  }

  checkToAddExercise(exercise: Exercise, exerciseExists: boolean) {
    if (this.isExerciseInTimeFrame(exercise, moment(this.endTimeFrame))) {
      if (exerciseExists) {
        this.thisTimeFrameExercises[this.thisTimeFrameExercises.indexOf(exercise)] = exercise;
      } else {
        this.thisTimeFrameExercises.push(exercise);
      }

      // Check if we have a before and after mood
      if (exercise.beforeMood.mood !== null && exercise.afterMood.mood !== null) {
        //check if the point has not been added to the graph
        if (!this.lastAddedExercise || this.lastAddedExercise.id !== exercise.id) {
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

  swipeEvent(event) {
    if (event.isFinal) {
      switch (event.direction) {
        case 2:
          if (this.canSelectNextTimeFrame) this.changeTimeFrame(1);
          break;
        case 4:
          this.changeTimeFrame(-1);
          break;
      }
    }
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
      if (!exercises) return;

      this.exercises = exercises;

      // Now update the graph
      this.addExercisesToGraph(this.exercises, moment(this.endTimeFrame).startOf(this.timeFrame as unitOfTime.StartOf));
    });
  }

  clearSeries(serieNumber: number) {
    const amount = this.chart.series[serieNumber].data.length;
    for (let i = 0; i < amount; i++) {
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
          .map((point: any) => [`${point.x}`, `${point.y}`])
      ).points
      .map(x => [x[0].toString(), x[1].toString()])
      // Sort the points in order to for a smooth line
      .sort()
      .forEach(point => {
        // Add the points to the graph
        this.chart.series[0].addPoint(point);
      });

    // const test = regression
    // .linear(
    // // .polynomial(
    //   this.chart.series[1].data
    //   // Only need the mapped x and y values
    //   .map(point => [point.x, point.y])
    // );
    // console.log(test.predict(4.5));
    // TODO
    // calculate the 'perfect line'
    // See how the user deviates from this
    // Also see how the user deviates from their average linear
    // Use those two values to calulate the points gained for an exercise
  }

  addExercisesToGraph(exercises: Array<Exercise>, beginOfTimeFrame: moment.Moment) {
    // First clear the old exercises
    this.clearExercises();

    exercises
      // Get the exercises for this time frame
      .filter(exercise => moment(exercise.start) >= moment(beginOfTimeFrame) && moment(exercise.start) <= moment(beginOfTimeFrame).add(1, this.timeFrame as moment.unitOfTime.DurationConstructor))
      .forEach(exercise => {
        // Check if there is a before- and aftermood
        if (exercise.beforeMood.mood !== null && exercise.afterMood.mood !== null) {
          this.addExercisePointToGraph(exercise);
        }
      });

    // Add the regression line again
    this.addRegressionToGraph();

    // Update the stats
    this.updateStats(exercises, beginOfTimeFrame);
  }

  isExerciseInTimeFrame(exercise: Exercise, beginOfTimeFrame: moment.Moment): boolean {
    let returnValue: boolean;

    switch (this.timeFrame) {
      case 'day':
        returnValue = Boolean(moment(exercise.start).day() === moment(beginOfTimeFrame).day());
        break;
      case 'week':
        returnValue = Boolean(moment(exercise.start).week() === moment(beginOfTimeFrame).week());
        break;
      case 'month':
        returnValue = Boolean(moment(exercise.start).month() === moment(beginOfTimeFrame).month());
        break;
      case 'year':
        returnValue = Boolean(moment(exercise.start).year() === moment(beginOfTimeFrame).year());
        break;
      default:
        returnValue = false; // Always return something
        break;
    }

    return returnValue;
  }

  updateStats(exercises: Array<Exercise>, beginOfTimeFrame: moment.Moment) {
    // Get the exercises for this timeframe
    this.thisTimeFrameExercises = exercises
      .filter(exercise => this.isExerciseInTimeFrame(exercise, beginOfTimeFrame));

    // Get the exercises for previous timeframe
    this.previousTimeFrameExercises = exercises
      .filter(exercise => this.isExerciseInTimeFrame(exercise, moment(beginOfTimeFrame).add(-1, this.timeFrame as moment.unitOfTime.DurationConstructor)));
  }

  checkIfUserCanSelectNextTimeFrame(): boolean {
    let returnValue: boolean;

    switch (this.timeFrame) {
      case 'day':
        returnValue = !Boolean(moment(this.endTimeFrame).day() === moment(moment.now()).day());
        break;
      case 'week':
        returnValue = !Boolean(moment(this.endTimeFrame).week() === moment(moment.now()).week());
        break;
      case 'month':
        returnValue = !Boolean(moment(this.endTimeFrame).month() === moment(moment.now()).month());
        break;
      case 'year':
        returnValue = !Boolean(moment(this.endTimeFrame).year() === moment(moment.now()).year());
        break;
      default:
        returnValue = false; // Always return something
        break;
    }

    return returnValue;
  }

  changeTimeFrame(direction: number) {
    // Set endTimeFrame to be +1 / -1 timeframe and then till end of timeFrame
    // Based on the direction we move one timeframe back or forward
    this.endTimeFrame = moment(this.endTimeFrame).add((direction > 0 ? 1 : - 1), this.timeFrame as moment.unitOfTime.DurationConstructor).endOf(this.timeFrame as moment.unitOfTime.DurationConstructor);
    this.startTimeFrame = moment(this.startTimeFrame).add((direction > 0 ? 1 : - 1), this.timeFrame as moment.unitOfTime.DurationConstructor);

    // Cant go further than this timeFrame
    this.canSelectNextTimeFrame = this.checkIfUserCanSelectNextTimeFrame()

    // Update the graph again
    this.addExercisesToGraph(this.exercises, moment(this.endTimeFrame).startOf(this.timeFrame as unitOfTime.StartOf));
  }

}
