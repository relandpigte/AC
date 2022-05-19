import { Component, Injector } from '@angular/core';
import { AbpSessionService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { ActivatedRoute } from '@angular/router';
import { AutoAuthenticateModel } from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './login.component.html',
  animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase {
  submitting = false;
  hide = true;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    public authService: AppAuthService,
    private _sessionService: AbpSessionService
  ) {
    super(injector);
    route.queryParams.subscribe(paramMap => {
      if (paramMap.auto && paramMap.referenceId && paramMap.type) {
        this.submitting = true;
        this.authService.autoAuthenticate(
          new AutoAuthenticateModel({
            type: paramMap.type,
            referenceId: paramMap.referenceId,
          }),
          () => (this.submitting = false),
        );
      }
    });
  }

  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  login(): void {
    this.submitting = true;
    if (this.authService.authenticateResult && this.authService.authenticateResult.isTwoFactorEnabled) {
      this.authService.verifiyTwoFactorCode(() => (this.submitting = false));
    } else {
      this.authService.authenticate(() => (this.submitting = false));
    }
  }

  hideShowPassword(): void {
    this.hide = !this.hide;
  }
}
