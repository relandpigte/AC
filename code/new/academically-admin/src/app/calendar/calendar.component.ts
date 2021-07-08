import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, CalendarOptions, DateSelectArg, EventClickArg, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventRecurrence, CalendarEventsServiceProxy, CalendarEventType, ProfilesServiceProxy, TimeZoneDto, TimeZonesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
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
export class CalendarComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;

  user: UserDto = new UserDto();
  timeZones: TimeZoneDto[] = [];
  userId: number;
  startTime: Date;
  endTime: Date;
  isLoading = false;
  isBlockOutClicked = false;
  calendar: Calendar;
  gotoDate: string;
  calendarEventId: string;
  calendarEventAutoAccept = false;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev,next refresh today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    allDaySlot: false,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: true,
    },
    customButtons: {
      refresh: {
        bootstrapFontAwesome: 'fa-sync-alt',
        click: this.refreshClick.bind(this),
      }
    },
    datesSet: this.dateSet.bind(this),
    dateClick: this.dateClicked.bind(this),
    eventClick: this.eventClick.bind(this),
    nowIndicator: true,
  };

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _calendarEventsService: CalendarEventsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _timeZonesService: TimeZonesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.calendar = this.calendarComponent.getApi();
    this._route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.has('user-id') ? +paramMap.get('user-id') : this.appSession.userId;
      this.getUser();
    });
  }

  ngAfterViewInit(): void {
    this.calendar = this.calendarComponent.getApi();
    this._route.queryParamMap.subscribe(paramMap => {
      if (paramMap.has('goto')) {
        this.gotoDate = paramMap.get('goto');
        const gotoDate = abp.timing.convertToUserTimezone(moment.utc(paramMap.get('goto')).toDate());
        this.calendar.gotoDate(gotoDate);
        this.calendar.scrollToTime({
          hour: gotoDate.getHours(),
          minute: gotoDate.getMinutes(),
        });
        if (paramMap.has('event-id')) {
          this.calendarEventId = paramMap.get('event-id');
          if (paramMap.has('auto-accept')) {
            this.calendarEventAutoAccept = paramMap.get('auto-accept').toLowerCase() === "true";
          }
        }
      }
    });
  }

  onTimeZoneChange(timeZoneId: string): void {
    this.isLoading = true;
    const timeZone = this.timeZones.find(e => e.id === timeZoneId);
    this._timeZonesService.updateUserTimeZone(timeZone)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
          abp.timing.timeZoneInfo.iana.timeZoneId = timeZone.ianaName;
          moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
          this.getCalendarEvents();
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('TimeZoneUpdatedMessage'));
      })
  }

  private dateSet(args: DateSelectArg): void {
    this.startTime = args.start;
    this.endTime = args.end;
    setTimeout(() => {
      this.getCalendarEvents();
    });
  }

  private dateClicked(args: DateClickArg): void {
    const model = new CalendarEventDto();
    model.startTime = moment(args.date);
    model.endTime = moment(args.date);
    if (!this.isBlockOutClicked && this.permission.isGranted('Pages.Calendar.BlockOuts')) {
      this.showCreateEditBlockOutModal(model);
    } else if (!this.isBlockOutClicked && !this.isTutor && this.permission.isGranted('Pages.Calendar.Bookings')) {
      model.tutorId = this.userId;
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
      case CalendarEventType.RescheduledBooking:
      case CalendarEventType.ConfirmedBooking:
        if ((calendarEvent.creatorUserId === this.appSession.userId || this.userId === this.appSession.userId)
          && this.permission.isGranted('Pages.Calendar.Bookings')) {
          var model = (args.event.extendedProps.calendarEvent as CalendarEventDto);
          model.tutorId = this.userId;
          this.showCreateEditBookingModal(_.cloneDeep(model));
        } else {
          this.isBlockOutClicked = true;
        }
        break;
    }
  }

  private refreshClick(): void {
    this.getCalendarEvents();
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
        this.getCalendarEvents();
      });
  }

  private showCreateEditBookingModal(model?: CalendarEventDto, autoAcceptEvent = false): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditBookingComponent>;
    modalSettings.initialState = {
      model: model,
      autoAccept: autoAcceptEvent,
    };
    const modal = this._modalService.show(CreateEditBookingComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        if (this.calendarEventAutoAccept) {
          const calendarUrl = this.userId === this.appSession.userId
            ? `/app/calendar?goto=${this.gotoDate}`
            : `/app/calendar/${this.userId}?goto=${this.gotoDate}`;
          this._router.navigate([calendarUrl]);
        } else {
          this.getCalendarEvents();
        }
      });
  }

  private getUser(): void {
    this._profilesService.get(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.getTimeZones();
        })
      )
      .subscribe(user => {
        this.user = user;
      });
  }

  private getTimeZones(): void {
    this._timeZonesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(timeZones => {
        this.timeZones = timeZones;
      })
  }

  private getCalendarEvents(): void {
    this.isLoading = true;
    const startTime = this.convertDateToMoment(this.startTime);
    const endTime = this.convertDateToMoment(this.endTime);
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
              if (calendarEvent.creatorUserId === this.appSession.userId) {
                calendarEventInput.className = 'fc-non-business tutor';
                calendarEventInput.title = calendarEvent.title;
              } else {
                calendarEventInput.className = 'fc-non-business';
                calendarEventInput.title = '';
              }
              break;
            case CalendarEventType.ConfirmedBooking:
              calendarEventInput.title = calendarEvent.title;
              calendarEventInput.backgroundColor = '#2C7BE5';
              break;
            case CalendarEventType.BookingRequest:
              if (calendarEvent.creatorUserId !== this.appSession.userId && this.userId !== this.appSession.userId) {
                calendarEventInput.display = 'background';
                calendarEventInput.className = 'fc-non-business';
                calendarEventInput.title = '';
              } else {
                calendarEventInput.title = calendarEvent.title;
                calendarEventInput.backgroundColor = '#EDF2F9';
                calendarEventInput.textColor = '#000000';
              }
              break;
            case CalendarEventType.RescheduledBooking:
              if (calendarEvent.creatorUserId !== this.appSession.userId && this.userId !== this.appSession.userId) {
                calendarEventInput.display = 'background';
                calendarEventInput.className = 'fc-non-business';
                calendarEventInput.title = '';
              } else {
                calendarEventInput.title = calendarEvent.title;
                calendarEventInput.backgroundColor = '#6E84A3';
              }
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

        if (this.calendarEventId) {
          const calendarEvent = _.find(calendarEvents, e => e.id === this.calendarEventId);
          if (calendarEvent && calendarEvent.type !== CalendarEventType.Blocker) {
            calendarEvent.tutorId = this.userId;
            this.showCreateEditBookingModal(_.cloneDeep(calendarEvent), this.calendarEventAutoAccept);
            this.calendarEventId = undefined;
            this.calendarEventAutoAccept = false;
          }
        }
      });
  }
}
