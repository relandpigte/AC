import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDtoPagedResultDto, ArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-purchased', templateUrl: './purchased.component.html', styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  articles: ArticleDtoPagedResultDto;
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

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this._articlesService.getAll(undefined, undefined, undefined, undefined, undefined, undefined)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.isLoading = false)
      )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(articles => {
        this.articles = articles;
      });
  }
}
