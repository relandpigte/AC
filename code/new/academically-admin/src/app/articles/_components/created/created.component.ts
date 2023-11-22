import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { Router } from '@angular/router';

import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { ArticleDto, ArticlesServiceProxy, ArticleStatus } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

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

  handleArchive(id: string): void {
    this._articlesService.updateStatus(id, ArticleStatus.Archived)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.notify.success(this.l('SavedSuccessfully'));
        const data = this.draftArticles.find(x => x.id === id);
        if (!data) {
          return;
        }

        this.draftArticles = this.draftArticles?.filter(x => x.id !== id);
        data.status = ArticleStatus.Archived;
        this.archivedArticles.push(data);
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
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  async onRedirection(e: any, id: string): Promise<void> {
    const tags = ['I', 'A'];
    if (tags.includes(e.target.tagName)) {
      return;
    }

    await this.router.navigate(['app/articles/student-portal', id, 'portal']);
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
