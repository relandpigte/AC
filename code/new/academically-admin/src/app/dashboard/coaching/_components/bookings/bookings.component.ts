import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { AvailableServiceDto, CoachingsServiceProxy, ScheduledServiceType } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.less']
})
export class BookingsComponent extends AppComponentBase implements OnInit {
  upcomingCoaching: AvailableServiceDto[];
  pastCoaching: AvailableServiceDto[];
  cancelledCoaching: AvailableServiceDto[];

  isLoading = true;
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _coachingsService: CoachingsServiceProxy,
    private _modalService: BsModalService,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get additionalData() {
    return {
      booking: {
        durationInSec: 1800000
      }
    };
  }
  get totalUpcomingCoaching(): number { return this.upcomingCoaching?.length ?? 0; }
  get totalPastCoaching(): number { return this.pastCoaching?.length ?? 0; }
  get totalCancelledCoaching(): number { return this.cancelledCoaching?.length ?? 0; }

  ngOnInit(): void {
    this.loadBookings();
  }

  onCancelSession(data: any): void {
    const options: ModalDialogOptions = {
      title: this.l('Bookings.Cancellation.Confirm.Title'),
      text: this.l('Bookings.Cancellation.Confirm.Subtitle'),
      confirmCb: (): void => {
        const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
        modalSettings.initialState = { data: data, isCancellation: true, title: this.l('CancelSession') };
        const modal = this._modalService.show(BookingServiceComponent, modalSettings);

        modal.content.onCancelledBooking.subscribe((): void => {
          this.loadBookings();
        });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private loadBookings(): void {
    forkJoin([
      this._coachingsService.getBookingScheduled(this.currentUserId, ScheduledServiceType.Upcoming),
      this._coachingsService.getBookingScheduled(this.currentUserId, ScheduledServiceType.Past),
      this._coachingsService.getBookingScheduled(this.currentUserId, ScheduledServiceType.Cancelled)
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([upcoming, past, cancelled]): void => {
        this.upcomingCoaching = upcoming;
        this.pastCoaching = past;
        this.cancelledCoaching = cancelled;
      });
  }
}
