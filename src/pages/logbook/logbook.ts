import { Component } from '@angular/core';
import { Storage } from '@ionic/storage'

import { map } from '../../lib/helpers';

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
      if(!exercises) return;
      // Only show the exercises where a comment has been made
      this.exercises = exercises.filter((exercise) => {
        // Map the moods to 1-5 scale
        exercise.beforeMood.mood = Math.round(map(exercise.beforeMood.mood, 0, 500, 1, 5));
        exercise.afterMood.mood = Math.round(map(exercise.afterMood.mood, 0, 500, 1, 5));

        // console.log(exercise.moodBefore.explanation || exercise.moodAfter.explanation || exercise.obsessiveThoughts.explanation || exercise.compulsiveBehaviour.explanation)
        // return exercise.beforeMood.explanation || exercise.afterMood.explanation || exercise.obsessiveThoughts.explanation || exercise.compulsiveBehaviour.explanation;
        // TODO only show exercises with comments
        return exercise.beforeMood && exercise.afterMood;
      });
    });
  }

}
