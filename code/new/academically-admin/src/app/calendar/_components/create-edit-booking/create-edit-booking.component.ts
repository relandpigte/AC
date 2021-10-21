import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CalendarEventDto,
  CalendarEventRecurrence,
  CalendarEventsServiceProxy,
  CalendarEventType,
  ProjectDto,
  RescheduleCalendarEventDto,
  RescheduleCommentDto,
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
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
  @Output() modelAdded = new EventEmitter();
  @ViewChild('detailsTabButton') detailsTabButton: ElementRef<HTMLElement>;

  projects: ProjectDto[] = [];
  isLoading = false;
  lastRescheduleComment: RescheduleCommentDto;
  startTime: Date;
  endTime: Date;
  tempStartTime: Date;
  tempEndTime: Date;
  isFormViewOnly = false;
  isDecliningABooking = false;
  isCancellingABooking = false;
  comments = '';
  datePickerConfig: BsDatepickerConfig;
  autoAccept = false;
  isFromViewOffer = false;
  isBusy = true;
  isPersonalEvent = false;
  CalendarEventRecurrence = CalendarEventRecurrence;
  CalendarEventType = CalendarEventType;

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
    if (!this.duration || this.duration <= 0) {
      return '00:00';
    }
    if (this.duration > 120) {
      return '02:00';
    }
    return this.formatDuration(this.duration);
  }

  ngOnInit(): void {
    this.getProjects();
    if (this.model) {
      if (!this.model.id) {
        this.startTime = this.model.startTime.toDate();
        this.endTime = this.model.startTime.toDate();
      } else {
        this.isFormViewOnly = true;
        this.startTime = this.convertMomentToDate(this.model.startTime);
        this.endTime = this.convertMomentToDate(this.model.endTime);
        this.isBusy = this.model.isBusy;
        this.isPersonalEvent = this.model.type === CalendarEventType.Personal ? true : false;
        if (this.model.rescheduleComments && this.model.rescheduleComments.length > 0) {
          this.lastRescheduleComment = this.model.rescheduleComments[this.model.rescheduleComments.length - 1];
        }
        if (this.autoAccept) {
          this.acceptEvent();
        }
      }
      this.tempStartTime = this.startTime;
      this.tempEndTime = this.endTime;
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.startTime = this.convertDateToMoment(this.startTime);
    this.model.endTime = this.convertDateToMoment(this.endTime);
    this.model.type = this.isPersonalEvent ? CalendarEventType.Personal : CalendarEventType.BookingRequest;
    this.model.projectId = this.isPersonalEvent ? null : this.model.projectId;
    this.model.isBusy = this.isBusy;


    if (this.isFromViewOffer) {
      this.modelAdded.emit(this.model);
      this._modal.hide();
      return;
    }

    if (!this.model.id) {
      this._calendarEventsService.create(this.model)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(() => {
          this.modelSaved.emit();
          this._modal.hide();
        });
    } else {
      const rescheduleModel = new RescheduleCalendarEventDto();
      if (this.isDecliningABooking) {
        rescheduleModel.calendarEvent = _.cloneDeep(this.model);
        rescheduleModel.calendarEvent.creatorUser = null;
        rescheduleModel.calendarEvent.projectOffer = null;
        rescheduleModel.calendarEvent.project = null;
        rescheduleModel.oldStartTime = this.convertDateToMoment(this.tempStartTime);
        rescheduleModel.oldEndTime = this.convertDateToMoment(this.tempEndTime);
        rescheduleModel.comments = this.comments;
        this._calendarEventsService.decline(rescheduleModel)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.notify.success(this.l('TheBookingRequestWasDeclined'));
            this.modelSaved.emit();
            this._modal.hide();
          });
      } else if (this.isCancellingABooking) {
        this.isLoading = false;
        this.message.confirm(
          this.l('CancelBookingConfirmationMessage'),
          undefined,
          (result: boolean) => {
            if (result) {
              this.isLoading = true;
              rescheduleModel.calendarEvent = _.cloneDeep(this.model);
              rescheduleModel.calendarEvent.creatorUser = null;
              rescheduleModel.calendarEvent.projectOffer = null;
              rescheduleModel.calendarEvent.project = null;
              rescheduleModel.comments = this.comments;
              this._calendarEventsService.cancel(rescheduleModel)
                .pipe(
                  takeUntil(this.destroyed$),
                  finalize(() => {
                    this.isLoading = false;
                  }),
                )
                .subscribe(() => {
                  this.notify.success(this.l('TheBookingRequestWasCancelled'));
                  this.modelSaved.emit();
                  this._modal.hide();
                });
            }
          }
        );
      } else {
        this.isLoading = false;
        this.message.confirm(
          this.l('RescheduleBookingConfirmationMessage'),
          undefined,
          (result: boolean) => {
            if (result) {
              this.isLoading = true;
              rescheduleModel.calendarEvent = _.cloneDeep(this.model);
              rescheduleModel.calendarEvent.creatorUser = null;
              rescheduleModel.calendarEvent.projectOffer = null;
              rescheduleModel.calendarEvent.project = null;
              rescheduleModel.oldStartTime = this.convertDateToMoment(this.tempStartTime);
              rescheduleModel.oldEndTime = this.convertDateToMoment(this.tempEndTime);
              rescheduleModel.comments = this.comments;
              this._calendarEventsService.reschedule(rescheduleModel)
                .pipe(
                  takeUntil(this.destroyed$),
                  finalize(() => {
                    this.isLoading = false;
                  }),
                )
                .subscribe(() => {
                  this.modelSaved.emit();
                  this._modal.hide();
                });
            }
          }
        );
      }
      if (this.model.type === CalendarEventType.Personal) {
        this.model.tutorId = this.model.creatorUserId;
        this._calendarEventsService.update(this.model)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.notify.success('The event has been updated successfully');
            this.modelSaved.emit();
            this._modal.hide();
          });
      }
    }
  }

  onSubmitClick(): void {
    this.acceptEvent();
  }

  onDeclineClick(): void {
    this.isDecliningABooking = true;
  }

  onCancelSessionClick(): void {
    this.isCancellingABooking = true;
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onCancelClick(): void {
    this.isFormViewOnly = true;
    this.isDecliningABooking = false;
    this.isCancellingABooking = false;
  }

  onJoinSessionClick(): void {
    const w = 1024;
    const h = 768;

    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    window.open(
      `/app/sessions/${this.model.id}`,
      this.model.title,
      `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${w / systemZoom},height=${h / systemZoom},left=${left},top=${top}`
    );
  }

  onStartTimeChange(): void {
    if (this.startTime && this.startTime > this.endTime) {
      this.endTime = this.startTime;
    } else if (_.isNaN(this.duration)) {
      setTimeout(() => {
        this.startTime = this.tempStartTime;
      });
    } else if (this.duration > 120) {
      setTimeout(() => {
        const temp = _.cloneDeep(this.endTime);
        temp.setMinutes(temp.getMinutes() - (this.duration - 120));
        this.endTime = temp;
      });
    }
  }

  onEndTimeChange(): void {
    if (this.endTime && this.endTime < this.startTime) {
      this.startTime = this.endTime;
    } else if (_.isNaN(this.duration)) {
      setTimeout(() => {
        this.endTime = this.tempEndTime;
      });
    } else if (this.duration > 120) {
      setTimeout(() => {
        const temp = _.cloneDeep(this.startTime);
        temp.setMinutes(temp.getMinutes() + (this.duration - 120));
        this.startTime = temp;
      });
    }
  }

  onTabSwitch(): void {
    this.model.projectId = null;
  }

  private getProjects(): void {
    this.isLoading = true;
    this._calendarEventsService.getUserProjects(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(projects => {
        this.projects = projects;
      });
  }

  private acceptEvent(): void {
    this.isLoading = true;
    this._calendarEventsService.accept(this.model.id, this.model.tutorId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
          if (this.autoAccept) {
            this.autoAccept = false;
          }
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('TheBookingRequestWasAccepted'));
        this.modelSaved.emit();
        this._modal.hide();
      });
  }
}
