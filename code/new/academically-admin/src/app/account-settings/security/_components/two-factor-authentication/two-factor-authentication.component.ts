import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AuthenticatorDto, AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { pipe } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.less']
})
export class TwoFactorAuthenticationComponent extends AppComponentBase implements OnInit {
  NgxQrcodeElementTypes = NgxQrcodeElementTypes;
  NgxQrcodeErrorCorrectionLevels = NgxQrcodeErrorCorrectionLevels;
  model: AuthenticatorDto = new AuthenticatorDto();
  verificationCode: string;
  is2FaEnabled = false;
  is2FaLoading = false;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
  ) {
    super(injector);
  }

  onVerificationFormSubmit(): void {
    this.is2FaLoading = true;
    this._accountService.enableUserTwoFactorAuthentication(this.verificationCode)
      .pipe(
        takeUntil(this.destroyed$),
        pipe(finalize(() => {
          this.is2FaLoading = false;
        })),
      )
      .subscribe(() => {
        this.notify.success(this.l('TwoFactorAuthenticationEnabledMessage'));
        this.model.isEnabled = true;
      });
  }

  ngOnInit(): void {
    this.getAuthenticatorStatus();
  }

  on2FaStatusChange(): void {
    if (!this.is2FaEnabled && this.model.isEnabled) {
      this.message.confirm(
        this.l('TwoFactorAuthenticationDisableConfirmationMessage'),
        undefined,
        (result: boolean) => {
          if (result) {
            this.is2FaLoading = true;
            this._accountService.disableUserTwoFactorAuthentication()
              .pipe(
                takeUntil(this.destroyed$),
                pipe(finalize(() => {
                  this.is2FaLoading = false;
                })),
              )
              .subscribe(() => {
                this.model.isEnabled = false;
                this.notify.success(this.l('TwoFactorAuthenticationDisabledMessage'));
              });
          } else {
            this.is2FaEnabled = true;
          }
        }
      );
    }
  }

  private getAuthenticatorStatus(): void {
    this.is2FaLoading = true;
    this._accountService.getUserTwoFactorAuthentication()
      .pipe(
        takeUntil(this.destroyed$),
        pipe(finalize(() => {
          this.is2FaLoading = false;
        })),
      )
      .subscribe(authenticator => {
        this.model = authenticator;
        this.is2FaEnabled = this.model.isEnabled;
      });
  }
}
