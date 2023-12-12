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
import {
  AvailabilityUnit,
  CancelServiceBookingDto, CreateServiceBookingDto, CreateServicePurchaseDto, ServiceBookingDto, ServicePurchaseDto,
  ServicesServiceProxy, ServicesType, UserAvailabilitiesServiceProxy, UserAvailabilityDto, UserAvailabilitySetting
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
  morning: string[];
  afternoon: string[];
  evening: string[];
}

interface SelectedSchedule {
  availability: UserAvailabilityDto;
  startTime: string;
  endTime: string;
  breaks: {
    availability: UserAvailabilityDto,
      startTime: string,
      endTime: string
  }[];
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
  paymentStatus: PaymentStatus = PaymentStatus.Fail;
  defaultPaymentMethod: PaymentMethod = PaymentMethod.CreditCard;
  paymentMethodNames: string[] = ['Credit card', 'Paypal', 'WeChat', 'Alipay'];
  calendarOptions: CalendarOptions;

  selectedSchedule: SelectedSchedule;
  selectedSessions: SelectedSession;
  selectedDate: string;
  selectedTime: string;
  rescheduleReason: string;

  existingBooking: ServiceBookingDto;
  cancellationReason: string;
  service: any;
  paymentSuccessTitle: string;
  paymentSuccessMessage: string;

