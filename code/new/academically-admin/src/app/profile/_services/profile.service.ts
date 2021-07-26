import { Injectable } from '@angular/core';
import { UserDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public user$: Observable<UserDto>;
  public isViewOnly$: Observable<boolean>;

  private _profileSubject: BehaviorSubject<UserDto>;
  private _isViewOnlySubject: BehaviorSubject<boolean>;

  constructor() {
    this._profileSubject = new BehaviorSubject<UserDto>(new UserDto());
    this.user$ = this._profileSubject.asObservable();
    this._isViewOnlySubject = new BehaviorSubject<boolean>(false);
    this.isViewOnly$ = this._isViewOnlySubject.asObservable();
  }

  public set user(value: UserDto) {
    this._profileSubject.next(value);
  }

  public set isViewOnly(value: boolean) {
    this._isViewOnlySubject.next(value);
  }
}
