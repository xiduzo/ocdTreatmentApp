import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public _chartOptionsScatter:any;
  public _dataScatter:any = [];
  public _chartOptionsParallel:any;
  public _dataParallel:any = [];

  constructor(
    public navCtrl: NavController
  ) {
    for(let i = 0; i<=25; i++) {
      this._dataScatter.push([
        Math.random()*4,
        Math.random()*4
      ])
    }
    this._chartOptionsScatter = {
      chart: { type: 'scatter' },
      title: { text: '', },
      xAxis: {
        title: { text: 'Before' },
        categories: ['=(', ':(', ':|', ':)', '=)']
      },
      yAxis: {
        title: { text: 'After' },
        categories: ['=(', ':(', ':|', ':)', '=)']
      },
      legend: { enabled: false },
      series: [
        { data: this._dataScatter },
        {
          type: 'line',
          name: 'Regression Line',
          data: [[0,0.5], [4, 3.51]],
        }
      ],
      credits: { href: null, text: '' }
    }
    for(let i = 0; i <= 25; i++) {
      const feelings = ['=(', ':(', ':|', ':)', '=)']
      this._dataParallel.push([
        {y: 0, x: Math.round(Math.random()*1)},
        {y: 1, x: Math.round(Math.random()*4)},
        {y: 2, x: Math.round(Math.random()*3)+1},
      ]);
      // To test without percise feeling
      // this._dataParallel.push([
      //   {y: 0, x: Math.round(Math.random()*1)},
      //   {y: 1, x: (Math.random()*4)},
      //   {y: 2, x: (Math.random()*2)+2},
      // ]);
    }
    this._chartOptionsParallel = {
      chart: {
        type: 'spline',
        parallelCoordinates: true,
      },
      xAxis: [
        {
          categories: [1,2,3,4,5,6,7,8],
          visible: false,
        },
        {
          categories: ['=(', ':(', ':|', ':)', '=)'],
          visible: false,
        },
        {
          categories: ['=(', ':(', ':|', ':)', '=)'],
          visible: false,
        }
      ],
      yAxis: {
        categories: ['level', 'before', 'after'],
        labels: { enabled: false, },
        title: { text: null },
        reversed: true,
        plotBands: [
          {
            from: -0.5,
            to: 0.5,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
              align: 'center',
              verticalAlign: 'top',
              y: 25,
              text: 'Level',
              style: {
                color: '#606060'
              }
            }
          },
          {
            from: 0.5,
            to: 1.5,
            color: 'rgba(68, 170, 213, 0)',
            label: {
              align: 'center',
              verticalAlign: 'middle',
              y: 0,
              text: 'Before',
              style: {
                color: '#606060'
              }
            }
          },
          {
            from: 1.5,
            to: 2.5,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
              align: 'center',
              verticalAlign: 'bottom',
              y: -25,
              text: 'After',
              style: {
                color: '#606060'
              }
            }
          },

        ]
      },
      title: { text: '', },
      legend: { enabled: false },
      colors: ['rgba(11, 200, 200, 0.25)'],
      series: this._dataParallel.map((set,i) => {
        return {
          name: 'set ' + i,
          data: set,
          shadow: false
        }
      }),
      credits: { href: null, text: '' }
    }
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
  }

  onChartload (event) {
    event.context.renderer.image(
      'https://www.highcharts.com/samples/graphics/sun.png',
      30, // X
      55, // Y
      30, // Width
      30 // Height
    ).attr({zIndex: 10}).add();
    event.context.renderer.image(
      'https://www.highcharts.com/samples/graphics/sun.png',
      97, // X
      55, // Y
      30, // Width
      30 // Height
    ).attr({zIndex: 10}).add();
    event.context.renderer.image(
      'https://cdn.shopify.com/s/files/1/1061/1924/products/Sad_Face_Emoji_large.png?v=1480481055',
      30, // X
      180, // Y
      25, // Width
      25 // Height
    ).attr({zIndex: 10}).add();
    event.context.renderer.image(
      'http://pngimg.com/uploads/smiley/smiley_PNG36231.png',
      300, // X
      180, // Y
      25, // Width
      25 // Height
    ).attr({zIndex: 10}).add();
  }

}
