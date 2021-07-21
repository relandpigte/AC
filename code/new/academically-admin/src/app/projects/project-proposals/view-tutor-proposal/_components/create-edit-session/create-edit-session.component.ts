import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventRecurrence, CalendarEventsServiceProxy, CalendarEventType, ProjectDto, RescheduleCalendarEventDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { getUnixTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-session',
  templateUrl: './create-edit-session.component.html',
  styleUrls: ['./create-edit-session.component.less']
})
export class CreateEditSessionComponent extends AppComponentBase implements OnInit {
  @Input() model: CalendarEventDto = new CalendarEventDto();
  @Input() isEditing = false;
  @Output() modelSaved = new EventEmitter<CalendarEventDto>();
  projects: ProjectDto[] = [];
  isLoading = false;
  startTime: Date;
  endTime: Date;
  tempStartTime: Date;
  tempEndTime: Date;
  maxTime: Date;
  isFormViewOnly = false;
  comments = '';
  datePickerConfig: BsDatepickerConfig;

  CalendarEventRecurrence = CalendarEventRecurrence;
  @ViewChild('endTimeEl') endTimePicker;
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
      this.startTime.setSeconds(0);
      this.endTime = this.model.endTime.toDate();
      this.endTime.setSeconds(0);
      this.tempStartTime = this.startTime;
      this.tempEndTime = this.endTime;
      if (!this.model.id) {
        this.model.recurrence = CalendarEventRecurrence.OneTime;
      } else {
        this.isFormViewOnly = true;
      }
      this.updateMaxTime();
    }
  }

  checkMinute(min: string): boolean {
    return false;
  }
  onFormSubmit(): void {
    this.isLoading = true;
    this.model.startTime = moment(this.startTime);
    this.model.endTime = moment(this.endTime);
    this.model.type = CalendarEventType.BookingRequest;

    if (!this.model.id) {
      this.modelSaved.emit(this.model);
      this._modal.hide();
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
          this.modelSaved.emit(this.model);
          this._modal.hide();
        });
    }
  }

  onAcceptClick(): void {
    this.isLoading = true;
    this._calendarEventsService.accept(this.model.id, 0)
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
    this.modelSaved.emit();
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
    this.updateMaxTime();
  }

  onEndTimeChange(): void {
    if (this.endTime && this.endTime < this.startTime) {
      this.startTime = this.endTime;
    } else if (this.durationText.length > 5) {
      setTimeout(() => {
        this.endTime = this.tempEndTime;
      });
    }
    this.checkEndTimeValidity();
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

  private updateMaxTime(): void {
    this.maxTime = new Date();
    this.maxTime.setTime(this.startTime.getTime());
    this.maxTime.setHours(this.startTime.getHours() + 2);
    this.maxTime.setSeconds(this.startTime.getSeconds() + 1);

    if (this.endTime && this.endTime > this.maxTime) {
      this.endTime = this.maxTime;
    }
  }

  private checkEndTimeValidity(): void {
    const minDiff = this.endTime.getMinutes() - this.startTime.getMinutes();
    if (minDiff !== 0 && minDiff !== 30 && minDiff !== -30) {
      setTimeout(() => {
        this.endTime = new Date();
        this.endTime.setTime(this.startTime.getTime());
        this.endTime.setHours(this.startTime.getHours() + 2);
        this.endTime.setSeconds(this.startTime.getSeconds() + 1);
      });
    }
  }
}
