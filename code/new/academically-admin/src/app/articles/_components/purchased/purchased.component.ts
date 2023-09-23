import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-purchased', templateUrl: './purchased.component.html', styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  allArticles: ArticleDto[] = [];
  unreadArticles: ArticleDto[] = [];
  readArticles: ArticleDto[] = [];

  isLoading = true;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _articlesService: ArticlesServiceProxy,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalArticles(): number { return this.allArticles?.length; }
  get totalUnreadArticles(): number { return this.unreadArticles?.length; }
  get totalReadArticles(): number { return this.readArticles?.length; }

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._articlesService.getAll(undefined, undefined, undefined, undefined, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(articles => {
        this.allArticles = articles?.items;
      });
  }
}
