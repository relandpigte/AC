import { Location } from '@angular/common';
import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '@app/_shared/services/upload.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { ArticleDto, ArticleType, ArticlesServiceProxy, GetStudentArticleDto, PricingType, ServiceReviewDto, ServicesServiceProxy, StudentArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ServiceDataService } from '@shared/services/service-data.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { PreviewService } from './_services/preview.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
  animations: [appModuleAnimation()],
})
export class PreviewComponent extends AppComponentBase implements OnInit {
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;

  private _id: string;

  model = new ArticleDto();
  studentArticle = new GetStudentArticleDto();
  ownReview: ServiceReviewDto;
  thumbnailUrl: string;

  isSidebarHidden = false;
  isPreview = false;

  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _router: Router,
    private _modalService: BsModalService,
    private _location: Location,
    private _uploadService: UploadService,
    private _articlesService: ArticlesServiceProxy,
    private _previewService: PreviewService,
    private _studentArticlesService: StudentArticlesServiceProxy,
    private _servicesService: ServicesServiceProxy,
    private _serviceData: ServiceDataService
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.isPreview = true;
        this.id = paramMap.get('id');
      }
    });

    this._previewService.studentArticle$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.studentArticle = response;
        }
      });
  }

  @Input() set id(value: string) {
    this._id = value;
    this._previewService.preview = this.isPreview;
    this.getArticle();
  }

  @Input() set tab(tab: string) {
    if (tab) {
      setTimeout(() => {
        this.sidebar.setMenuItemClick(tab);
      });
    }
  }

  get articleId(): string {
    return this.model.id;
  }

  get shouldShowArticle(): boolean {
    return this.isPreview || this.model.pricingType === PricingType.Free || (!this.isPreview && !_.isEmpty(this.studentArticle));
  }

  ngOnInit(): void {
  }

  onExitClick(): void {
    if (this.isPreview) {
      this._location.back();
    } else {
      this._router.navigate(['/app/explore/articles']);
    }
  }

  private getArticle(): void {
    forkJoin([
      this._articlesService.get(this._id),
      this._servicesService.getUserReview(this._id),
      this._servicesService.getServiceReviewStats(this._id),
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([article, review, reviewStats]) => {
        this.model = article;
        this.ownReview = review;

        this._previewService.article = article;
        this._serviceData.serviceReview = review;
        this._serviceData.serviceReviewStats = reviewStats;
        this.thumbnailUrl = this._uploadService.getFileUrl(article.thumbnailDocument);
        if (!this.isPreview) {
          this.getStudentArticle();
        }
      });
  }

  private getStudentArticle(): void {
    this._studentArticlesService.getByArticle(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentArticle = response;
      });
  }

  onMarkAsComplete(): void {
    if (!this.ownReview?.creationTime) this.onReview(this.model);
  }

  onReview(data: any): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LeaveReviewComponent>;
    modalSettings.class = 'modal-sm modal-dialog-centered modal-service-rating';
    modalSettings.initialState = {
      data,
      placeholder: this.l('Reviews.ShareYourThoughts', [this.model.name])
    };
    const modal = this._modalService.show(LeaveReviewComponent, modalSettings);

    modal.content.onCloseModal.subscribe((): void => {
      this._modalService.hide();
    });

    modal.content.onReviewSuccess.subscribe((): void => {
      setTimeout((): void => {
        const modalConfirmationSettings = this.defaultModalSettings as ModalOptions<LeaveReviewConfirmationComponent>;
        modalConfirmationSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
        modalConfirmationSettings.initialState = {
          title: this.l('Reviews.Submitted.Title'),
          subTitle: this.l('Reviews.Submitted.Body', ['author']),
          hasGoToReviews: false,
        };
        const modal = this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
        modal.content.onDone.subscribe((): void => {
          this.sidebar.setMenuItemClick('reviews');
        });
      }, 200);
    });
  }

}
