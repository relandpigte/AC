import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PricingType, ServicesServiceProxy, VideosServiceProxy, VideoType } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class StudentPortalRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    private _appSession: AppSessionService,
    private _servicesService: ServicesServiceProxy,
    private _videosService: VideosServiceProxy,
    private _router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    abp.ui.setBusy();
    return new Promise((resolve) => {
      const videoId: string = route.params['video-id'];
      this._videosService.get(videoId)
        .subscribe(response => {
          if (response.type === VideoType.VideoSeries && response.children && response.children.length) {
            const seriesFirstVideoId = response.children[0].id;
            if (seriesFirstVideoId !== videoId) {
              this._router.navigate([`/app/videos/student-portal/${seriesFirstVideoId}/portal`]);
            }
          }
          if (response.pricingType !== PricingType.Free) {
            this._servicesService.getAllPurchases(videoId, this._appSession.userId)
              .subscribe(([purchase]) => {
                if (state.url.includes('landing-page')) {
                  abp.ui.clearBusy();
                  if (purchase?.id) {
                    this._router.navigate([`/app/videos/student-portal/${videoId}/portal`]);
                  } else {
                    return resolve(true);
                  }
                } else {
                  abp.ui.clearBusy();
                  if (!purchase?.id) {
                    this._router.navigate([`/app/videos/student-portal/${videoId}/landing-page`]);
                  } else {
                    return resolve(true);
                  }
                }
              });
          } else {
            abp.ui.clearBusy();
            if (state.url.includes('landing-page')) {
              this._router.navigate([`/app/videos/student-portal/${videoId}/portal`]);
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
