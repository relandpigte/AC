import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PasswordResetsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
  animations: [accountModuleAnimation()]
})
export class ResetPasswordComponent extends AppComponentBase {
  emailAddress: string;
  saving = false;
  constructor(injector: Injector, private _passwordResetService: PasswordResetsServiceProxy, private _router: Router) {
    super(injector);
  }

  onResetPasswordSubmit(): void {
    this.saving = true;
    this._passwordResetService
      .create(this.emailAddress)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.message.info(this.l('PasswordResetEmailSent'));
        this._router.navigate(['/account/login']);
        return;
      });
  }
}
