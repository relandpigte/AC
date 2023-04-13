import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...'): string {
    if (completeWords && value?.length > limit) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value?.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}
