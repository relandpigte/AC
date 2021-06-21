import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventRecurrence, CalendarEventsServiceProxy, CalendarEventType, ProjectDto, RescheduleCalendarEventDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-booking',
  templateUrl: './create-edit-booking.component.html',
  styleUrls: ['./create-edit-booking.component.less']
})
export class CreateEditBookingComponent extends AppComponentBase implements OnInit {
  @Input() model: CalendarEventDto = new CalendarEventDto();
  @Output() modelSaved = new EventEmitter();
  projects: ProjectDto[] = [];
  isLoading = false;
  startTime: Date;
  endTime: Date;
  tempStartTime: Date;
  tempEndTime: Date;
  isFormViewOnly = false;
  comments = '';
  datePickerConfig: BsDatepickerConfig;

  CalendarEventRecurrence = CalendarEventRecurrence;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _calendarEventsService: CalendarEventsServiceProxy,
  ) {
    super(injector);
    this.startTime = new Date();
    this.endTime = new Date();
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  get duration(): number {
    return this.calculateDuration(moment(this.startTime), moment(this.endTime));
  }

  get durationText(): string {
    return this.formatDuration(this.duration);
  }

  ngOnInit(): void {
    this.getProjects();
    if (this.model) {
      this.startTime = this.model.startTime.toDate();
      this.endTime = this.model.endTime.toDate();
      this.tempStartTime = this.startTime;
      this.tempEndTime = this.endTime;
      if (!this.model.id) {
        this.model.recurrence = CalendarEventRecurrence.OneTime;
      } else {
        this.isFormViewOnly = true;
      }
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.startTime = moment(this.startTime);
    this.model.endTime = moment(this.endTime);
    this.model.type = CalendarEventType.BookingRequest;
    if (!this.model.id) {
      this._calendarEventsService.create(this.model)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this.modelSaved.emit();
          this._modal.hide();
        });
    } else {
      const rescheduleModel = new RescheduleCalendarEventDto();
      rescheduleModel.calendarEvent = this.model;
      rescheduleModel.oldStartTime = moment(this.tempStartTime);
      rescheduleModel.oldEndTime = moment(this.tempEndTime);
      rescheduleModel.comments = this.comments;
      this._calendarEventsService.reschedule(rescheduleModel)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this.modelSaved.emit();
          this._modal.hide();
        });
    }
  }

  onAcceptClick(): void {
    this.isLoading = true;
    this._calendarEventsService.acceptOffer(this.model.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.modelSaved.emit();
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onStartTimeChange(): void {
    if (this.startTime && this.startTime > this.endTime) {
      this.endTime = this.startTime;
    } else if (this.durationText.length > 5) {
      setTimeout(() => {
        this.startTime = this.tempStartTime;
      });
    }
  }

  onEndTimeChange(): void {
    if (this.endTime && this.endTime < this.startTime) {
      this.startTime = this.endTime;
    } else if (this.durationText.length > 5) {
      setTimeout(() => {
        this.endTime = this.tempEndTime;
      });
    }
  }

  private getProjects(): void {
    this.isLoading = true;
    this._calendarEventsService.getUserProjects(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe(projects => {
        this.projects = projects;
      });
  }
}
