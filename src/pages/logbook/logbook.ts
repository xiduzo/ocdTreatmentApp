import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'logbook-page',
  templateUrl: 'logbook.html'
})
export class LogbookPage {

  public exercises:any = [];

  constructor(
    private storage: Storage
  ) {
  }

  ionViewWillEnter() {
    this.getExercises();
  }

  ionViewDidLoad() {
  }

  getExercises() {
    this.storage.get('exercises').then((exercises) => {
      // Only show the exercises where a comment has been made
      this.exercises = exercises.filter((exercise) => {
        // console.log(exercise.moodBefore.explanation || exercise.moodAfter.explanation || exercise.obsessiveThoughts.explanation || exercise.compulsiveBehaviour.explanation)
        return exercise.beforeMood.explanation || exercise.afterMood.explanation || exercise.obsessiveThoughts.explanation || exercise.compulsiveBehaviour.explanation;
      });
    });
  }

}
