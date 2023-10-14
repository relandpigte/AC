import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { ArticleType, ArticlesServiceProxy, PricingType, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class StudentPortalRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    private _appSession: AppSessionService,
    private _servicesService: ServicesServiceProxy,
    private _articleService: ArticlesServiceProxy,
    private _router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    abp.ui.setBusy();
    return new Promise((resolve) => {
      const articleId: string = route.params['article-id'];
      this._articleService.get(articleId)
        .subscribe(response => {
          if (response.type === ArticleType.ArticleSeries && response.children && response.children.length) {
            const seriesFirstArticleId = response.children[0].id;
            if (seriesFirstArticleId !== articleId) {
              this._router.navigate([`/app/articles/student-portal/${seriesFirstArticleId}/landing-page`]);
            }
          }
          if (response.pricingType !== PricingType.Free) {
            this._servicesService.getAllPurchases(articleId, this._appSession.userId)
              .subscribe(([purchase]) => {
                if (state.url.includes('landing-page')) {
                  abp.ui.clearBusy();
                  if (purchase?.id) {
                    this._router.navigate([`/app/articles/student-portal/${articleId}/portal`]);
                  } else {
                    return resolve(true);
                  }
                } else {
                  abp.ui.clearBusy();
                  if (!purchase?.id) {
                    this._router.navigate([`/app/articles/student-portal/${articleId}/landing-page`]);
                  } else {
                    return resolve(true);
                  }
                }
              });
          } else {
            abp.ui.clearBusy();
            if (state.url.includes('landing-page')) {
              this._router.navigate([`/app/articles/student-portal/${articleId}/portal`]);
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
