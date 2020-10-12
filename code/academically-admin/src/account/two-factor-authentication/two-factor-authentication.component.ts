import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.less'],
  animations: [accountModuleAnimation()]
})
export class TwoFactorAuthenticationComponent extends AppComponentBase implements OnInit {
  submitting = false;
  verificationCode: string;
  sessionValues: any;
  userId: number;
  rememberMe: boolean;
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _accountService: AccountServiceProxy,
    private _authService: AppAuthService,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((p: any) => {
      if (p.filter) {
        this.sessionValues = JSON.parse(p.filter);
        this.accessToken = this.sessionValues[0].accessToken;
        this.encryptedAccessToken = this.sessionValues[1].encryptedAccessToken;
        this.expireInSeconds = this.sessionValues[2].expireInSeconds;
        this.userId = this.sessionValues[3].userId;
        this.rememberMe = this.sessionValues[4].rememberMe;
      }
    });
  }

  onFormSubmit(): void {
    this.submitting = true;
    this._accountService.authenticateUser(this.userId, this.verificationCode).subscribe(result => {
      if (!result.status) {
        this.message.error(result.statusMessage);
        this.submitting = false;
      } else {
        this._authService.login(this.accessToken, this.encryptedAccessToken, this.expireInSeconds, this.rememberMe);
      }
    });
  }
}
