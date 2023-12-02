import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';
import { CoachingDto, CoachingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  upcomingCoachings: CoachingDto[] = [];
  pastCoachings: CoachingDto[] = [];
  cancelledCoachings: CoachingDto[] = [];

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalDialogService: ModalDialogService,
    private _dashboardPageService: DashboardPagesService,
    private _coachingService: CoachingsServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  get userId(): number { return this.appSession.userId; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalUpcomingCoaching(): number { return this.upcomingCoachings?.length; }
  get totalPastCoaching(): number { return this.pastCoachings?.length; }
  get totalCancelledCoaching(): number { return this.cancelledCoachings?.length; }
  get additionalData() {
    return {
      booking: {
        durationInSec: Math.floor(Math.random() * (9000000 - 30000) + 30000),
      }
    };
  }

  ngOnInit(): void {
    this.loadPurchasedCoaching();
  }

  onReview(data: any): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LeaveReviewComponent>;
    modalSettings.class = 'modal-sm modal-dialog-centered modal-service-rating';
    modalSettings.initialState = { data };
    const modal = this._modalService.show(LeaveReviewComponent, modalSettings);

    modal.content.onCloseModal.subscribe((): void => {
      this._modalService.hide();
    });

    modal.content.onReviewSuccess.subscribe((): void => {
      setTimeout((): void => {
        const modalConfirmationSettings = this.defaultModalSettings as ModalOptions<LeaveReviewConfirmationComponent>;
        modalConfirmationSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
        modalConfirmationSettings.initialState = {
          reviewURL: `app/coaching/${data.id}/reviews`,
          title: this.l('ReviewSubmitted'),
          subTitle: this.l('CoachingReviewMessage')
        };
        this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
      }, 200);
    });
  }

  async onRedirection(coaching: CoachingDto): Promise<void> {
    this._router.navigate(['app/coaching' , coaching.id, 'about']);
  }

  onRearrangeSessionClick(coaching: CoachingDto): void {
  }

  onCancelSessionClick(coaching: CoachingDto): void {
    const options: ModalDialogOptions = {
      title: this.l('Bookings.Cancellation.Confirm.Title'),
      text: this.l('Bookings.Cancellation.Confirm.Subtitle'),
      confirmCb: (): void => {
        const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
        modalSettings.initialState = { data: coaching, isCancellation: true };
        const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

        purchaseModal.content.onPaid.subscribe((): void => this.loadPurchasedCoaching());
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onRepurchaseClick(coaching: CoachingDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = { data: coaching };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => this.loadPurchasedCoaching());
  }

  private loadPurchasedCoaching(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coachingService.getAllPurchasedCoaching(this.userId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(data => {
        this.upcomingCoachings = data?.filter(x => moment(x.serviceBooking?.bookingDateTime).isAfter(moment()));
        this.pastCoachings = data?.filter(x => moment(x.serviceBooking?.bookingDateTime).isBefore(moment()));
      });
  }
}
