import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, CalendarOptions, DateSelectArg, EventClickArg, EventInput, FullCalendarComponent, BusinessHoursInput } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CalendarEventDto,
  CalendarEventRecurrence,
  CalendarEventsServiceProxy,
  CalendarEventType,
  ProfilesServiceProxy,
  TimeZoneDto,
  TimeZonesServiceProxy,
  UserDto,
  UserAvailabilitiesServiceProxy,
  UserAvailabilityDto
} from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { CreateEditBlockOutComponent } from './_components/create-edit-block-out/create-edit-block-out.component';
import { CreateEditBookingComponent } from './_components/create-edit-booking/create-edit-booking.component';
import { CreateEditSchedulesComponent } from './_components/create-edit-schedules/create-edit-schedules.component';

export enum CalendarEventSessionType {
  Upcoming = 'upcoming',
  Past = 'past',
}

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
  eventId: number;
  startTime: Date;
  endTime: Date;
  isLoading = false;
  isBlockOutClicked = false;
  isUserAvailabilitiesLoading = false;
  calendar: Calendar;
  gotoDate: string;
  calendarEventId: string;
  calendarEventAutoAccept = false;
  CalendarEventSessionType = CalendarEventSessionType;
  filteredSessionType = CalendarEventSessionType.Upcoming;
  calendarEventInputs: EventInput[] = [];
  calendarEvents: CalendarEventDto[] = [];
  calendarEventsTemp: CalendarEventDto[] = [];
  userAvailabilities: UserAvailabilityDto[] = [];
  isTutorCalendarUser = false;

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
    nowIndicator: true,
    eventConstraint: 'businessHours',
    height: 'auto',
    datesSet: this.dateSet.bind(this),
    dateClick: this.dateClicked.bind(this),
    eventClick: this.eventClick.bind(this),
  };

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _calendarEventsService: CalendarEventsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _timeZonesService: TimeZonesServiceProxy,
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
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
        const gotoDate = this.convertMomentToDate(moment(paramMap.get('goto')));
        this.calendar.gotoDate(gotoDate);
        this.calendar.scrollToTime({
          hour: gotoDate.getHours(),
          minute: gotoDate.getMinutes(),
        });
        if (paramMap.has('event-id')) {
          this.calendarEventId = paramMap.get('event-id');
          if (paramMap.has('auto-accept')) {
            this.calendarEventAutoAccept = paramMap.get('auto-accept').toLowerCase() === 'true';
          } else if (this.calendarEventId) {
            this.getEventDetailsbyId();
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
      });
  }

  onEventClick(event: CalendarEventDto): void {
    const model = event;
    model.tutorId = event.projectOffer.creatorUserId ?? this.userId;
    this.showCreateEditBookingModal(_.cloneDeep(model));
  }

  onSessionTypeChange(sessionType: CalendarEventSessionType): void {
    this.filteredSessionType = sessionType;
    const rightNow = new Date();
    if (sessionType === CalendarEventSessionType.Upcoming) {
      this.calendarEvents = this.calendarEventsTemp.filter(e => e.startTime.toDate() >= rightNow);
    } else {
      this.calendarEvents = this.calendarEventsTemp.filter(e => e.startTime.toDate() < rightNow);
    }
  }

  onScheduleClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditSchedulesComponent>;
    modalSettings.initialState = {
      userAvailabilities: this.userAvailabilities,
    };
    const modal = this._modalService.show(CreateEditSchedulesComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.getUserAvailabilities();
      });
  }

  private dateSet(args: DateSelectArg): void {
    this.startTime = args.start;
    this.endTime = args.end;
    setTimeout(() => {
      this.getCalendarEvents();
    });
  }

  private dateClicked(args: DateClickArg): void {
    if (!(args.jsEvent.target as HTMLDivElement).classList.contains('fc-non-business')) {
      const model = new CalendarEventDto();
      model.startTime = moment(args.date);
      model.endTime = moment(args.date);
      if (!this.isBlockOutClicked && this.permission.isGranted('Pages.Calendar.BlockOuts')) {
        this.showCreateEditBlockOutModal(model);
      } 
      this.isBlockOutClicked = false;
    }
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
      case CalendarEventType.Personal:
        if ((calendarEvent.creatorUserId === this.appSession.userId || this.userId === this.appSession.userId)
          && this.permission.isGranted('Pages.Calendar.Bookings')) {
          const model = (args.event.extendedProps.calendarEvent as CalendarEventDto);
          model.tutorId = model.projectOffer ? model.projectOffer.creatorUserId ?? this.userId : null;
          this.showCreateEditBookingModal(_.cloneDeep(model));
        } else {
          this.isBlockOutClicked = true;
        }
        break;
    }
  }

  private refreshClick(): void {
    this.getCalendarEvents();
    this.getUserAvailabilities();
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
        this.isTutorCalendarUser = this.user.roleNames.includes('Tutor');
        this.getUserAvailabilities();
      });
  }

  private getTimeZones(): void {
    this._timeZonesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(timeZones => {
        this.timeZones = timeZones;
      });
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
        this.calendarEventInputs = _.map(calendarEvents, calendarEvent => {
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

        this.calendarEventsTemp = calendarEvents.filter(e => e.type !== CalendarEventType.Blocker);
        const rightNow = new Date();
        if (this.filteredSessionType === CalendarEventSessionType.Upcoming) {
          this.calendarEvents = this.calendarEventsTemp.filter(e => e.startTime.toDate() >= rightNow);
        } else {
          this.calendarEvents = this.calendarEventsTemp.filter(e => e.startTime.toDate() < rightNow);
        }

        this.calendarOptions.events = this.calendarEventInputs;
      });
  }

  private getEventDetailsbyId(): void {
    this.isLoading = true;
    this._calendarEventsService.getAllEventDetailsbyEventId(this.calendarEventId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(calendarEvents => {
        if (calendarEvents !== undefined && calendarEvents.type !== undefined && calendarEvents.type !== CalendarEventType.Cancelled) {
          this.showCreateEditBookingModal(calendarEvents, this.calendarEventAutoAccept);
          this.calendarEventId = undefined;
          this.calendarEventAutoAccept = false;
        } else {
          this.notify.error(this.l('TheBookingRequestWasCancelled'));
        }
      });
  }

  private getUserAvailabilities(): void {
    if (this.isTutorCalendarUser) {
      this.isUserAvailabilitiesLoading = true;
      this._userAvailabilitiesService.getAll(this.userId)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isUserAvailabilitiesLoading = false;
          }),
        )
        .subscribe(userAvailabilities => {
          this.userAvailabilities = userAvailabilities;
          let minMinutes = 0;
          let maxMinutes = 1440;
          const businessHours: BusinessHoursInput[] = [];
          _.forEach(userAvailabilities, userAvailability => {
            if (userAvailability.isAvailable) {
              const startTimeMinutes = this.convertTimeToMinutes(userAvailability.startTime);
              if (minMinutes === 0 || minMinutes > startTimeMinutes) {
                minMinutes = startTimeMinutes;
              }
              const endTimeMinutes = this.convertTimeToMinutes(userAvailability.endTime);
              if (maxMinutes === 1440 || endTimeMinutes > maxMinutes) {
                maxMinutes = endTimeMinutes;
              }

              const businessHour: BusinessHoursInput = {
                daysOfWeek: [userAvailability.dayOfWeek],
                startTime: userAvailability.startTime,
                endTime: userAvailability.endTime,
              };
              businessHours.push(businessHour);
            }
          });
          this.calendarOptions.businessHours = businessHours;
          this.calendarOptions.slotMinTime = `${this.convertMinutesToTime(this.addMinutesPadding(minMinutes))}:00`;
          this.calendarOptions.slotMaxTime = `${this.convertMinutesToTime(this.addMinutesPadding(maxMinutes, true))}:00`;
        });
    }
  }

  private convertTimeToMinutes(time: string): number {
    const timeParts = time.split(':');
    return (+timeParts[0] * 60) + (+timeParts[1]);
  }

  private convertMinutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return this.strPadLeft(hours, 2) + ':' + this.strPadLeft(minutes, 2);
  }

  private addMinutesPadding(minutes: number, isEnd = false): number {
    const minutesPadding = minutes % 60 === 0 ? 60 : 30;
    return isEnd ? minutes + minutesPadding : minutes - minutesPadding;
  }
}
