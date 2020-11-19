import { Injectable } from '@angular/core';
import { GetProfileDetailDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public $profile: Observable<GetProfileDetailDto>;
  public $isViewOnly: Observable<boolean>;

  private _profileSubject: BehaviorSubject<GetProfileDetailDto>;
  private _isViewOnlySubject: BehaviorSubject<boolean>;

  constructor() {
    this._profileSubject = new BehaviorSubject<GetProfileDetailDto>(new GetProfileDetailDto());
    this._isViewOnlySubject = new BehaviorSubject<boolean>(false);
    this.$profile = this._profileSubject.asObservable();
    this.$isViewOnly = this._isViewOnlySubject.asObservable();
  }

  public set profile(value: GetProfileDetailDto) {
    this._profileSubject.next(value);
  }

  public set isViewOnly(value: boolean) {
    this._isViewOnlySubject.next(value);
  }
}
