import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CalendarEventDto, CalendarEventRecurrence, CalendarEventsServiceProxy, CalendarEventType } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-block-date',
  templateUrl: './block-date.component.html',
  styleUrls: ['./block-date.component.less']
})
export class BlockDateComponent extends AppComponentBase implements OnInit {
  @Input() model: CalendarEventDto = new CalendarEventDto();
  @Output() modelSaved = new EventEmitter();
  isLoading = false;
  startTime: Date;
  endTime: Date;

  CalendarEventRecurrence = CalendarEventRecurrence;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _calendarEventsService: CalendarEventsServiceProxy,
  ) {
    super(injector);
    this.startTime = new Date();
    this.endTime = new Date();
  }

  ngOnInit(): void {
    if (this.model) {
      this.startTime = this.model.startTime.toDate();
      this.endTime = this.model.endTime.toDate();
      if (!this.model.id) {
        this.model.recurrence = CalendarEventRecurrence.OneTime;
      }
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.startTime = moment(this.startTime);
    this.model.endTime = moment(this.endTime);
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
}
