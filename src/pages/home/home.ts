import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public _chartOptions:any;

  constructor(
    public navCtrl: NavController
  ) {
    this._chartOptions = {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      legend: { enabled: false },
      series: [{
        name: 'Jane',
        data: [1, 0, 4]
      }, {
        name: 'John',
        data: [5, 7, 3]
      }],
      credits: { href: null, text: '' }
    }
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
  }

}
