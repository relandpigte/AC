import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventRecurrence, CalendarEventsServiceProxy, CalendarEventType } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-block-out',
  templateUrl: './create-edit-block-out.component.html',
  styleUrls: ['./create-edit-block-out.component.less']
})
export class CreateEditBlockOutComponent extends AppComponentBase implements OnInit {
  @Input() model: CalendarEventDto = new CalendarEventDto();
  @Output() modelSaved = new EventEmitter();
  isLoading = false;
  startTime: Date;
  endTime: Date;
  tempStartTime: Date;
  tempEndTime: Date;
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
    if (this.model) {
      if (!this.model.id) {
        this.startTime = this.model.startTime.toDate();
        this.endTime = this.model.startTime.toDate();
        this.model.recurrence = CalendarEventRecurrence.OneTime;
      } else {
        this.startTime = this.convertMomentToDate(this.model.startTime);
        this.endTime = this.convertMomentToDate(this.model.endTime);
      }
      this.tempStartTime = this.startTime;
      this.tempEndTime = this.endTime;
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.startTime = this.convertDateToMoment(this.startTime);
    this.model.endTime = this.convertDateToMoment(this.endTime);
    this.model.type = CalendarEventType.Blocker;
    (!this.model.id
      ? this._calendarEventsService.create(this.model)
      : this._calendarEventsService.update(this.model))
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
}
