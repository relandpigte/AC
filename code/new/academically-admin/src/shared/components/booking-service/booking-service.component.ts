import * as _ from 'lodash';
import * as moment from 'moment';
import { ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { BookingTakenComponent } from '@shared/components/booking-service/components/booking-taken/booking-taken.component';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { ServiceCardType } from '@shared/models/service-card.model';
import { ChangeTimezoneComponent } from '@shared/components/booking-service/components/change-timezone/change-timezone.component';
import {
  CancelServiceBookingDto, CreateServiceBookingDto, CreateServicePurchaseDto,
  ServiceBookingDto, ServicePurchaseDto, ServicesServiceProxy, ServicesType, TimeZoneDto, TimeZonesServiceProxy,
  UserAvailabilityDto, UserAvailabilitySetting
} from '@shared/service-proxies/service-proxies';

enum PaymentMethod {
  CreditCard,
  Paypal,
  WeChat,
  Alipay
}
enum PaymentStatus {
  Fail,
  Success,
  Reschedule
}

interface SelectedSession {
  morning: moment.Moment[];
  afternoon: moment.Moment[];
  evening: moment.Moment[];
}

@Component({
  selector: 'app-booking-service',
  templateUrl: './booking-service.component.html',
  styleUrls: ['./booking-service.component.less']
})
export class BookingServiceComponent extends AppComponentBase implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('cancellationReasonEl') cancellationReasonEl: any;

  @Input() data: any;
  @Input() title: string;
  @Input() userAvailabilities: UserAvailabilityDto[] = [];
  @Input() coachAvailabilitySettings: UserAvailabilitySetting;
  @Input() serviceBookings: ServiceBookingDto[] = [];
  @Input() rescheduleBooking: ServiceBookingDto;
  @Input() existingBookingId: string;
  @Input() isCancellation = false;
  @Input() isPurchase = false;

  @Output() onPaid = new Subject<ServicePurchaseDto>();
  @Output() onSavedBooking = new Subject<ServiceBookingDto>();
  @Output() onCancelledBooking = new Subject<ServiceBookingDto>();

  isLoadingInfo$ = new BehaviorSubject<boolean>(false);
  isSubmitting$ = new BehaviorSubject<boolean>(false);

  step = 1;
  isStepBack = false;
  paymentStatus: PaymentStatus = PaymentStatus.Fail;
  defaultPaymentMethod: PaymentMethod = PaymentMethod.CreditCard;
  paymentMethodNames: string[] = ['Credit card', 'Paypal', 'WeChat', 'Alipay'];
  calendarOptions: CalendarOptions;

  bookingDateTime: moment.Moment;
  selectedSessions: SelectedSession;
  rescheduleReason: string;

  existingBooking: ServiceBookingDto;
  cancellationReason: string;
  service: any;
  paymentSuccessTitle: string;
  paymentSuccessMessage: string;

  timeZones: TimeZoneDto[] = [];
  userTimeZone: TimeZoneDto;
  coachSchedules: moment.Moment[] = [];

  readonly PaymentMethod = PaymentMethod;
  readonly PaymentStatus = PaymentStatus;
  private readonly rescheduleReasonTextLimit = 150;
  constructor(
    injector: Injector,
    private _elRef: ElementRef,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _timeZonesService: TimeZonesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() {
    return combineLatest([this.isLoadingInfo$, this.isSubmitting$])
      .pipe(switchMap((loaders) => of(loaders.some(l => l))));
  }
  get coachAvatar(): string { return this.data?.creatorUser?.profilePictureUrl ?? this.service?.owner?.avatar?.src; }
  get coachName(): string { return this.data?.creatorUser?.fullName ?? this.service?.owner?.fullName; }
  get coachUserId(): number { return this.data?.creatorUserId; }
  get serviceName(): string { return this.data?.name; }
  get serviceId(): string { return this.data?.id; }
  get serviceOwnerId(): number { return this.data?.creatorUserId; }
  get servicePrice(): string { return this.data?.price ?? 0; }
  get cancellationPrice(): number { return 0; }
  get isBookingCancelled(): boolean { return !!this.data?.cancellationTime; }
  get bookingSchedule(): string {
    const bookingDate = this.bookingDateTime;
    return `${bookingDate.clone().format('HH:mm a')} - ${bookingDate.clone().add(30, 'minutes').format('HH:mm a')}, ${bookingDate.format('dddd, MMMM DD, YYYY')}`;
  }
  get existingBookingSchedule(): string {
    const bookingDate = this.existingBooking?.bookingDateTime;
    return `${moment(bookingDate).format('HH:mm a')} - ${moment(bookingDate).add(30, 'minutes').format('HH:mm a')}, ${moment(bookingDate).format('dddd, MMMM DD, YYYY')}`;
  }

  get totalSteps(): number {
    if (this.isCancellation) {
      return 1;
    }
    return 2;
  }
  get isValidFirstStep(): boolean {
    if (!_.isEmpty(this.rescheduleBooking) && !_.isEmpty(this.userTimezoneName)) {
      const bookingDateTime = this.rescheduleBooking.bookingDateTime.tz(this.userTimezoneName);
      return !bookingDateTime.isSame(this.bookingDateTime);
    }
    return !!this.bookingDateTime;
  }

  get cancellationReasonValue(): string { return this.cancellationReasonEl?.nativeElement?.innerHTML?.trim(); }
  get cancellationReasonLength(): number { return this.cancellationReasonValue?.length || 0; }
  get stepOne(): boolean { return this.step === 1 && !this.isCancellation; }
  get canStepBack(): boolean { return this.totalSteps > 1 && this.step > 1; }
  get stepOneCancellation(): boolean { return this.step === 1 && this.isCancellation; }
  get step2Reschedule(): boolean { return this.step === 2 && !_.isEmpty(this.rescheduleBooking) && !this.isCancellation; }
  get step2Paypal(): boolean {
    return this.step === 2 && this.defaultPaymentMethod === PaymentMethod.Paypal && _.isEmpty(this.rescheduleBooking);
  }
  get step2CC(): boolean {
    return this.step === 2 && this.defaultPaymentMethod === PaymentMethod.CreditCard && _.isEmpty(this.rescheduleBooking);
  }
  get rescheduleReasonLimit(): string { return `${this.rescheduleReason?.length ?? 0}/${this.rescheduleReasonTextLimit}`; }
  get isMorningSessionAvailable(): boolean { return !_.isEmpty(this.selectedSessions?.morning); }
  get isAfternoonSessionAvailable(): boolean { return !_.isEmpty(this.selectedSessions?.afternoon); }
  get isEveningSessionAvailable(): boolean { return !_.isEmpty(this.selectedSessions?.evening); }
  get isScheduleAvailable(): boolean {
    return this.isMorningSessionAvailable || this.isAfternoonSessionAvailable || this.isEveningSessionAvailable;
  }
  get serviceType(): ServiceCardType { return this.service?.type; }
  get isServiceFree(): boolean { return Number(this.servicePrice) === 0; }

  get maxBookingPerDay(): number {
    const { isMaximumBookingPerDay, maximumBookingPerDay } = this.coachAvailabilitySettings || {};
    return isMaximumBookingPerDay ? maximumBookingPerDay : 0;
  }

  get currentUserTimeZoneName(): string {
    const tz = this.userTimeZone?.name.match(/\(([^()]+)\)/g);
    return _.isEmpty(tz) ? null : `${tz[0]} ${this.userTimezoneName.replace('_', ' ')}`;
  }
  get userTimezoneName(): string { return this.userTimeZone?.ianaName; }

  ngOnInit(): void {
    this.retrieveBookingToCancel();
    this.initPurchase();
    this.initService();
    this.initBookingData();
  }

  onCloseModal(): void {
    this._modal.hide();
  }

  onScheduleTaken(title: string): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingTakenComponent>;
    modalSettings.initialState = { title };
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking-taken';
    this._modalService.show(BookingTakenComponent, modalSettings);
  }

  onSteps(nextStep: number): void {
    this.step = nextStep;
    this._cdr.detectChanges();
  }

  onStepBack(step: number): void {
    if (step === 1) {
      return;
    }
    this.step = step - 1;
    this.isStepBack = true;
    this._cdr.detectChanges();
  }

  onProcessCancellation(): void {
    this.isSubmitting$.next(true);

    this._servicesService.cancelBooking(CancelServiceBookingDto.fromJS({
      id: this.data?.serviceBooking?.id,
      referenceId: this.data.id,
      cancellationReason: this.cancellationReasonValue,
      cancellationTime: moment(),
      userCancelled: this.currentUserId
      }))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((x): void => {
        this.data = { ...this.data, ...x };
        this.step = 3; // force footer to hide
        this.onCancelledBooking.next(x);
        this.isSubmitting$.next(false);
      });
    this._cdr.detectChanges();
  }

  timeSelectionClass(date: moment.Moment): boolean {
    return this.bookingDateTime?.format('YYYY-MM-DD HH:mm') === date.format('YYYY-MM-DD HH:mm');
  }

  isCurrentBookingTime(date: moment.Moment): boolean {
    const bookingDate = this.rescheduleBooking?.bookingDateTime?.tz(this.userTimezoneName);
    return bookingDate?.format('YYYY-MM-DD HH:mm') === date.format('YYYY-MM-DD HH:mm');
  }

  onProcessReschedule(): void {
    this.onSteps(3);
    this.paymentStatus = PaymentStatus.Reschedule;
    this.saveBooking();
  }

  onProcessPayment(): void {
    this.onSteps(3);
    this.initPaymentSuccessMessages();
    if (this.isServiceFree) {
      this.savePurchase();
      if (!this.isPurchase) {
        this.saveBooking();
      }
      this.paymentStatus = PaymentStatus.Success;
      return;
    }
    switch (this.defaultPaymentMethod) {
      case PaymentMethod.CreditCard:
        this.paymentStatus = PaymentStatus.Fail;
        break;
      case PaymentMethod.Paypal:
        this.paymentStatus = PaymentStatus.Success;
        this.savePurchase();
        if (!this.isPurchase) {
          this.saveBooking();
        }
        break;
      case PaymentMethod.Alipay:
        break;
      case PaymentMethod.WeChat:
        break;
    }
  }

  onSelectTime(date: moment.Moment): void {
    this.bookingDateTime = date;

    const bookingsToday = this.serviceBookings.filter(x => x.bookingDateTime.tz(this.userTimezoneName).isSame(date, 'date'));
    if (this.maxBookingPerDay && bookingsToday.length >= this.maxBookingPerDay) {
      this.onScheduleTaken('BookingDateFull');
      this.bookingDateTime = null;
      return;
    }
  }

  formatScheduleToTime(date: moment.Moment): string {
    return date.format('HH:mm');
  }

  onChangeTimeZone(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChangeTimezoneComponent>;
    modalSettings.backdrop = true;
    modalSettings.ignoreBackdropClick = false;
    modalSettings.keyboard = true;
    modalSettings.initialState = { timeZones: this.timeZones, userTimeZone: this.userTimeZone };
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-timezone';
    const modal = this._modalService.show(ChangeTimezoneComponent, modalSettings);

    modal.content.onTimezoneUpdated.subscribe((timezone: TimeZoneDto): void => {
      this.userTimeZone = timezone;
      moment.tz.setDefault(this.userTimezoneName);
      this.initBookingData();

      const activeDate = this._elRef.nativeElement.querySelector('.fc-daygrid-day.active');
      activeDate?.classList?.remove('active');
      if (_.isEmpty(this.rescheduleBooking)) {
        const todayDate = this._elRef.nativeElement.querySelector('.fc-daygrid-day.today');
        todayDate?.classList?.add('active');
      } else {
        const todayDate = this._elRef.nativeElement.querySelector('.fc-daygrid-day.reschedule-events');
        todayDate?.classList?.add('active');
      }
      this._cdr.detectChanges();
    });
  }

  async gotoSchedule(): Promise<void> {
    this.onCloseModal();
    await this._router.navigate(['app/calendar']);
  }

  private initCalendar(): void {
    if (this.isPurchase || this.isCancellation) {
      return;
    }
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      height: 'auto',
      themeSystem: 'bootstrap',
      headerToolbar: {
        left: 'title',
        center: '',
        right: 'prev,next'
      },
      timeZone: this.userTimezoneName,
      dateClick: this.handleDateClick.bind(this),
      dayCellClassNames: this.dayCellClassNamesCallback.bind(this),
      showNonCurrentDates: false,
    };
    this._cdr.detectChanges();
  }

  private dayCellClassNamesCallback(info: any): string {
    const classList = [];
    const now = moment.tz(this.userTimezoneName);
    const current = moment(info.date);
    const reschedule = this.rescheduleBooking?.bookingDateTime;
    const schedules = this.coachSchedules.filter(x => moment(x).isSame(moment(info.date), 'date'));

    if (!_.isEmpty(this.rescheduleBooking) && reschedule?.isSame(moment(info.date), 'date')) {
      this.getAvailableSessions(schedules);
      this.bookingDateTime = reschedule;
      classList.push('active reschedule-events');
    } else if (_.isEmpty(this.rescheduleBooking) && current.clone().isSame(now, 'date')) {
      this.getAvailableSessions(schedules);
      classList.push('today active');
    } else if (!_.isEmpty(schedules)) {
      classList.push('with-events');
    } else {
      if (_.isEmpty(schedules) && current.clone().isSame(now, 'date')) {
        classList.push('today');
      }
    }
    return classList.join(' ');
  }

  private handleDateClick(info: DateClickArg): void {
    if (_.isEmpty(this.rescheduleBooking)) {
      this.bookingDateTime = null;
    } else {
      this.bookingDateTime = this.rescheduleBooking.bookingDateTime;
    }
    const schedules = this.coachSchedules.filter(x => moment(x).isSame(moment(info.date), 'date'));
    this.getAvailableSessions(schedules);
    this.resetActiveDate(info);
  }

  private getAvailableSessions(schedules: moment.Moment[]): void {
    this.selectedSessions = { afternoon: [], evening: [], morning: [] };
    const now = moment.tz(this.userTimezoneName);

    schedules.forEach(s => {
      const customBreaks = this.userAvailabilities.filter(x => !x.isAvailable && moment(x.specificDate).isSame(s, 'date'));
      const defaultBreaks = this.userAvailabilities.filter(x => x.dayOfWeek === s.day() && !x.isAvailable);
      const breaks = _.isEmpty(customBreaks) ? defaultBreaks : customBreaks;

      if (now.isAfter(s) || this.isSessionBreakTime(breaks, s)) {
        return;
      }

      if (s.hour() >= 0 && s.hour() < 12) {
        this.selectedSessions.morning.push(s);
      } else if (s.hour() >= 12 && s.hour() < 16) {
        this.selectedSessions.afternoon.push(s);
      } else if (s.hour() >= 16 && s.hour() < 23) {
        this.selectedSessions.evening.push(s);
      }
    });
  }

  private isSessionBreakTime(breaks: UserAvailabilityDto[], date: moment.Moment): boolean {
    const strDate = date.format('YYYY-MM-DD');
    const breakTime = breaks.filter(b => {
      const bStart = moment(`${strDate} ${b.startTime}`).tz(this.userTimezoneName);
      const bEnd = moment(`${strDate} ${b.endTime}`).tz(this.userTimezoneName);
      return date.isAfter(bStart) && date.isBefore(bEnd);
    });
    return !_.isEmpty(breakTime);
  }

  private resetActiveDate(info: DateClickArg): void {
    const dayGrid = this._elRef.nativeElement.querySelectorAll('.fc-daygrid-day');
    _.each(dayGrid, (day: HTMLDivElement): void => {
      day.classList.remove('active');
    });
    info.dayEl.classList.add('active');
  }

  private savePurchase(): void {
    this.isSubmitting$.next(true);
    this._servicesService.savePurchase(CreateServicePurchaseDto.fromJS({
      referenceId: this.serviceId,
      creatorUserId: this.currentUserId,
      ownerId: this.data?.creatorUser?.id,
      type: ServicesType[ServiceCardUtils.getServiceType(this.data)]
    }))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(x => {
        this.onPaid.next(x);
        this.isSubmitting$.next(false);
      });
  }

  private saveBooking(): void {
    this.isSubmitting$.next(true);
    let booking = new CreateServiceBookingDto();
    if (!_.isEmpty(this.rescheduleBooking)) {
      booking.init(this.rescheduleBooking);
      booking.oldBookingDateTime = this.data?.serviceBooking?.bookingDateTime;
      booking.bookingDateTime = this.bookingDateTime;
      booking.creatorUserId = this.currentUserId;
      booking.rescheduleReason = this.rescheduleReason;
    } else {
      booking = CreateServiceBookingDto.fromJS({
        bookingDateTime: this.bookingDateTime,
        ownerId: this.coachUserId,
        type: ServicesType.Coaching,
        referenceId: this.serviceId
      });
    }
    this._servicesService.saveBooking(booking)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((x): void => {
        this.onSavedBooking.next(x);
        this.isSubmitting$.next(false);
      });
  }

  private retrieveBookingToCancel(): void {
    if (!this.isCancellation) {
      return;
    }
    this.isLoadingInfo$.next(true);
    this._servicesService.getBookingByReferenceId(this.data.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(existingBooking => {
        this.existingBooking = existingBooking;
        this.isLoadingInfo$.next(false);
      });
  }

  private initPurchase(): void {
    if (!this.isPurchase) {
      return;
    }
    this.step = 2;
  }

  private initService(): void {
    if (!_.isEmpty(this.data?.serviceBooking) && this.isTutor && this.serviceOwnerId === this.currentUserId) {
      this.data.creatorUser = this.data?.serviceBooking?.creatorUser;
    }
    const { service } = ServiceCardUtils.getSanitizeServiceData(this.data, {}, [], false);
    this.service = service;
  }

  private initPaymentSuccessMessages(): void {
    switch (this.serviceType) {
      case 'coaching':
        this.paymentSuccessTitle = this.l('BookingSuccessful');
        this.paymentSuccessMessage = this.l('SessionAddedToSchedule');
        break;
      case 'course':
        this.paymentSuccessTitle = 'Purchase successful';
        this.paymentSuccessMessage = 'The course has been added to your dashboard';
        break;
      case 'article':
        this.paymentSuccessTitle = 'Purchase successful';
        this.paymentSuccessMessage = 'The article has been added to your dashboard';
        break;
      case 'workshop':
        this.paymentSuccessTitle = 'Purchase successful';
        this.paymentSuccessMessage = 'The workshop has been added to your dashboard';
        break;
      case 'broadcast':
        this.paymentSuccessTitle = 'Purchase successful';
        this.paymentSuccessMessage = 'The broadcast has been added to your dashboard';
        break;
      case 'tutorial':
        this.paymentSuccessTitle = 'Purchase successful';
        this.paymentSuccessMessage = 'The tutorial has been added to your dashboard';
        break;
    }
  }

  private initBookingData(): void {
    const now = moment.tz(this.userTimezoneName);
    forkJoin([
      this._timeZonesService.getAll(),
      this._timeZonesService.getByUser(this.currentUserId),
      this._servicesService.getCoachingSchedules(this.serviceOwnerId, this.serviceId, now.year(), now.month() + 1)
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([timeZones, userTimezone, schedules]): void => {
        this.timeZones = timeZones;
        this.userTimeZone = userTimezone;
        this.coachSchedules = schedules;
        this.initCalendar();
        this._cdr.detectChanges();
      });
  }
}
