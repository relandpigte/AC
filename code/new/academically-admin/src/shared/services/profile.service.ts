import { Injectable } from '@angular/core';
import { UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public $user: Observable<UserLoginInfoDto>;

  private _profileSubject: BehaviorSubject<UserLoginInfoDto>;

  constructor() {
    this._profileSubject = new BehaviorSubject<UserLoginInfoDto>(new UserLoginInfoDto());
    this.$user = this._profileSubject.asObservable();
  }

  public set user(value: UserLoginInfoDto) {
    this._profileSubject.next(value);
  }
}
