import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';


import { ExerciseSuccessModal } from '../success/exercise.success';

@Component({
  selector: 'page-exercise-after',
  templateUrl: 'exercise.after.html'
})
export class ExerciseAfterModal {

  public level:any;
  public exercise:any;

  public range:any = { min: 0, max: 5 };

  public obsessiveThoughts:number = 0;
  public obsessiveThoughtsReason:string;
  public compulsiveBehaviour:number = 0;
  public compulsiveBehaviourReason:string;

  public tracking:any;
  private dbLink:string;

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    this.exercise = this.params.get('exercise');
    this.level = this.params.get('level');
    this.tracking = this.params.get('tracking');
    this.dbLink = this.params.get('dbLink');
  }


  done() {
    this.tracking.obsessiveThoughts.rating = this.obsessiveThoughts;
    this.tracking.obsessiveThoughts.explanation = this.obsessiveThoughtsReason;
    this.tracking.compulsiveBehaviour.rating = this.compulsiveBehaviour;
    this.tracking.compulsiveBehaviour.explanation = this.compulsiveBehaviourReason;

    let successModal = this.modalCtrl.create(ExerciseSuccessModal, {level: this.level, exercise: this.exercise, tracking: this.tracking, dbLink: this.dbLink });
    successModal.present();

    // console.table(this.tracking);
    this.viewCtrl.dismiss();

  }

}
