import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PricingType, EventsServiceProxy, EventType } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class StudentPortalRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    private _eventsService: EventsServiceProxy,
    private _router: Router,
    private _appSession: AppSessionService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    abp.ui.setBusy();
    return new Promise((resolve) => {
      const eventId: string = route.params['event-id'];
      this._eventsService.get(eventId)
        .subscribe(response => {
          if (response.type === EventType.EventSeries && response.children && response.children.length) {
            const seriesFirstEventId = response.children[0].id;
            if (seriesFirstEventId !== eventId) {
              if (this._appSession.userId === response.creatorUserId) {
                this._router.navigate([`/app/events/student-portal/${seriesFirstEventId}/portal`]);
              } else {
                this._router.navigate([`/app/events/student-portal/${seriesFirstEventId}/landing-page`]);
              }
            }
          }
          if (this._appSession.userId === response.creatorUserId) {
            abp.ui.clearBusy();
            return resolve(true);
          }
          if (response.pricingType !== PricingType.Free) {
            this._eventsService.getPurchased(eventId)
              .subscribe(studentEvent => {
                if (state.url.includes('landing-page')) {
                  abp.ui.clearBusy();
                  if (studentEvent && studentEvent.id) {
                    this._router.navigate([`/app/events/student-portal/${eventId}/portal`]);
                  } else {
                    return resolve(true);
                  }
                } else {
                  abp.ui.clearBusy();
                  if (!studentEvent || !studentEvent.id) {
                    this._router.navigate([`/app/events/student-portal/${eventId}/landing-page`]);
                  } else {
                    return resolve(true);
                  }
                }
              });
          } else {
            abp.ui.clearBusy();
            if (state.url.includes('landing-page')) {
              this._router.navigate([`/app/events/student-portal/${eventId}/portal`]);
            } else {
              return resolve(true);
            }
          }
        });
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

}
