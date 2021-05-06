import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { ChangePasswordDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent extends AppComponentBase implements OnInit {
  @ViewChild('changePasswordForm') changePasswordForm: NgForm;
  model: ChangePasswordDto = new ChangePasswordDto();
  confirmNewPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];
  isLoading = false;

  constructor(
    injector: Injector,
    private _usersService: UserServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.isLoading = true;

    this._usersService
      .changePassword(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((success) => {
        if (success) {
          this.notify.success(this.l('PasswordChangedSuccessfully'));
          this.model = new ChangePasswordDto();
          this.changePasswordForm.reset();
        }
      });
  }
}
