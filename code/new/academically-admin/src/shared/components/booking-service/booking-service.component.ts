import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, ElementRef, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';

import { AppComponentBase } from '@shared/app-component-base';
import {
  CreateServicePurchaseDto,
  ServicePurchaseDto,
  ServicesServiceProxy, ServicesType
} from '@shared/service-proxies/service-proxies';
import { ModalOptions } from '@node_modules/ngx-bootstrap/modal';
import {
  BookingTakenComponent
} from '@shared/components/booking-service/components/booking-taken/booking-taken.component';
import { NgForm } from '@angular/forms';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';

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

@Component({
  selector: 'app-booking-service',
  templateUrl: './booking-service.component.html',
  styleUrls: ['./booking-service.component.less']
})
export class BookingServiceComponent extends AppComponentBase implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @Input() data: any;
  @Output() onPaid = new Subject<ServicePurchaseDto>();

  isSubmitting$ = new BehaviorSubject<boolean>(false);

  step = 1;
  paymentStatus: PaymentStatus = PaymentStatus.Fail;
  defaultPaymentMethod: PaymentMethod = PaymentMethod.CreditCard;
  paymentMethodNames: string[] = ['Credit card', 'Paypal', 'WeChat', 'Alipay'];
  calendarOptions: CalendarOptions;

  readonly PaymentMethod = PaymentMethod;
  readonly PaymentStatus = PaymentStatus;
  constructor(
    injector: Injector,
    private _elRef: ElementRef,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return combineLatest([this.isSubmitting$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
  get coachAvatar(): string { return this.getProfilePictureUrl(this.data?.creatorUser?.profilePictureDocument); }
  get coachName(): string { return this.data?.creatorUser?.fullName; }
  get coachingTitle(): string { return this.data?.name; }
  get serviceId(): string { return this.data?.id; }

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
  }

  onProcessPayment(): void {
    this.step = 3;
    switch (this.defaultPaymentMethod) {
      case PaymentMethod.CreditCard:
        this.paymentStatus = PaymentStatus.Fail;
        break;
      case PaymentMethod.Paypal:
        this.paymentStatus = PaymentStatus.Success;
        this.savePurchase();
        break;
      case PaymentMethod.Alipay:
        break;
      case PaymentMethod.WeChat:
        break;
    }
  }

  private handleDateClick(info: DateClickArg): void {
    const dayGrid = this._elRef.nativeElement.querySelectorAll('.fc-daygrid-day');
    _.each(dayGrid, (day: HTMLDivElement): void => {
      day.classList.remove('active');
    });
    info.dayEl.classList.add('active');
    console.warn(info);
  }

  private dayCellClassNamesCallback(date: any): string {
    const currentDate = moment(date.date).format('YYYY-MM-DD');
    if (moment().isSame(moment(currentDate), 'day')) {
      return 'active';
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
}
