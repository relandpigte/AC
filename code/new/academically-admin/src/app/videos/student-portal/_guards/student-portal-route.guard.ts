import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { VideosServiceProxy, VideoType } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class StudentPortalRouteGuard implements CanActivate, CanActivateChild {
  constructor(
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
          abp.ui.clearBusy();
          return resolve(true);
        });
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

}
