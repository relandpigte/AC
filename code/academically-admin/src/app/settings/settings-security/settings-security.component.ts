import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserServiceProxy, EnableAuthenticatorModelDto, UserDto } from '@shared/service-proxies/service-proxies';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['./settings-security.component.less']
})
export class SettingsSecurityComponent extends AppComponentBase implements OnInit {
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  verificationCode: string;
  enableAuthenticator: EnableAuthenticatorModelDto;
  twoFactorAuthenticationStatus: boolean;
  constructor(injector: Injector, private _userService: UserServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUserAuthentication();
    this.getUser();
  }

  onFormSubmit(): void {
    this._userService.enableUserTwoFactorAuthentication(this.appSession.userId, this.verificationCode).subscribe(response => {
      if (response.status) {
        this.notify.success(this.l(response.statusMessage));
        this.verificationCode = null;
      } else {
        this.notify.error(this.l(response.statusMessage));
      }
    });
  }

  getUserAuthentication() {
    this._userService.getUserTwoFactorAuthentication(this.appSession.userId).subscribe(response => {
      this.enableAuthenticator = response;
    });
  }

  getUser() {
    this._userService.getUserTwoFactorAuthenticationStatus(this.appSession.userId).subscribe(status => {
      this.twoFactorAuthenticationStatus = status;
    });
  }

  onDisableClick(status: boolean): void {
    if (!status) {
      this.message.confirm('This will disable two factor authentication. Would you like to continue?', undefined, (result: boolean) => {
        if (result) {
          this._userService.disableUserTwoFactorAuthentication(this.appSession.userId).subscribe(response => {
            if (response) {
              this.message.success(this.l('DisabledSuccessfully'));
            }
          });
        }
      });
    }
  }
}