  readonly PaymentMethod = PaymentMethod;
  readonly PaymentStatus = PaymentStatus;
  private readonly rescheduleReasonTextLimit = 150;
  constructor(
    injector: Injector,
    private _elRef: ElementRef,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy,
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
    private _crd: ChangeDetectorRef,
    private _router: Router
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest([this.isLoadingInfo$, this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get coachAvatar(): string { return this.getProfilePictureUrl(this.data?.creatorUser?.profilePictureDocument); }
  get coachName(): string { return this.data?.creatorUser?.fullName; }
  get coachFirstName(): string { return this.data?.creatorUser?.firstName; }
  get coachUserId(): number { return this.data?.creatorUserId; }
  get serviceName(): string { return this.data?.name; }
  get serviceId(): string { return this.data?.id; }
  get serviceOwnerId(): number { return this.data?.creatorUserId; }
  get servicePrice(): string { return this.data?.price ?? 0; }
  get cancellationPrice(): number { return 0; }
  get isBookingCancelled(): boolean { return !!this.data?.cancellationTime; }
  get bookingSchedule(): string {
    const bookingDate = moment(`${this.selectedDate} ${this.selectedTime}`);
    return `${moment(bookingDate).format('HH:mm a')} - ${moment(bookingDate).add(30, 'minutes').format('HH:mm a')}, ${moment(bookingDate).format('dddd, MMMM DD, YYYY')}`;
  }
  get existingBookingSchedule(): string {
    const bookingDate = this.existingBooking?.bookingDateTime;
    return `${moment(bookingDate).format('HH:mm a')} - ${moment(bookingDate).add(30, 'minutes').format('HH:mm a')}, ${moment(bookingDate).format('dddd, MMMM DD, YYYY')}`;
  }
  get bookingDates(): string[] { return this.serviceBookings?.map(e => e.bookingDateTime)?.map(d => moment(d).format('YYYY-MM-DD')); }

  get totalSteps(): number {
    if (this.isCancellation) {
      return 1;
    }
    return 2;
  }
  get isValidFirstStep(): boolean {
    const { bookingDateTime } = this.rescheduleBooking || {};
    const currentTime = bookingDateTime?.format('HH:mm');
    if (_.isEmpty(this.rescheduleBooking)) {
      return !!this.selectedTime && !!this.selectedDate;
    } else {
      return !!this.selectedTime && !!this.selectedDate && (currentTime !== this.selectedTime ||
        !moment(bookingDateTime).isSame(moment(this.selectedDate), 'date'));
    }
  }

  get cancellationReasonValue(): string { return this.cancellationReasonEl?.nativeElement?.innerHTML?.trim(); }
  get cancellationReasonLength(): number { return this.cancellationReasonValue?.length || 0; }
  get stepOne(): boolean { return this.step === 1 && !this.isCancellation; }
  get stepOneCancellation(): boolean { return this.step === 1 && this.isCancellation; }
  get step2Reschedule(): boolean { return this.step === 2 && !_.isEmpty(this.rescheduleBooking) && !this.isCancellation; }
  get step2Paypal(): boolean { return this.step === 2 && this.defaultPaymentMethod === PaymentMethod.Paypal && _.isEmpty(this.rescheduleBooking); }
  get step2CC(): boolean { return this.step === 2 && this.defaultPaymentMethod === PaymentMethod.CreditCard && _.isEmpty(this.rescheduleBooking); }
  get rescheduleReasonLimit(): string { return `${this.rescheduleReason?.length ?? 0}/${this.rescheduleReasonTextLimit}`; }
  get isMorningSessionAvailable(): boolean { return !_.isEmpty(this.selectedSessions?.morning); }
  get isAfternoonSessionAvailable(): boolean { return !_.isEmpty(this.selectedSessions?.afternoon); }
  get isEveningSessionAvailable(): boolean { return !_.isEmpty(this.selectedSessions?.evening); }
  get serviceType(): ServiceCardType { return this.service?.type; }
  get isServiceFree(): boolean { return Number(this.servicePrice) === 0; }

  get maxBookingPerDay(): number {
    const { isMaximumBookingPerDay, maximumBookingPerDay } = this.coachAvailabilitySettings || {};
    return isMaximumBookingPerDay ? maximumBookingPerDay : 0;
  }
  get minimumBookingNotice(): string {
    const { isMinimumBookingNotice, minimumBookingNotice, minimumBookingNoticeUnit } = this.coachAvailabilitySettings || {};
    if (!isMinimumBookingNotice || !minimumBookingNoticeUnit) {
      return null;
    }
    return this.getDateBy(minimumBookingNoticeUnit, minimumBookingNotice);
  }
  get maximumAdvanceNotice(): string {
    const { isMaximumAdvanceNotice, maximumAdvanceNotice, maximumAdvanceNoticeUnit } = this.coachAvailabilitySettings || {};
    if (!isMaximumAdvanceNotice || !maximumAdvanceNoticeUnit) {
      return null;
    }
    return this.getDateBy(maximumAdvanceNoticeUnit, maximumAdvanceNotice);
  }

  ngOnInit(): void {
    this.initCalendar();
    this.retrieveBookingToCancel();
    this.initPurchase();
    this.initService();
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
    this._crd.detectChanges();
  }

  onProcessCancellation(): void {
    this.isSubmitting$.next(true);

    this._servicesService.cancelBooking(CancelServiceBookingDto.fromJS({
        referenceId: this.data.id,
        cancellationReason: this.cancellationReasonValue,
        cancellationTime: moment()
      }))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((x): void => {
        this.data = { ...this.data, ...x };
        this.step = 3; // force footer to hide
        this.onCancelledBooking.next(x);
        this.isSubmitting$.next(false);
      });
  }

  timeSelectionClass(time: string): string {
    return (this.selectedTime === time) ? 'active' : '';
  }

  isCurrentBookingTime(time: string): boolean {
    const { bookingDateTime } = this.rescheduleBooking || {};
    const currentTime = bookingDateTime?.format('HH:mm');
    return currentTime === time && moment(bookingDateTime).isSame(moment(`${this.selectedDate} ${this.selectedTime}`), 'date');
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

  onSelectTime(time: string): void {
    // TODO: do the checking here for slot availability
    // If not available call onScheduleTaken()
    // Else set the selected time
    this.selectedTime = time;

    const bookingDate = moment(`${this.selectedDate} ${this.selectedTime}:00`);
    const isTaken = this.serviceBookings?.filter(x => moment(x.bookingDateTime).isSame(bookingDate));
    const totalBookingsToday = this.serviceBookings?.filter(x => moment(x.bookingDateTime).isSame(moment(bookingDate), 'day')) ?? [];
    if (this.maxBookingPerDay && totalBookingsToday.length >= this.maxBookingPerDay) {
      this.onScheduleTaken('BookingDateFull');
      this.selectedTime = null;
      return;
    }
    if (!_.isEmpty(isTaken)) {
      this.onScheduleTaken('TimeSlotUnavailable');
      this.selectedTime = null;
      return;
    }

    const minimumBookingDate = moment(this.minimumBookingNotice);
    if (minimumBookingDate.isValid() && bookingDate.isBefore(minimumBookingDate)) {
      this.onScheduleTaken('TimeSlotUnavailable');
      this.selectedTime = null;
      return;
    }

    const maximumBookingDate = moment(this.maximumAdvanceNotice);
    if (maximumBookingDate.isValid() && bookingDate.isAfter(maximumBookingDate)) {
      this.onScheduleTaken('TimeSlotUnavailable');
      this.selectedTime = null;
      return;
    }
  }

  async gotoSchedule(): Promise<void> {
    this.onCloseModal();
    await this._router.navigate(['app/calendar']);
  }

  private handleDateClick(info: DateClickArg): void {
    if (moment(info.date).isBefore(moment(), 'date')) {
      this.selectedSchedule = null;
      return;
    }
    const dayGrid = this._elRef.nativeElement.querySelectorAll('.fc-daygrid-day');
    _.each(dayGrid, (day: HTMLDivElement): void => {
      day.classList.remove('active');
    });
    info.dayEl.classList.add('active');
    this.initAvailabilitySchedule(info.date);

  }

  private dayCellClassNamesCallback(info: any): string {
    const currentDate = moment(info.date).format('YYYY-MM-DD');
    if (this.rescheduleBooking) {
      const { bookingDateTime } = this.rescheduleBooking || {};
      this.selectedTime = bookingDateTime?.format('HH:mm');
      if (moment(bookingDateTime).isSame(moment(currentDate), 'day')) {
        this.initAvailabilitySchedule(new Date(bookingDateTime?.toString()));
        return this.bookingDates.includes(currentDate) ? 'active with-events' : 'active';
      }
    } else {
      if (moment().isSame(moment(currentDate), 'day')) {
        this.initAvailabilitySchedule(info.date);
        return this.bookingDates.includes(currentDate) ? 'active with-events' : 'active';
      }
    }
    if (this.bookingDates.includes(currentDate)) {
      return 'with-events';
    }
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
      timeZone: moment.tz.guess(),
      dateClick: this.handleDateClick.bind(this),
      dayCellClassNames: this.dayCellClassNamesCallback.bind(this)
    };

    setTimeout((): void => {
      this.calendarComponent.getApi().render();
    }, 200);
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
      booking.bookingDateTime = moment(`${this.selectedDate} ${this.selectedTime}`);
      booking.creatorUserId = this.currentUserId;
      booking.rescheduleReason = this.rescheduleReason;
    } else {
      booking = CreateServiceBookingDto.fromJS({
        bookingDateTime: moment(`${this.selectedDate} ${this.selectedTime}`),
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

  private initAvailabilitySchedule(date: Date): void {
    let selectedSchedules = _.filter(this.userAvailabilities, x => x.dayOfWeek === moment(date).day());
    this.selectedDate = moment(date).format('YYYY-MM-DD');
    this.selectedTime = null;
    if (!_.isEmpty(this.bookingSchedule)) {
      const { bookingDateTime } = this.rescheduleBooking || {};
      if (moment(bookingDateTime).isSame(moment(this.selectedDate), 'date')) {
        this.selectedTime = bookingDateTime?.format('HH:mm');
      }
    }
    const selectedCustomSchedules = _.filter(
      this.userAvailabilities,
      x => x.specificDate && x.specificDate.isSame(moment(date), 'date')
    );
    if (!_.isEmpty(selectedCustomSchedules)) {
      selectedSchedules = selectedCustomSchedules;
    }

    const selectedSchedule = _.minBy(selectedSchedules, 'startTime');
    const breaks = _.filter(selectedSchedules, x => x.id !== selectedSchedule.id);
    if (!selectedSchedule?.isAvailable) {
      this.selectedSchedule = null;
      return;
    }
    this.selectedSchedule = {
      availability: selectedSchedule,
      startTime: `${this.selectedDate} ${selectedSchedule.startTime}:00`,
      endTime: `${this.selectedDate} ${selectedSchedule.endTime}:00`,
      breaks: _.map(breaks, b => {
        return {
          availability: b,
          startTime: `${this.selectedDate} ${b.startTime}:00`,
          endTime: `${this.selectedDate} ${b.endTime}:00`,
        };
      })
    };
    this.initAvailabilitySessions();
  }

  private async initAvailabilitySessions(): Promise<void> {
    if (_.isEmpty(this.userAvailabilities)) {
      return;
    }
    const bookingInterval = this.getBookingIntervals(this.coachAvailabilitySettings);
    const { startTime, endTime } = this.selectedSchedule;
    const start = new Date(startTime);
    const end = new Date(endTime);

    let loop = new Date(start);
    this.selectedSessions = { afternoon: [], evening: [], morning: [] };
    while (loop <= end) {
      if (this.isSessionBreak(loop, this.selectedSchedule)) {
        loop = new Date(loop.setMinutes(loop.getMinutes() + bookingInterval));
        continue;
      }
      const loopTime = `${loop.getHours().toString().padStart(2, '0')}:${loop.getMinutes().toString().padStart(2, '0')}`;
      const loopHour = loop.getHours();
      if (loopHour >= 0 && loopHour < 12) {
        this.selectedSessions.morning.push(loopTime);
      } else if (loopHour >= 12 && loopHour < 16) {
        this.selectedSessions.afternoon.push(loopTime);
      } else if (loopHour >= 16 && loopHour < 23) {
        this.selectedSessions.evening.push(loopTime);
      }
      loop = new Date(loop.setMinutes(loop.getMinutes() + bookingInterval));
    }
  }

  private getBookingIntervals(settings: UserAvailabilitySetting): number {
    const paddingBefore = settings?.isPaddingBeforeBooking ? settings?.paddingBeforeBooking : 0;
    const paddingAfter = settings?.isPaddingAfterBooking ? settings?.paddingAfterBooking : 0;
    return (settings?.bookingIntervals + paddingBefore + paddingAfter) ?? 30;
  }

  private isSessionBreak(date: Date, schedule: SelectedSchedule): boolean {
    if (_.isEmpty(schedule.breaks)) {
      return false;
    }
    const currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    const breakTime = schedule.breaks.filter(b => {
      const breakStart = moment(b.startTime).format('HH:mm');
      const breakEnd = moment(b.endTime).format('HH:mm');
      return currentTime >= breakStart && currentTime <= breakEnd;
    });
    return !_.isEmpty(breakTime);
  }

  private initServiceOwnerDetails(): void {
    let calls = [];
    if (this.userAvailabilities?.length)
      calls.push(of([]));
    else
      calls.push(this._userAvailabilitiesService.getAll(this.data.creatorUserId));


    if (this.serviceBookings?.length)
      calls.push(of([]));
    else
      calls.push(this._servicesService.getAllBookings(this.data.id, this.data.creatorUserId));

    forkJoin(calls)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([availabilities, bookings]) => {
        this.userAvailabilities = availabilities as UserAvailabilityDto[];
        this.serviceBookings = bookings as ServiceBookingDto[];
      });
  }

  private retrieveBookingToCancel(): void {
    if (!this.isCancellation) return;
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

  private getDateBy(unit: AvailabilityUnit, addValue: number): string {
    switch (unit) {
      case 1:
        return moment().add(addValue, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      case 2:
        return moment().add(addValue, 'hours').format('YYYY-MM-DD HH:mm:ss');
      case 3:
        return moment().add(addValue, 'days').format('YYYY-MM-DD HH:mm:ss');
    }
  }
}
