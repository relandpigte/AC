import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@shared/service-proxies/service-proxies';

@Pipe({
  name: 'search',
  pure: true
})
export class SearchPipe implements PipeTransform {

  transform(value: UserDto[], searchText?: string): UserDto[] {
    if (!value) { return null; }
    if (!searchText) { return value; }

    searchText = searchText.toLowerCase();
    return value.filter(u => u.fullName.toLowerCase().includes(searchText));
  }
}
