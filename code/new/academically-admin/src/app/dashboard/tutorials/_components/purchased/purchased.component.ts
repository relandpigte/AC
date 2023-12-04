import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  tutorials: VideoDto[] = [];
  unwatchedTutorials: VideoDto[] = [];
  watchedTutorials: VideoDto[] = [];

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalDialogService: ModalDialogService,
    private _modalService: BsModalService,
    private _dashboardPageService: DashboardPagesService,
    private _videoService: VideosServiceProxy
  ) {
    super(injector);
  }

  get isLoading$(): Observable<boolean> { return this._dashboardPageService.isLoading$; }
  get totalTutorials(): number { return this.tutorials?.length; }
  get totalUnwatchedTutorials(): number { return this.unwatchedTutorials?.length; }
  get totalWatchedTutorials(): number { return this.watchedTutorials?.length; }

  ngOnInit(): void {
    this.initTutorials();
  }

  private initTutorials(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._videoService.getEnrolledVideosByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(videos => {
        this.tutorials = videos;
      });
  }

  onRearrangeSessionClick(tutorial: VideoDto): void {
  }

  onCancelSessionClick(tutorial: VideoDto): void {
    const options: ModalDialogOptions = {
      title: this.l('Bookings.Cancellation.Confirm.Title'),
      text: this.l('Bookings.Cancellation.Confirm.Subtitle'),
      confirmCb: (): void => {
        const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
        modalSettings.initialState = { data: tutorial, isCancellation: true };
        const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

        purchaseModal.content.onPaid.subscribe((): void => this.initTutorials());
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onRepurchaseClick(tutorial: VideoDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = { data: tutorial };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => this.initTutorials());
  }

  async onRedirection(tutorial: VideoDto): Promise<void> {
    this._router.navigate(['app/videos/student-portal' , tutorial.id]);
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
          reviewURL: `/app/videos/student-portal/${data.id}/portal/reviews`,
          title: this.l('Reviews.Submitted.Title'),
          subTitle: this.l('Reviews.Submitted.Body', ['tutor']),
        };
        const modal = this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
        modal.content.onDone.subscribe((): void => {
          this.initTutorials();
        });
      }, 200);
    });
  }
}
