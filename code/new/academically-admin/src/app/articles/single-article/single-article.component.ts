import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, ArticleStatus } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../_services/article.service';
import { takeUntil } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.less'],
  animations: [appModuleAnimation()],
})
export class SingleArticleComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new ArticleDto();
  isLoading = false;
  ArticleStatus = ArticleStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _articleService: ArticleService,
    private _articlesService: ArticlesServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.getArticle();
  }

  onLessonPreviewClick(): void {
    const url = `${AppConsts.appBaseUrl}/app/lesson-preview/${this.id}`;
    window.open(url, '_blank');
  }

  onPublishClick(): void {
    this.message.confirm(this.l('PublishArticleConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._articlesService.updateStatus(this.model.id, ArticleStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = ArticleStatus.Published;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  onUnpublishClick(): void {
    this.message.confirm(this.l('UnpublishArticleConfirmationMessage'), undefined, (result) => {
      if (result) {
        this._articlesService.updateStatus(this.model.id, ArticleStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = ArticleStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    });
  }

  private getArticle(): void {
    this._articlesService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this._articleService.articleCreated = this.model;
      });
  }
}
