import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
  transform(entry: any, args?: any): any {
    const result = [];
    const keys = Object.keys(entry);
    const values = Object.values(entry);
    for (let i = 0; i < keys.length; i++) {
      if (isNaN(Number(keys[i]))) {
        result.push({ key: keys[i].replace(new RegExp('_', 'g'), ' '), value: values[i] });
      }
    }
    return result;
  }
}
