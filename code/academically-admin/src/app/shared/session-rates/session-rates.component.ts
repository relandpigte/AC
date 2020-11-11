import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserProfilesServiceProxy, UserSupportServiceSessionRateDto } from '@shared/service-proxies/service-proxies';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-session-rates',
  templateUrl: './session-rates.component.html',
  styleUrls: ['./session-rates.component.less']
})
export class SessionRatesComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Input() supportServiceId: string;
  @Output() modalSave = new EventEmitter<any>();
  isLoading = false;
  userSessionRate: UserSupportServiceSessionRateDto = new UserSupportServiceSessionRateDto();
  constructor(injector: Injector, private _userProfileService: UserProfilesServiceProxy, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUserSupportServiceSessionRate();
  }

  onFormSubmit(): void {
    this.saveUserSupportServiceSessionRate();
  }

  onCloseClick(): void {
    this.close();
  }

  private saveUserSupportServiceSessionRate(): void {
    this.isLoading = true;
    this._userProfileService.saveUserSupportServiceSessionRate(this.userSessionRate).subscribe(() => {
      this.notify.success(this.l('SavedSuccessfully'));
      this.isLoading = false;
      this.modalSave.emit();
      this.close();
    });
  }

  private getUserSupportServiceSessionRate(): void {
    this.isLoading = true;
    this._userProfileService.getUserSupportServiceSessionRate(this.supportServiceId).subscribe(userSupportServiceSessionRate => {
      this.userSessionRate = userSupportServiceSessionRate;
      this.isLoading = false;
    });
  }

  private close(): void {
    this._modalRef.hide();
  }
}
