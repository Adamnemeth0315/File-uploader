import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sorter'
})
export class SorterPipe implements PipeTransform {

  transform(value: any[] | null, key: string, direction: number = 1): any[] | null {
    if (!Array.isArray(value) || !key) {
      return value;
    }

    return value.sort((a, b) => {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return (a[key] - b[key]) * direction
      } else {
        return ('' + a[key]).toLowerCase().localeCompare(('' + b[key]).toLowerCase()) * direction;
      }
    })
  } 
}
