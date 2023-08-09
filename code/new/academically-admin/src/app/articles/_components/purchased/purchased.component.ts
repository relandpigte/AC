import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDtoPagedResultDto, ArticlesServiceProxy, ArticleStatus, ArticleType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-purchased', templateUrl: './purchased.component.html', styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  articles: ArticleDtoPagedResultDto;
  ArticleStatus = ArticleStatus;
  ArticleType = ArticleType;
  isLoading = true;

  constructor(injector: Injector, private _articleService: ArticlesServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this._articleService.getAll(undefined, undefined, undefined, undefined, undefined, undefined)
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
