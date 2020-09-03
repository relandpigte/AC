import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AccountServiceProxy, RegistrationDto, RegistrationsServiceProxy
} from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';

@Component({
  templateUrl: './register.component.html',
  animations: [accountModuleAnimation()]
})
export class RegisterComponent extends AppComponentBase {
  model: RegistrationDto = new RegistrationDto();
  saving = false;
  isTAndCAccepted = false;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _registrationsService: RegistrationsServiceProxy,
    private _router: Router,
    private authService: AppAuthService
  ) {
    super(injector);
  }

  onFormSubmit(): void {
    this.saving = true;
    this._registrationsService
      .create(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('RegistrationEmailSent'));
        this._router.navigate(['/account/login']);
        return;
      });
  }
}
