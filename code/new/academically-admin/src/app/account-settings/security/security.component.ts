import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { ProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.less']
})
export class SecurityComponent extends AppComponentBase {
  isLoading = false;

  constructor(
    injector: Injector,
    private _profilesService: ProfilesServiceProxy,
    private _authService: AppAuthService,
  ) {
    super(injector);
  }

  onDeleteAccountClick(): void {
    this.message.confirm(
      this.l('DeleteAccountConfirmationMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this._profilesService.deleteAccount()
            .pipe(
              takeUntil(this.destroyed$),
              finalize(() => {
                this.isLoading = false;
              })
            )
            .subscribe(() => {
              this.message.success(this.l('DeleteAccountConfirmedMessage'));
              setTimeout(() => {
                this._authService.logout();
              }, 2000);
            });
        }
      },
      {
        isHtml: true,
        confirmButtonText: this.l('DeleteMyAccount'),
        buttonsStyling: false,
        input: 'text',
        customClass: {
          confirmButton: 'btn btn-lg btn-danger mr-2',
          cancelButton: 'btn btn-lg btn-info',
        },
        preConfirm: (enteredText: string) => {
          if (enteredText !== 'CONFIRM') {
            this.message.error(this.l('DeleteAccountConfirmationTextErrorMessage'));
            return false;
          }
          return true;
        },
      }
    );
  }
}
