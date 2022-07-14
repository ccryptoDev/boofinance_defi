import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'loopNumber'
})
export class LoopNumberPipe implements PipeTransform {
  transform(value: number): any[] {
    return Array.from(Array(value).keys());
  }
}
