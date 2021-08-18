import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
  transform(data: Object) {
    const keys = Object.keys(data);
    const v = keys.slice(keys.length / 2);
    const k = keys.slice(0, (keys.length / 2));
    const newData = [];
    for (let i = 0; i < keys.length / 2; i++) {
      newData[k[i]] = v[i];
    }
    return newData;
  }
}
