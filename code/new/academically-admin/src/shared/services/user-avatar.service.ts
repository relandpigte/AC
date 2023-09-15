import { Injectable } from '@angular/core';
import { UserDto, UserServiceProxy, UserStatus, UserStatusLogDto } from '../service-proxies/service-proxies';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Observable } from '@node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAvatarService {
  private data: UserStatusLogDto[] = [];
  private dataSubject = new BehaviorSubject<UserStatusLogDto[]>(this.data);

  constructor(private _userService: UserServiceProxy) { }

  getUserStatusLog(): Observable<UserStatusLogDto[]> {
    return this.dataSubject.asObservable();
  }

  addUserStatusLog(item: UserStatusLogDto): void {
    this.data = this.data?.filter(us => us.creatorUserId !== item.creatorUserId)?.concat(item);
    this.dataSubject.next(this.data);
  }

  setUserStatusLogs(items: UserStatusLogDto[]): void {
    this.data = items;
    this.dataSubject.next(this.data);
  }

  createUserStatusReportLog(status: UserStatus): void {
    this._userService.createUserStatusLog(status)
      .pipe(take(1))
      .subscribe();
  }

  getAllUserLogByStatus(status: UserStatus, data: UserStatusLogDto[]): UserDto[] {
    return data?.filter(s => s.status === status)?.map(s => s.creatorUser);
  }
}
