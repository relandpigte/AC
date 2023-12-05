import { Component, Injector, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, of } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { ServiceBookingDto, ServicesServiceProxy, UserAvailabilitiesServiceProxy, UserAvailabilityDto, VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

enum PurchasedTabs {
  All = 'all',
  Unwatched = 'unwatched',
  Watched = 'watched'
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
  tutorials: VideoDto[] = [];
  unwatchedTutorials: VideoDto[] = [];
  watchedTutorials: VideoDto[] = [];

  selectedTab: PurchasedTabs  = PurchasedTabs.All;

  purchasedTabs = PurchasedTabs;
  shimmerType = ShimmerType;

  isLoadingBookings$ = new BehaviorSubject<boolean>(false);

  bookingInfo: Map<string, BookingInfo> = new Map();

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalDialogService: ModalDialogService,
    private _modalService: BsModalService,
    private _dashboardPageService: DashboardPagesService,
    private _videoService: VideosServiceProxy,
    private _servicesService: ServicesServiceProxy,
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest([this._dashboardPageService.isLoading$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
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

  private initServiceData(tutorial: VideoDto, callback: (bookingInfo: BookingInfo) => void): void {
    forkJoin([
      this._servicesService.getBookingDetails(tutorial.id, this.currentUserId),
      this._userAvailabilitiesService.getAll(tutorial.creatorUserId),
      this._servicesService.getAllBookings(tutorial.id, tutorial.creatorUserId)
    ])
    .pipe(takeUntil(this.destroyed$))
    .subscribe(([booking, tutorAvailabilities, tutorBookings]): void => {
      this.bookingInfo.set(tutorial.id.toString(), {
        booking, tutorAvailabilities, tutorBookings
      });
      callback.call(this, { booking, tutorAvailabilities, tutorBookings });
    });
  }

  onRearrangeSessionClick(tutorial: VideoDto): void {
    const openRearrangingModal = ({ booking, tutorAvailabilities, tutorBookings }) => {
      const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
      modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
      modalSettings.initialState = {
        data: tutorial,
        rescheduleBooking: booking,
        userAvailabilities: tutorAvailabilities,
        serviceBookings: tutorBookings,
      };
      const modal = this._modalService.show(BookingServiceComponent, modalSettings);
      modal.content.onSavedBooking.subscribe(() => this.initTutorials());
    }

    if (this.bookingInfo.has(tutorial.id.toString())) {
      const bookingInfo = this.bookingInfo.get(tutorial.id.toString());
      openRearrangingModal(bookingInfo);
    } else {
      this.initServiceData(tutorial, openRearrangingModal);
    }
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
