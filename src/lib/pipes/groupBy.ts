import { Pipe, PipeTransform } from '@angular/core';

// http://www.competa.com/blog/custom-groupby-pipe-angular-4/
@Pipe({ name: 'groupBy', pure: false })
export class groupByPipe implements PipeTransform {
  transform(collection: Array<any>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) return;

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, items: groupedCollection[key] }));
  }
}
