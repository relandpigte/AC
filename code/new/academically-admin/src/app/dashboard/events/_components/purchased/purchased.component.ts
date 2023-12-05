import { Component, Injector, OnInit } from '@angular/core';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { EventCategory, EventDto, EventsServiceProxy, ServiceBookingDto, ServicesServiceProxy, UserAvailabilitiesServiceProxy, UserAvailabilityDto } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';
import { BehaviorSubject, of, forkJoin, combineLatest } from 'rxjs';

enum PurchasedTabs {
  Upcoming = 'upcoming',
  Past = 'past',
  Cancelled = 'cancelled'
}

interface BookingInfo {
  booking: ServiceBookingDto;
  tutorAvailabilities: UserAvailabilityDto[];
  tutorBookings: ServiceBookingDto[];
}

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  upcomingEvents: EventDto[] = [];
  pastEvents: EventDto[] = [];
  cancelledEvents: EventDto[] = [];

  selectedTab: PurchasedTabs  = PurchasedTabs.Upcoming;

  purchasedTabs = PurchasedTabs;
  shimmerType = ShimmerType;

  isLoadingBookings$ = new BehaviorSubject<boolean>(false);

  bookingInfo: Map<string, BookingInfo> = new Map();

  constructor(
    injector: Injector,
    private _modalDialogService: ModalDialogService,
    private _modalService: BsModalService,
    private _dashboardPageService: DashboardPagesService,
    private _eventsService: EventsServiceProxy,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest([this._dashboardPageService.isLoading$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get totalUpcomingEvents(): number { return this.upcomingEvents?.length; }
  get totalPastEvents(): number { return this.pastEvents?.length; }
  get totalCancelledEvents(): number { return this.cancelledEvents?.length; }

  ngOnInit(): void {
    this.initStudentEvents();
  }

  async handleJoinClick(id: string): Promise<void> {
    await this._router.navigate(['app/dashboard/events/portal/broadcast/student', id, 'portal']);
  }

  private initStudentEvents(): void {
    this._dashboardPageService.setIsLoading(true);
    this._eventsService.getEnrolledEventsByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.setIsLoading(false)))
      .subscribe(events => {
        this.upcomingEvents = events?.filter(e => moment().isBefore(e.eventDateTime) && e.status !== 0);
        this.pastEvents = events?.filter(e => moment().isAfter(e.eventDateTime));
      });
  }

  private initServiceData(event: EventDto, callback: (bookingInfo: BookingInfo) => void): void {
    forkJoin([
      this._servicesService.getBookingDetails(event.id, this.currentUserId),
      this._userAvailabilitiesService.getAll(event.creatorUserId),
      this._servicesService.getAllBookings(event.id, event.creatorUserId)
    ])
    .pipe(takeUntil(this.destroyed$))
    .subscribe(([booking, tutorAvailabilities, tutorBookings]): void => {
      this.bookingInfo.set(event.id.toString(), {
        booking, tutorAvailabilities, tutorBookings
      });
      callback.call(this, { booking, tutorAvailabilities, tutorBookings });
    });
  }

  onRearrangeSessionClick(event: EventDto): void {
    const openRearrangingModal = ({ booking, tutorAvailabilities, tutorBookings }) => {
      const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
      modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
      modalSettings.initialState = {
        data: event,
        rescheduleBooking: booking,
        userAvailabilities: tutorAvailabilities,
        serviceBookings: tutorBookings,
      };
      const modal = this._modalService.show(BookingServiceComponent, modalSettings);
      modal.content.onSavedBooking.subscribe(() => this.initStudentEvents());
    }

    if (this.bookingInfo.has(event.id.toString())) {
      const bookingInfo = this.bookingInfo.get(event.id.toString());
      openRearrangingModal(bookingInfo);
    } else {
      this.initServiceData(event, openRearrangingModal);
    }
  }

  onCancelSessionClick(event: EventDto): void {
    const options: ModalDialogOptions = {
      title: this.l('Bookings.Cancellation.Confirm.Title'),
      text: this.l('Bookings.Cancellation.Confirm.Subtitle'),
      confirmCb: (): void => {
        const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
        modalSettings.initialState = { data: event, isCancellation: true };
        const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

        purchaseModal.content.onPaid.subscribe((): void => this.initStudentEvents());
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onRepurchaseClick(event: EventDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = { data: event };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => this.initStudentEvents());
  }

  async onRedirection(event: EventDto): Promise<void> {
    this._router.navigate(['app/events' , event.id, 'about']);
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
          title: this.l('Reviews.Submitted.Title'),
          subTitle: this.l('Reviews.Submitted.Body', ['tutor']),
          hasGoToReviews: false
        };
        const modal = this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
        modal.content.onDone.subscribe((): void => {
          this.initStudentEvents();
        });
      }, 200);
    });
  }
}
