import { Component, Injector, OnInit } from '@angular/core';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import {
  EventFrequencyType,
  EventReplayType,
  EventsServiceProxy,
  QuestionType,
  UpdateEventSettingsDto,
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '@app/events/_services/event.service';

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

  EventFrequencyType = EventFrequencyType;
  EventReplayType = EventReplayType;
  QuestionType = QuestionType;

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

  private saveEvent(): void {
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
        this.model.init(response);
        if (response.eventDateTime) {
          this.eventDateTime = this.convertMomentToDate(response.eventDateTime);
        }
        this.modelToSave = this.model;
        this.initAutoSave(this.saveEvent);
      });
  }
}
