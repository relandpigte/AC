import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventRecurrence, CalendarEventsServiceProxy, CalendarEventType, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CreateEditBlockOutComponent } from './_components/create-edit-block-out/create-edit-block-out.component';
import { CreateEditBookingComponent } from './_components/create-edit-booking/create-edit-booking.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less'],
  animations: [appModuleAnimation()],
})
export class CalendarComponent extends AppComponentBase implements OnInit {
  user: UserDto = new UserDto();
  userId: number;
  startTime: Date;
  endTime: Date;
  isLoading = false;
  isBlockOutClicked = false;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    allDaySlot: false,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: true,
    },
    datesSet: this.dateSet.bind(this),
    dateClick: this.dateClicked.bind(this),
    eventClick: this.eventClick.bind(this),
  };

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _calendarEventsService: CalendarEventsServiceProxy,
    private _usersService: UserServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.has('user-id') ? +paramMap.get('user-id') : this.appSession.userId;
      this.getUser();
    });
  }

  private dateSet(args: DateSelectArg): void {
    this.startTime = args.start;
    this.endTime = args.end;
    setTimeout(() => {
      this.getEvents();
    });
  }

  private dateClicked(args: DateClickArg): void {
    const model = new CalendarEventDto();
    model.startTime = moment(args.date);
    model.endTime = moment(args.date);
    if (!this.isBlockOutClicked && this.permission.isGranted('Pages.Calendar.BlockOuts')) {
      this.showCreateEditBlockOutModal(model);
    } else if (!this.isBlockOutClicked && !this.isTutor && this.permission.isGranted('Pages.Calendar.Bookings')) {
      this.showCreateEditBookingModal(model);
    }
    this.isBlockOutClicked = false;
  }

  private eventClick(args: EventClickArg): void {
    const calendarEvent = args.event.extendedProps.calendarEvent as CalendarEventDto;
    switch (calendarEvent.type) {
      case CalendarEventType.Blocker:
        this.isBlockOutClicked = true;
        if (this.permission.isGranted('Pages.Calendar.BlockOuts')) {
          this.showCreateEditBlockOutModal(_.cloneDeep((args.event.extendedProps.calendarEvent as CalendarEventDto)));
        }
        break;
      case CalendarEventType.BookingRequest:
        if ((calendarEvent.creatorUserId === this.appSession.userId || this.userId === this.appSession.userId)
          && this.permission.isGranted('Pages.Calendar.Bookings')) {
          this.showCreateEditBookingModal(_.cloneDeep((args.event.extendedProps.calendarEvent as CalendarEventDto)));
        } else {
          this.isBlockOutClicked = true;
        }
        break;
    }
  }

  private showCreateEditBlockOutModal(model?: CalendarEventDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditBlockOutComponent>;
    modalSettings.initialState = {
      model: model,
    };
    const modal = this._modalService.show(CreateEditBlockOutComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.getEvents();
      });
  }

  private showCreateEditBookingModal(model?: CalendarEventDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditBookingComponent>;
    modalSettings.initialState = {
      model: model,
    };
    const modal = this._modalService.show(CreateEditBookingComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.getEvents();
      });
  }

  private getUser(): void {
    this._usersService.get(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(user => {
        this.user = user;
      });
  }

  private getEvents(): void {
    this.isLoading = true;
    const startTime = moment(this.startTime);
    const endTime = moment(this.endTime);
    this._calendarEventsService.getAll(this.userId, startTime, endTime)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(calendarEvents => {
        const calendarEventInputs: EventInput[] = _.map(calendarEvents, calendarEvent => {
          const calendarEventInput: EventInput = {
            id: calendarEvent.id,
            title: calendarEvent.creatorUserId === this.appSession.userId ? calendarEvent.title : '',
            start: calendarEvent.startTime.format('YYYY-MM-DD HH:mm'),
            end: calendarEvent.endTime.format('YYYY-MM-DD HH:mm'),
            allDay: false,
            calendarEvent: calendarEvent,
          };
          switch (calendarEvent.type) {
            case CalendarEventType.Blocker:
              calendarEventInput.display = 'background';
              calendarEventInput.className = 'fc-non-business';
              calendarEventInput.title = calendarEvent.creatorUserId === this.appSession.userId ? calendarEvent.title : '';
              break;
            case CalendarEventType.BookingRequest:
              if (calendarEvent.creatorUserId !== this.appSession.userId && this.userId !== this.appSession.userId) {
                calendarEventInput.display = 'background';
                calendarEventInput.className = 'fc-non-business';
                calendarEventInput.title = '';
              } else {
                calendarEventInput.title = calendarEvent.title;
                calendarEventInput.backgroundColor = '#6E84A3';
              }
              break;
            case CalendarEventType.ConfirmedBooking:
              calendarEventInput.title = calendarEvent.title;
              calendarEventInput.backgroundColor = '#2C7BE5';
              break;
          }
          if (calendarEvent.recurrence !== CalendarEventRecurrence.OneTime) {
            const duration = this.calculateDuration(calendarEvent.startTime, calendarEvent.endTime);
            const durationText = this.formatDuration(duration);
            calendarEventInput.rrule = {
              freq: CalendarEventRecurrence[calendarEvent.recurrence].toLowerCase(),
              interval: 1,
              dtstart: calendarEvent.startTime.format('YYYY-MM-DD HH:mm'),
              until: '2025-01-01',
            };
            calendarEventInput.duration = durationText;
          }
          return calendarEventInput;
        });
        this.calendarOptions.events = calendarEventInputs;
      });
  }
}
