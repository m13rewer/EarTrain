import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortCuts'
})
export class ShortCutsPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    let shortCutMap: Object = {
      'a': 'c',
      's': 'd',
      'd': 'e',
      'h': 'a',
      'j': 'b',
      'w': 'c#',
      'e': 'd#',
      't': 'f#',
      'y': 'g#',
      'u': 'a#',
      'c': 'c',
      'f': 'f',
      'g': 'g',
      'b': 'b',
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '7'
    };
    
    return shortCutMap[value] ? shortCutMap[value] : false;
  }

}
