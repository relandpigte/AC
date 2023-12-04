import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from '@node_modules/rxjs/operators';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';

enum PurchasedTabs {
  All = 'all',
  Unread = 'unread',
  Read = 'read'
}

@Component({
  selector: 'app-purchased', templateUrl: './purchased.component.html', styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  allArticles: ArticleDto[] = [];
  unreadArticles: ArticleDto[] = [];
  readArticles: ArticleDto[] = [];

  isLoading = true;

  selectedTab: PurchasedTabs  = PurchasedTabs.All;

  purchasedTabs = PurchasedTabs;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalDialogService: ModalDialogService,
    private _modalService: BsModalService,
    private _articlesService: ArticlesServiceProxy,
    private _dashboardPageService: DashboardPagesService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalArticles(): number { return this.allArticles?.length; }
  get totalUnreadArticles(): number { return this.unreadArticles?.length; }
  get totalReadArticles(): number { return this.readArticles?.length; }

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._articlesService.getEnrolledArticlesByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(articles => {
        this.allArticles = articles;
      });
  }

  onRearrangeSessionClick(article: ArticleDto): void {
  }

  onCancelSessionClick(article: ArticleDto): void {
    const options: ModalDialogOptions = {
      title: this.l('Bookings.Cancellation.Confirm.Title'),
      text: this.l('Bookings.Cancellation.Confirm.Subtitle'),
      confirmCb: (): void => {
        const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
        modalSettings.initialState = { data: article, isCancellation: true };
        const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

        purchaseModal.content.onPaid.subscribe((): void => this.loadArticles());
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onRepurchaseClick(article: ArticleDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = { data: article };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => this.loadArticles());
  }

  async onRedirection(article: ArticleDto): Promise<void> {
    this._router.navigate(['/app/articles/student-portal', article.id]);
  }

  onReviewAction(data: any): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LeaveReviewComponent>;
    modalSettings.class = 'modal-sm modal-dialog-centered modal-service-rating';
    modalSettings.initialState = {
      data,
      placeholder: this.l('Reviews.ShareYourThoughts', [data.name])
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
          reviewURL: `/app/articles/student-portal/${data.id}/portal/reviews`,
          title: this.l('Reviews.Submitted.Title'),
          subTitle: this.l('Reviews.Submitted.Body', ['author']),
        };
        const modal = this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
        modal.content.onDone.subscribe((): void => {
          this.loadArticles();
        });
      }, 200);
    });
  }
}
