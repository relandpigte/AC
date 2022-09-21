import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {

    transform(value:object|Map<any, any>): any {
      if(value instanceof Map){ return Array.from(value.keys()); }
      return Object.keys(value);
    }

}
