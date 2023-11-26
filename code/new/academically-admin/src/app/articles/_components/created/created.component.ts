import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { Router } from '@angular/router';

import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import {
  ArticleDto,
  ArticlesServiceProxy,
  ArticleStatus,
  ArticleType,
  CoachingStatus
} from '@shared/service-proxies/service-proxies';

type CreatedTab = 'active' | 'draft' | 'archived';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  activeArticles: ArticleDto[] = [];
  draftArticles: ArticleDto[] = [];
  archivedArticles: ArticleDto[] = [];

  isLoading = true;
  shimmerType = ShimmerType;

  readonly ArticleStatus = ArticleStatus;
  protected readonly fns = {
    [ArticleStatus.Draft]: 'draftArticles',
    [ArticleStatus.Published]: 'activeArticles',
    [ArticleStatus.Archived]: 'archivedArticles'
  };

  activeTab: CreatedTab = 'active';

  constructor(
    injector: Injector,
    private _articlesService: ArticlesServiceProxy,
    private router: Router,
    private _modalDialogService: ModalDialogService,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalActiveArticles(): number { return this.activeArticles?.length; }
  get totalDraftArticles(): number { return this.draftArticles?.length; }
  get totalArchivedArticles(): number { return this.archivedArticles?.length; }

  ngOnInit(): void {
    this.loadArticles();
  }

  async nav(url: string, id: string): Promise<void> {
    await this.router.navigate([url , id]);
  }

  onUpdateStatus(data: ArticleDto, changeToStatus: ArticleStatus): void {
    const { id, status } = data;
    const service = this[this.fns[status]]?.find(x => x.id === id);
    if (!service) {
      return;
    }
    this._articlesService.updateStatus(id, changeToStatus)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.notify.success(this.l('SavedSuccessfully'));
        this[this.fns[status]] = this[this.fns[status]]?.filter(x => x.id !== id);
        service.status = changeToStatus;
        this[this.fns[changeToStatus]].push(service);
      });
  }

  onEditClick(data: ArticleDto) {
    this.router.navigate(['/app/articles' + (data?.type === ArticleType.ArticleSeries ? '/article-series' : ''), data.id]);
  }

  onDuplicateClick(id: string) {
    this._articlesService.duplicate(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loadArticles();
        this.notify.success(this.l('Generics.SuccessfullyDuplicated'));
      });
  }

  onDeleteClick(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteArticleConfirmationMessage'),
      confirmCb: (): void => {
        this._articlesService.delete(id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.loadArticles();
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  async onRedirection(article: ArticleDto): Promise<void> {
    this.router.navigate(['/app/articles/student-portal', article.id]);
  }

  private loadArticles(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._articlesService.getAll(this.appSession.userId, undefined, undefined, undefined, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(articles => {
        this.activeArticles = articles?.items.filter(a => a.status === 1);
        this.draftArticles = articles?.items.filter(a => a.status === 0);
        this.archivedArticles = articles?.items.filter(a => a.status === 2);
      });
  }
}
