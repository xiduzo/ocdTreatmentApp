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

  getExercises() {
    this.storage.get('exercises').then((exercises) => {
      if(!exercises) return;
      // Only show the exercises where a comment has been made
      this.exercises = exercises.filter((exercise) => {
        // Map the moods to 1-5 scale
        if(exercise.beforeMood) exercise.beforeMood.mood = Math.round(map(exercise.beforeMood.mood, 0, 500, 1, 5));
        if(exercise.afterMood) exercise.afterMood.mood = Math.round(map(exercise.afterMood.mood, 0, 500, 1, 5));

        // If any explanation has been provided, return the exercise
        if(exercise.beforeMood && exercise.beforeMood.explanation) return exercise;
        if(exercise.afterMood && exercise.afterMood.explanation) return exercise;
        if(exercise.step.triggers.find(trigger => { return trigger.explanation })) return exercise;
      });
    });
  }

}
