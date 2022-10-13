import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TokenService, LogService, UtilsService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import {
  AccountServiceProxy,
  AuthenticateModel,
  AuthenticateResultModel,
  AutoAuthenticateModel,
  AutoAuthenticateType,
  TokenAuthServiceProxy,
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class AppAuthService {
  authenticateModel: AuthenticateModel;
  authenticateResult: AuthenticateResultModel;
  rememberMe: boolean;
  verificationCode: string;

  constructor(
    private _tokenAuthService: TokenAuthServiceProxy,
    private _accountsService: AccountServiceProxy,
    private _router: Router,
    private _utilsService: UtilsService,
    private _tokenService: TokenService,
    private _logService: LogService
  ) {
    this.clear();
  }

  logout(reload?: boolean): void {
    abp.auth.clearToken();
    abp.utils.setCookieValue(
      AppConsts.authorization.encryptedAuthTokenName,
      undefined,
      undefined,
      abp.appPath
    );
    if (reload !== false) {
      location.href = AppConsts.appBaseUrl;
    }
  }

  authenticate(finallyCallback?: () => void): void {
    finallyCallback = finallyCallback || (() => { });

    this._tokenAuthService
      .authenticate(this.authenticateModel)
      .pipe(
        finalize(() => {
          finallyCallback();
        })
      )
      .subscribe((result: AuthenticateResultModel) => {
        this.authenticateResult = result;
        if (!result.isTwoFactorEnabled) {
          this.processAuthenticateResult();
        }
      });
  }

  autoAuthenticate(autoAuthModel: AutoAuthenticateModel, finallyCallback?: () => void): void {
    finallyCallback = finallyCallback || (() => { });

    this._tokenAuthService
      .autoAuthenticate(autoAuthModel)
      .pipe(
        finalize(() => {
          finallyCallback();
        })
      )
      .subscribe((result: AuthenticateResultModel) => {
        this.authenticateResult = result;
        if (!result.isTwoFactorEnabled) {
          let redirectUrl = '';
          if (+autoAuthModel.type === AutoAuthenticateType.Event) {
            redirectUrl = `/app/dashboard/events/portal/broadcast/student/${result.referenceId}/portal/${autoAuthModel.referenceId}`;
          }
          console.log(redirectUrl);
          this.processAuthenticateResult(redirectUrl);
        }
      });
  }

  verifiyTwoFactorCode(finallyCallback?: () => void): void {
    finallyCallback = finallyCallback || (() => { });

    this._accountsService
      .authenticateUser(this.authenticateResult.userId, this.verificationCode)
      .pipe(
        finalize(() => {
          finallyCallback();
        })
      )
      .subscribe(() => {
        this.processAuthenticateResult();
      });
  }

  private processAuthenticateResult(redirectUrl = '') {
    if (this.authenticateResult.accessToken) {
      // Successfully logged in
      this.login(
        this.authenticateResult.accessToken,
        this.authenticateResult.encryptedAccessToken,
        this.authenticateResult.expireInSeconds,
        this.rememberMe,
        redirectUrl,
      );
    } else {
      // Unexpected result!

      this._logService.warn('Unexpected authenticateResult!');
      this._router.navigate(['account/login']);
    }
  }

  private login(
    accessToken: string,
    encryptedAccessToken: string,
    expireInSeconds: number,
    rememberMe?: boolean,
    redirectUrl = '',
  ): void {
    const tokenExpireDate = rememberMe
      ? new Date(new Date().getTime() + 1000 * expireInSeconds)
      : undefined;

    this._tokenService.setToken(accessToken, tokenExpireDate);

    this._utilsService.setCookieValue(
      AppConsts.authorization.encryptedAuthTokenName,
      encryptedAccessToken,
      tokenExpireDate,
      abp.appPath
    );

    if (redirectUrl) {
      location.href = redirectUrl;
      return;
    }

    let initialUrl = UrlHelper.initialUrl;
    if (initialUrl.indexOf('/login') > 0 || initialUrl.indexOf('/complete-registration')) {
      initialUrl = AppConsts.appBaseUrl;
    }

    location.href = initialUrl;
  }

  private clear(): void {
    this.authenticateModel = new AuthenticateModel();
    this.authenticateModel.rememberClient = false;
    this.authenticateResult = null;
    this.rememberMe = false;
  }
}
