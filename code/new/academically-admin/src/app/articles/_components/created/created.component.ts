import { Component, Injector, OnInit } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import {
  ArticleDtoPagedResultDto,
  ArticlesServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { Router } from '@node_modules/@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  articles: ArticleDtoPagedResultDto;
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

  ngOnInit(): void {
    this.loadArticles();
  }

  async nav(url: string, id: string): Promise<void> {
    await this.router.navigate([url , id]);
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

  private loadArticles(): void {
    this._articlesService.getAll(this.appSession.userId, undefined, undefined, undefined, undefined, undefined)
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
