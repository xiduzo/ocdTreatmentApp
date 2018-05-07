import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ExerciseSuccessModal } from '../exercise/success/exercise.success';
import { YbocsModal } from '../ybocs/ybocs';

import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public _chartOptions:any;

  public endWeek:any = moment(moment.now()).endOf('week');
  public startWeek:any = moment(moment.now()).startOf('week');
  public canSelectNextWeek:boolean = false;

  public moods = [
    'panicly',
    'worried',
    'meh',
    'okay',
    'content'
  ];

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController
  ) {

    this._chartOptions = {
      chart: {
        height: 250
      },
      title: { text: ''},
      xAxis: {
        min: 0, // use angleLength
        max: 6.26, // use angleLength
        title: {
          text: 'BEFORE'
        }
      },
      yAxis: {
        min: 0, // use angleLength
        max: 6.26, // use angleLength
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

  // Add images to chart
  onChartload(){}
  // onChartload (event) {
  //   event.context.renderer.image(
  //     'https://www.highcharts.com/samples/graphics/sun.png',
  //     30, // X
  //     55, // Y
  //     30, // Width
  //     30 // Height
  //   ).attr({zIndex: 10}).add();
  //   event.context.renderer.image(
  //     'https://www.highcharts.com/samples/graphics/sun.png',
  //     97, // X
  //     55, // Y
  //     30, // Width
  //     30 // Height
  //   ).attr({zIndex: 10}).add();
  //   event.context.renderer.image(
  //     'https://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_large.png?v=1480481055',
  //     30, // X
  //     180, // Y
  //     25, // Width
  //     25 // Height
  //   ).attr({zIndex: 10}).add();
  //   event.context.renderer.image(
  //     'http://pngimg.com/uploads/smiley/smiley_PNG36231.png',
  //     300, // X
  //     180, // Y
  //     25, // Width
  //     25 // Height
  //   ).attr({zIndex: 10}).add();
  // }

  testModal() {
    let testModal = this.modalCtrl.create(ExerciseSuccessModal);
    testModal.present();
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
