import { Component } from '@angular/core';

import moment from 'moment';
import { unitOfTime } from 'moment';

import regression from 'regression';

import { mapRange } from '@/lib/helpers';

import { select } from '@angular-redux/store';
import { IExerciseState } from '@/stores/exercise/exercise.reducer';
import { IExercise } from '@/stores/exercise/exercise.model';
import { calculateRegressionPoints } from '@/lib/regression';
import { Observable } from 'rxjs';

@Component({
  selector: 'progress-page',
  templateUrl: 'progress.html'
})
export class ProgressPage {
  @select() readonly exercises$: Observable<IExerciseState>;

  private exerciseList: IExercise[];
  public thisTimeFrameExercises: IExercise[] = [];
  public previousTimeFrameExercises: IExercise[] = [];

  private timeFrame: string = 'month'; // day / week / month / year
  public startTimeFrame: moment.Moment = moment(moment.now()).startOf(this
    .timeFrame as unitOfTime.StartOf);
  public endTimeFrame: moment.Moment = moment(moment.now()).endOf(this
    .timeFrame as unitOfTime.StartOf);
  public canSelectNextTimeFrame: boolean = false;

  // Chart
  private chart: any;
  public chartOptions: any;
  public graphCategories: string[] = [
    '',
    'content',
    'ok',
    'meh',
    'worried',
    'panic'
  ].map(
    (mood: string): string =>
      `<span class="graphMood graphMood--${mood}">\u2022</span>`
  );

  constructor() {
    this.exercises$.subscribe((exerciseState: IExerciseState) => {
      this.exerciseList = [...exerciseState.list];
      this.changeDisplayedExercises();
      if (this.chart) this.setChartData();
    });
  }

  ionViewDidEnter = (): void => {
    this.setChartOptions();
  };

  setChart = (chart: any) => {
    this.chart = chart;
    this.setChartData();
  };

  setChartOptions = (): void => {
    this.chartOptions = {
      chart: {
        type: 'scatter',
        height: 350,
        animation: false,
        marginBottom: 35
      },
      title: { text: '' },
      xAxis: {
        // after
        title: {
          text: ''
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
      yAxis: {
        // before
        title: { text: '' },
        min: 1,
        max: 5,
        categories: this.graphCategories,
        labels: {
          useHTML: true
        },
        gridLineWidth: 0,
        lineWidth: 2
      },
      legend: { enabled: false },
      series: [
        {
          // https://github.com/virtualstaticvoid/highcharts_trendline
          type: 'spline',
          dashStyle: 'Dash',
          name: 'Regression Line',
          data: [],
          color: '#F07879',
          marker: { enabled: false },
          states: { hover: { lineWidth: 0 } },
          enableMouseTracking: false
        },
        {
          name: 'Observations',
          data: [],
          color: '#7D8CA9',
          enableMouseTracking: false,
          marker: { symbol: 'round', radius: 6 }
        }
      ],
      credits: { href: null, text: '' }
    };
  };

  setChartData = (): void => {
    this.addExercisesToGraph();
    this.addRegressionToGraph();
  };

  clearSeries = (seriesNumber: number): void => {
    if (!this.chart) return;

    const loopAmount = this.chart.series[seriesNumber].data.length;
    for (let i = 0; i < loopAmount; i++) {
      this.chart.series[seriesNumber].removePoint(0);
    }
  };

  clearRegression = (): void => this.clearSeries(0);

  clearExercises = (): void => this.clearSeries(1);

  addExerciseToGraph = (exercise: IExercise): void => {
    this.chart.series[1].addPoint([
      mapRange(exercise.afterMood.mood, 0, 500, 1, 5),
      mapRange(exercise.beforeMood.mood, 0, 500, 1, 5)
    ]);
  };

  addExercisesToGraph = (): void => {
    this.clearExercises();

    this.thisTimeFrameExercises.forEach(
      (exercise: IExercise): void => {
        if (
          exercise.beforeMood.mood !== null &&
          exercise.afterMood.mood !== null
        ) {
          this.addExerciseToGraph(exercise);
        }
      }
    );
  };

  addRegressionToGraph = (): void => {
    const points = calculateRegressionPoints();

    points.forEach((point: number[]) => {
      this.chart.series[0].addPoint(point);
    });
  };

  changeTimeFrame = (direction: number): void => {
    // Set endTimeFrame to be +1 / -1 time frame and then till end of timeFrame
    // Based on the direction we move one time frame back or forward
    this.endTimeFrame = moment(this.endTimeFrame)
      .add(direction > 0 ? 1 : -1, this
        .timeFrame as moment.unitOfTime.DurationConstructor)
      .endOf(this.timeFrame as moment.unitOfTime.DurationConstructor);
    this.startTimeFrame = moment(this.startTimeFrame).add(
      direction > 0 ? 1 : -1,
      this.timeFrame as moment.unitOfTime.DurationConstructor
    );

    // Cant go further than this timeFrame
    this.canSelectNextTimeFrame = !this.checkIfInTimeFrame(
      this.endTimeFrame,
      moment(moment.now()).startOf(this.timeFrame as unitOfTime.StartOf)
    );

    // Update the exercises
    this.changeDisplayedExercises();
  };

  changeDisplayedExercises = (): void => {
    this.thisTimeFrameExercises = this.exerciseList.filter(
      (exercise: IExercise) => {
        const returnExercise = this.checkIfInTimeFrame(
          moment(exercise.start),
          moment(this.endTimeFrame)
        );
        if (returnExercise) return exercise;
      }
    );
    this.previousTimeFrameExercises = this.exerciseList.filter(
      (exercise: IExercise) => {
        const returnExercise = this.checkIfInTimeFrame(
          moment(exercise.start),
          moment(this.endTimeFrame).add(-1, this
            .timeFrame as unitOfTime.DurationConstructor)
        );
        if (returnExercise) return exercise;
      }
    );

    if (this.chart) this.addExercisesToGraph();
  };

  checkIfInTimeFrame = (
    timeFrame: moment.Moment,
    beginOfTimeFrame: moment.Moment
  ): boolean => {
    switch (this.timeFrame) {
      case 'day':
        return Boolean(
          moment(timeFrame).day() === moment(beginOfTimeFrame).day()
        );
      case 'week':
        return Boolean(
          moment(timeFrame).week() === moment(beginOfTimeFrame).week()
        );
      case 'month':
        return Boolean(
          moment(timeFrame).month() === moment(beginOfTimeFrame).month()
        );
      case 'year':
        return Boolean(
          moment(timeFrame).year() === moment(beginOfTimeFrame).year()
        );
      default:
        return true; // Always return something
    }
  };

  swipeEvent = (event): void => {
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
  };
}
