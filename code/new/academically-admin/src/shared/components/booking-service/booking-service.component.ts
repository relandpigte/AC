import * as _ from 'lodash';
import * as moment from 'moment';
import { ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';

import { AppComponentBase } from '@shared/app-component-base';
import { BookingTakenComponent } from '@shared/components/booking-service/components/booking-taken/booking-taken.component';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import {
  CreateServiceBookingDto, CreateServicePurchaseDto, ServiceBookingDto, ServicePurchaseDto,
  ServicesServiceProxy, ServicesType, UserAvailabilityDto
} from '@shared/service-proxies/service-proxies';

enum PaymentMethod {
  CreditCard,
  Paypal,
  WeChat,
  Alipay
}
enum PaymentStatus {
  Fail,
  Success
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
  @Input() data: any;
  @Input() userAvailabilities: UserAvailabilityDto[] = [];
  @Input() serviceBookings: ServiceBookingDto[] = [];
  @Output() onPaid = new Subject<ServicePurchaseDto>();
  @Output() onSavedBooking = new Subject<ServiceBookingDto>();

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

  readonly PaymentMethod = PaymentMethod;
  readonly PaymentStatus = PaymentStatus;
  constructor(
    injector: Injector,
    private _elRef: ElementRef,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy,
    private _crd: ChangeDetectorRef
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest([this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get coachAvatar(): string { return this.getProfilePictureUrl(this.data?.creatorUser?.profilePictureDocument); }
  get coachName(): string { return this.data?.creatorUser?.fullName; }
  get coachUserId(): number { return this.data?.creatorUserId; }
  get coachingTitle(): string { return this.data?.name; }
  get serviceId(): string { return this.data?.id; }
  get servicePrice(): string { return this.data?.price; }
  get isValidFirstStep(): boolean { return !!this.selectedTime && !!this.selectedDate; }
  get bookingSchedule(): string {
    const bookingDate = moment(`${this.selectedDate} ${this.selectedTime}`);
    return `${moment(bookingDate).format('HH:mm a')} - ${moment(bookingDate).add(30, 'minutes').format('HH:mm a')}, ${moment(bookingDate).format('dddd, MMMM DD, YYYY')}`;
  }
  get bookingDates(): string[] { return this.serviceBookings?.map(e => e.bookingDateTime)?.map(d => moment(d).format('YYYY-MM-DD')); }

  ngOnInit(): void {
    this.initCalendar();
  }

  onCloseModal(): void {
    this._modal.hide();
  }

  onScheduleTaken(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingTakenComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking-taken';
    this._modalService.show(BookingTakenComponent, modalSettings);
  }

  onSteps(nextStep: number): void {
    this.step = nextStep;
    this._crd.detectChanges();
  }

  onProcessPayment(): void {
    this.onSteps(3);
    switch (this.defaultPaymentMethod) {
      case PaymentMethod.CreditCard:
        this.paymentStatus = PaymentStatus.Fail;
        break;
      case PaymentMethod.Paypal:
        this.paymentStatus = PaymentStatus.Success;
        this.savePurchase();
        this.saveBooking();
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
  }

  private handleDateClick(info: DateClickArg): void {
    const dayGrid = this._elRef.nativeElement.querySelectorAll('.fc-daygrid-day');
    _.each(dayGrid, (day: HTMLDivElement): void => {
      day.classList.remove('active');
    });
    info.dayEl.classList.add('active');
    this.initAvailabilitySchedule(info.date);
  }

  private dayCellClassNamesCallback(info: any): string {
    const currentDate = moment(info.date).format('YYYY-MM-DD');
    if (moment().isSame(moment(currentDate), 'day')) {
      this.initAvailabilitySchedule(info.date);
      return this.bookingDates.includes(currentDate) ? 'active with-events' : 'active';
    }
    if (this.bookingDates.includes(currentDate)) {
      return 'with-events';
    }
  }

  private initCalendar(): void {
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
    const booking = CreateServiceBookingDto.fromJS({
      bookingDateTime: moment(`${this.selectedDate} ${this.selectedTime}`).format('YYYY-MM-DD HH:mm:ss'),
      ownerId: this.coachUserId,
      type: ServicesType.Coaching,
      referenceId: this.serviceId
    });
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
    const selectedCustomSchedules = _.filter(
      this.userAvailabilities,
      x => x.specificDate && x.specificDate.isSame(moment(date), 'date')
    );
    if (!_.isEmpty(selectedCustomSchedules)) {
      selectedSchedules = selectedCustomSchedules;
    }

    const selectedSchedule = _.minBy(selectedSchedules, 'startTime');
    const breaks = _.filter(selectedSchedules, x => x.id !== selectedSchedule.id);
    if (!selectedSchedule.isAvailable) {
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

  private initAvailabilitySessions(): void {
    if (_.isEmpty(this.userAvailabilities)) {
      return;
    }
    const { startTime, endTime } = this.selectedSchedule;
    const start = new Date(startTime);
    const end = new Date(endTime);

    let loop = new Date(start);
    this.selectedSessions = { afternoon: [], evening: [], morning: [] };
    while (loop <= end) {
      if (this.isSessionBreak(loop, this.selectedSchedule)) {
        loop = new Date(loop.setMinutes(loop.getMinutes() + 30));
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
      loop = new Date(loop.setMinutes(loop.getMinutes() + 30));
    }
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
}
