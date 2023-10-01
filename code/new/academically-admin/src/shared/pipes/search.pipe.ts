import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@shared/service-proxies/service-proxies';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(users: UserDto[], searchText?: string): UserDto[] {
    if (!users) { return null; }
    if (!searchText) { return users; }

    searchText = searchText.toLowerCase();
    return users.filter(u => u.fullName.toLowerCase().includes(searchText));
  }
}
