import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, ArticleStatus, ServicesType } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../_services/article.service';
import { takeUntil } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize } from '@node_modules/rxjs/operators';
import { CommunityPostService } from '@shared/services/community-post.service';
import { MenuItem, ServiceCreateService } from '@shared/services/service-create.service';

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
  defaultMenuItem: MenuItem;
  menuItems: MenuItem[] = [
    {
      id: 'content',
      label: 'Content',
      icon: 'assets/img/service/create/edit.svg',
      iconHover: 'assets/img/service/create/edit-hover.svg',
      infoText: 'Here 2, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'details',
      label: 'Details',
      icon: 'assets/img/service/create/list.svg',
      iconHover: 'assets/img/service/create/list-hover.svg',
      infoText: 'Here, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'assets/img/service/create/settings.svg',
      iconHover: 'assets/img/service/create/settings-hover.svg',
      infoText: 'Here 4, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
  ];

  readonly ServicesType = ServicesType;
  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _articleService: ArticleService,
    private _articlesService: ArticlesServiceProxy,
    private _communityPostService: CommunityPostService,
    private _modalDialogService: ModalDialogService,
    private _serviceCreateService: ServiceCreateService
  ) {
    super(injector);
    this._serviceCreateService.setDefaultMenuItem(this.menuItems[0]);
    this._serviceCreateService.getDefaultMenuItem().subscribe(x => this.defaultMenuItem = x);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getArticle();
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

  onLessonPreviewClick(): void {
    const url = `${AppConsts.appBaseUrl}/app/lesson-preview/${this.id}`;
    window.open(url, '_blank');
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
            this.notify.success(this.l('SavedSuccessfully'));
            this._communityPostService.hasNewItemToShare({ serviceId: this.model.id });
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
            this.notify.success(this.l('SavedSuccessfully'));
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getArticle(): void {
    this._articlesService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._articleService.articleCreated = response;
      });
  }
}
