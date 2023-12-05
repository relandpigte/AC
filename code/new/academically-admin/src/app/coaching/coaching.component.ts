import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { LandingPagesService } from '@shared/services/landing-pages.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ChatService } from '@shared/services/chat.service';
import { ServiceDataService } from '@shared/services/service-data.service';
import { ServiceChatComponent } from '@shared/modals/service-chat/service-chat.component';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';
import {
  ChatsServiceProxy, CoachingDto, CoachingsServiceProxy, ServiceBookingDto, ServiceReviewDto, ServiceReviewStats,
  ServicesServiceProxy, UserAvailabilitiesServiceProxy, UserAvailabilityDto
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [accountModuleAnimation()]
})
export class CoachingComponent extends  AppComponentBase implements OnInit {
  id: string;
  data: CoachingDto;
  review: ServiceReviewDto;

  booking: ServiceBookingDto;
  userAvailabilities: UserAvailabilityDto[] = [];
  serviceBookings: ServiceBookingDto[] = [];

  constructor(
    injector: Injector,
    private _landingPageService: LandingPagesService,
    private _chatService: ChatService,
    private _modalDialogService: ModalDialogService,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _coachingService: CoachingsServiceProxy,
    private _serviceData: ServiceDataService,
    private _chatsService: ChatsServiceProxy,
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this._chatService.openChat$.subscribe(() => this.openMessageModal());
    this._serviceData.serviceData$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.data = x);
    this._serviceData.serviceBooking$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.booking = x);
    this._serviceData.serviceReview$.pipe(takeUntil(this.destroyed$)).subscribe(x => this.review = x);
  }

  get isAboutTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'about'].join('/')); }
  get isDiscussionTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'discussion'].join('/')); }
  get isReviewsTab(): boolean { return this._router.url.includes([`coaching/${this.id}`, 'reviews'].join('/')); }
  get serviceOwnerId(): number { return this.data?.creatorUser?.id; }
  get serviceId(): string { return this.data?.id; }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    setTimeout(() => this._landingPageService.setIsLoading(false), 2000);
    this.initServiceData();
  }

  onCancel(): void {
    const options: ModalDialogOptions = {
      title: this.l('Bookings.Cancellation.Confirm.Title'),
      text: this.l('Bookings.Cancellation.Confirm.Subtitle'),
      confirmCb: (): void => {
        const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
        modalSettings.initialState = { data: this.data, isCancellation: true, title: this.l('CancelSession') };
        const modal = this._modalService.show(BookingServiceComponent, modalSettings);

        modal.content.onCancelledBooking.subscribe((): void => {
          this.data.isCancelled = true;
        });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onPurchase(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = {
      data: this.data,
      userAvailabilities: this.userAvailabilities,
      serviceBookings: this.serviceBookings,
      title: this.l('BookASession'),
    };
    const modal = this._modalService.show(BookingServiceComponent, modalSettings);

    modal.content.onSavedBooking.subscribe(booking => {
      this._serviceData.serviceBooking = booking;
      this.data.isCancelled = false;
      this._serviceData.serviceData = this.data;
    });
  }

  onReschedule(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = {
      data: this.data,
      userAvailabilities: this.userAvailabilities,
      serviceBookings: this.serviceBookings,
      rescheduleBooking: this.booking,
      title: this.l('RescheduleSession'),
    };
    const modal = this._modalService.show(BookingServiceComponent, modalSettings);

    modal.content.onSavedBooking.subscribe(booking => {
      this._serviceData.serviceBooking = booking;
      this.data.isCancelled = false;
      this._serviceData.serviceData = this.data;
    });
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
          reviewURL: `app/coaching/${this.serviceId}/reviews`,
          title: this.l('ReviewSubmitted'),
          subTitle: this.l('CoachingReviewMessage')
        };
        this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
      }, 200);
    });
  }

  private async openMessageModal(): Promise<void> {
    try {
      const channel = await this._chatsService.getChannelByRecipient(this.serviceOwnerId, this.appSession.userId).toPromise();
      const modalSettings = this.defaultModalSettings as ModalOptions<ServiceChatComponent>;
      modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-service-chat';
      modalSettings.initialState = {
        channel: channel,
        service: this.data
      };
      const modal = this._modalService.show(ServiceChatComponent, modalSettings);
      modal.content.onClose.subscribe((): void => {
        this._modalService.hide();
      });
      modal.content.onFail.subscribe((): void => {
        this._modalService.hide();
        setTimeout(() => this.openMessageModal(), 200);
      });
    } catch (e) {
      console.error(e);
    }
  }

  private initServiceData(): void {
    forkJoin([
      this._coachingService.get(this.id),
      this._serviceData.getServiceDiscussionId(this.id),
      this._servicesService.getUserReview(this.id),
      this._servicesService.getServiceReviewStats(this.id),
      this._servicesService.getBookingDetails(this.id, this.currentUserId)
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([coaching, discussionId, review, reviewStats, booking]): void => {
        this._serviceData.serviceData = coaching;
        this._serviceData.discussionId = discussionId;
        this._serviceData.serviceReview = review;
        this._serviceData.serviceReviewStats = reviewStats;
        this._serviceData.serviceBooking = booking;
        this.initUserAvailabilities();
        this.initServiceBookings();
      });
  }

  private initUserAvailabilities(): void {
    this._userAvailabilitiesService.getAll(this.serviceOwnerId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(availabilities => {
        this.userAvailabilities = availabilities;
      });
  }

  private initServiceBookings(): void {
    this._servicesService.getAllBookings(this.serviceId, this.serviceOwnerId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(bookings => {
        this.serviceBookings = bookings;
      });
  }
}
