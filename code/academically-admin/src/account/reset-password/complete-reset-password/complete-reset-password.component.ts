import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PasswordResetInputDto, PasswordResetsServiceProxy } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-complete-reset-password',
  templateUrl: './complete-reset-password.component.html',
  styleUrls: ['./complete-reset-password.component.less'],
  animations: [accountModuleAnimation()]
})
export class CompleteResetPasswordComponent extends AppComponentBase implements OnInit {
  passwordReset: PasswordResetInputDto = new PasswordResetInputDto();
  saving = false;
  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _passwordResetService: PasswordResetsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.passwordReset.id = paramMap.get('id');
      this.validatePasswordReset();
    });
  }

  onResetPasswordSubmit(): void {
    this.saving = true;
    this._passwordResetService.resetPassword(this.passwordReset).subscribe(
      () => {
        this.saving = false;
        this.notify.info(this.l('PaswordResetSucessful'));
        this._router.navigate(['/account/login']);
      },
      error => {
        this.saving = false;
      }
    );
  }

  private validatePasswordReset(): void {
    this.saving = true;
    this._passwordResetService.validate(this.passwordReset.id).subscribe(
      () => {
        this.saving = false;
      },
      error => {
        this.saving = false;
        this._router.navigate(['/account/login']);
      }
    );
  }
}
