import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { USER_STATUS_STATE_ID } from '@app/app.component';
import { UserStatus } from '@shared/service-proxies/service-proxies';
import { PubSubService } from '@shared/services/pub-sub.service';
import { UserAvatarStateService } from '@shared/services/user-avatar-state.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class CustomRequestInterceptor {

  constructor(
    private _injector: Injector,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
      return next.handle(req)
        .pipe(
          finalize(async () => {
            // report online status
            if (req.url.endsWith('CreateUserStatusLog')) return;
            const pubSubService = this._injector.get(PubSubService);
            const appSession = this._injector.get(AppSessionService);
            if (pubSubService && appSession) {
              const userAvatarStateService = pubSubService.getStateService<UserAvatarStateService>(USER_STATUS_STATE_ID);
              if (userAvatarStateService) {
                if (!userAvatarStateService.isUserOnline(appSession.userId)) {
                  userAvatarStateService.reportUserStatusReportLog(UserStatus.Online);
                }
              }
            }
          })
        );
  }
}
