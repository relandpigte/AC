import { Component, OnInit, Injector, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ArticleService } from './_services/article.service';
import { ArticlesServiceProxy, ArticleDto, ArticleStatus, ArticleType } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { ChooseTemplateComponent } from './_components/choose-template/choose-template.component';
import { ArticleTemplate } from './_models/article-template';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateArticleComponent } from './_components/create-article/create-article.component';
import { takeUntil } from 'rxjs/operators';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less'],
  animations: [appModuleAnimation()],
})
export class ArticlesComponent extends AppComponentBase implements OnInit, AfterViewInit {
  shimmerType = ShimmerType;
  readonly DashboardServiceView = DashboardServiceView;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _articleService: ArticleService,
    private _router: Router,
    private _articlesService: ArticlesServiceProxy,
    private _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService,
    private _cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get userView(): string { return this._dashboardService.getUserView(); }
  get isLearnerView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.learner; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    setTimeout(() => this._dashboardPageService.setIsLoading(false), 3000);
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
  }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
    this._cdr.detectChanges();
  }

  onNewArticleClick(): void {
    this.showChooseTemplateModal();
  }

  private showChooseTemplateModal(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseTemplateComponent>;
    const modal = this._modalService.show(ChooseTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: ArticleTemplate) => {
      const newArticle = new ArticleDto();
      newArticle.type = template.type;
      newArticle.status = ArticleStatus.Draft;
      newArticle.name = '';

      const createArticleModalSettings = this.defaultModalSettings as ModalOptions<CreateArticleComponent>;
      createArticleModalSettings.initialState = {
        model: newArticle,
      };
      const createArticleModal = this._modalService.show(CreateArticleComponent, createArticleModalSettings).content;
      createArticleModal.createCancel.subscribe(() => {
        this.showChooseTemplateModal();
      });
      createArticleModal.createArticle.subscribe(article => {
        this._articlesService.create(article)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._articleService.articleCreated = article;
            if (response.type === ArticleType.SingleArticle) {
              this._router.navigate(['/app/articles/', response.id]);
            } else {
              this._router.navigate(['/app/articles/article-series/', response.id]);
            }
          });
      });
    });
  }
}
