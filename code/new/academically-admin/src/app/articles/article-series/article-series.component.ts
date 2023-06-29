import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, ArticleType, ArticleStatus } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { CreateArticleComponent } from '../_components/create-article/create-article.component';
import { ArticleService } from '../_services/article.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize, take } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-article-series',
  templateUrl: './article-series.component.html',
  styleUrls: ['./article-series.component.less'],
  animations: [appModuleAnimation()],
})
export class ArticleSeriesComponent extends AppComponentBase implements OnInit {
  parentId: string;
  model = new ArticleDto();

  ArticleStatus = ArticleStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
        this.getArticleSeries();
      }
    });
  }

  ngOnInit(): void {
    this._articleService.articleCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.model = response;
        }
      });
  }

  onAddArticleClick(): void {
    const newArticle = new ArticleDto();
    newArticle.type = ArticleType.SingleArticle;
    newArticle.status = ArticleStatus.Draft;
    newArticle.name = '';
    newArticle.parentId = this.parentId;

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateArticleComponent>;
    modalSettings.initialState = {
      model: newArticle,
    };
    const modal = this._modalService.show(CreateArticleComponent, modalSettings).content;
    modal.createArticle.subscribe(article => {
      this._articlesService.create(article)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['app/articles/article-series', response.parentId, response.id]);
        });
    });
  }

  onPublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('PublishArticleConfirmationMessage'),
      confirmCb: (): void => {
        this._articlesService.updateStatus(this.model.id, ArticleStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = ArticleStatus.Published;
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUnpublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('UnpublishArticleConfirmationMessage'),
      confirmCb: (): void => {
        this._articlesService.updateStatus(this.model.id, ArticleStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = ArticleStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getArticleSeries(): void {
    this._articlesService.get(this.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._articleService.articleCreated = response;
      });
  }
}
