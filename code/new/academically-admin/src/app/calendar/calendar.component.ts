import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventRecurrence, CalendarEventsServiceProxy, CalendarEventType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { BlockDateComponent } from './_components/block-date/block-date.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less'],
  animations: [appModuleAnimation()],
})
export class CalendarComponent extends AppComponentBase implements OnInit {
  isLoading = false;
  startTime: Date;
  endTime: Date;
  userId: number;

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
    eventClick: this.eventClicked.bind(this),
  };

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _calendarEventsService: CalendarEventsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.has('user-id') ? +paramMap.get('user-id') : this.appSession.userId;
    });
  }

  private dateSet(args: DateSelectArg): void {
    this.startTime = args.start;
    this.endTime = args.end;
    setTimeout(() => {
      this.getBlockOuts();
    });
  }

  private dateClicked(args: DateClickArg): void {
    const targetClassList = (args.jsEvent.target as any).classList;
    if (!targetClassList.contains('fc-bg-event')
      && !targetClassList.contains('fc-event-title')
      && this.permission.isGranted('Pages.Calendar.BlockOuts')) {
      const model = new CalendarEventDto();
      model.startTime = moment(args.date);
      model.endTime = moment(args.date);
      this.showBlockDateModal(model);
    }
  }

  private eventClicked(args: EventClickArg): void {
    if ((args.event.extendedProps.type as CalendarEventType) == CalendarEventType.Blocker
      && this.permission.isGranted('Pages.Calendar.BlockOuts')) {
      this.showBlockDateModal(_.cloneDeep((args.event.extendedProps.calendarEvent as CalendarEventDto)));
    }
  }

  private showBlockDateModal(model?: CalendarEventDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BlockDateComponent>;
    modalSettings.initialState = {
      model: model,
    };
    const modal = this._modalService.show(BlockDateComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.getBlockOuts();
      });
  }

  private getBlockOuts(): void {
    this.isLoading = true;
    const startTime = moment(this.startTime);
    const endTime = moment(this.endTime);
    this._calendarEventsService.getAll(CalendarEventType.Blocker, startTime, endTime, this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(calendarEvents => {
        const blockOutEvents: EventInput[] = _.map(calendarEvents, calendarEvent => {
          const blockOutEvent: EventInput = {
            id: calendarEvent.id,
            title: calendarEvent.creatorUserId === this.appSession.userId ? calendarEvent.title : '',
            start: calendarEvent.startTime.format('YYYY-MM-DD HH:mm'),
            end: calendarEvent.endTime.format('YYYY-MM-DD HH:mm'),
            allDay: false,
            display: 'background',
            className: `fc-non-business ${this.isTutor ? 'tutor' : ''}`,
            type: CalendarEventType.Blocker,
            calendarEvent: calendarEvent,
          };
          if (calendarEvent.recurrence !== CalendarEventRecurrence.OneTime) {
            const duration = this.calculateDuration(calendarEvent.startTime, calendarEvent.endTime);
            blockOutEvent.rrule = {
              freq: CalendarEventRecurrence[calendarEvent.recurrence].toLowerCase(),
              interval: 1,
              dtstart: calendarEvent.startTime.format('YYYY-MM-DD HH:mm'),
              until: '2025-01-01',
            };
            blockOutEvent.duration = duration;
          }
          return blockOutEvent;
        });
        this.calendarOptions.events = blockOutEvents;
      });
  }

  private calculateDuration(startTime: moment.Moment, endTime: moment.Moment): string {
    const durationInMinutes = moment.duration(endTime.diff(startTime)).asMinutes();
    const durationHours = Math.floor(durationInMinutes / 60).toString().padStart(2, '0');
    const durationMinutes = (durationInMinutes % 60).toString().padStart(2, '0');
    const duration = `${durationHours}:${durationMinutes}`;
    return duration;
  }
}
