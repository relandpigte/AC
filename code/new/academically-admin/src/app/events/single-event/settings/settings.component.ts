import { Component, Injector, OnInit } from '@angular/core';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import {
  EventFrequencyType,
  EventReplayType,
  EventsServiceProxy,
  EventType,
  QuestionType,
  UpdateEventSettingsDto,
  ServiceDelayType,
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '@app/events/_services/event.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AutoSaveComponentBase implements OnInit {
  id: string;
  model = new UpdateEventSettingsDto();
  isLoading = false;
  datePickerConfig: BsDatepickerConfig;
  eventDateTime: Date;
  eventType = EventType.SingleEvent;

  EventFrequencyType = EventFrequencyType;
  EventReplayType = EventReplayType;
  QuestionType = QuestionType;
  EventType = EventType;
  DelayType = ServiceDelayType;

  lastEventValue: string;
  specificDateValue: Date;

  constructor(
    injector: Injector,
    private _eventService: EventService,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this._eventService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && !this.id && this.id !== response.id) {
          this.id = response.id;
          this.getEvent();
        }
      });
  }

  onEventDateTimeChange(): void {
    if (this.eventDateTime) {
      this.model.eventDateTime = this.convertDateToMoment(this.eventDateTime);
    }
  }

  onDripTypeChange(): void {
    this.lastEventValue = undefined;
    this.specificDateValue = undefined;
  }

  onSpecificDateChange(): void {
    if (this.specificDateValue) {
      const dateParts = [
        this.specificDateValue.getDate(),
        this.specificDateValue.getMonth() + 1,
        this.specificDateValue.getFullYear(),
      ];
      this.model.delayValue = dateParts.join('/');
    }
  }

  private saveEvent(): void {
    if (!_.isNumber(this.model.duration)) {
      return;
    }

    switch (this.model.delayType) {
      case ServiceDelayType.SpecificDate:
        if (this.specificDateValue) {
          const dateParts = [
            this.specificDateValue.getDate(),
            this.specificDateValue.getMonth() + 1,
            this.specificDateValue.getFullYear(),
          ];
          this.model.delayValue = dateParts.join('/');
        }
        break;
      default:
        this.model.delayValue = this.lastEventValue;
        break;
    }

    this._eventsService.updateSettings(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        // do nothing
      });
  }

  private getEvent(): void {
    this._eventsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.eventType = response.type;
        this.model.init(response);
        this.eventType = response.type;
        if (response.eventDateTime) {
          this.eventDateTime = this.convertMomentToDate(response.eventDateTime);
        }
        if (this.model.delayType) {
          switch (this.model.delayType) {
            case ServiceDelayType.SpecificDate:
              if (this.model.delayValue && this.model.delayValue.trim()) {
                const dateParts = this.model.delayValue.split('/');
                const day = +dateParts[0];
                const month = +dateParts[1] - 1;
                const year = +dateParts[2];
                this.specificDateValue = new Date(year, month, day);
              }
              break;
            default:
              this.lastEventValue = this.model.delayValue;
              break;
          }
        } else {
          this.model.delayType = ServiceDelayType.Immediate;
        }
        this.modelToSave = this.model;
        this.initAutoSave(this.saveEvent);
      });
  }
}
