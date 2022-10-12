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
  EventRecursionType,
  DayOfWeek,
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '@app/dashboard/events/_services/event.service';
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
  eventType = EventType.SingleEvent;
  minTimesPerDay = 1;
  maxTimesPerDay = 5;

  EventFrequencyType = EventFrequencyType;
  EventReplayType = EventReplayType;
  QuestionType = QuestionType;
  EventType = EventType;
  DelayType = ServiceDelayType;
  EventRecursionType = EventRecursionType;
  DayOfWeek = DayOfWeek;

  eventDateTime: Date;
  endDate: Date;
  lastEventValue: string;
  specificDateValue: Date;
  scheduleTimeValues: {key: number, value: string}[] = [];
  scheduleWeekValues: DayOfWeek[] = [];
  scheduleMonthsValues: Date[];
  test: string;

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

  checkScheduleWeekInclusion(dow: DayOfWeek): boolean {
    return this.scheduleWeekValues.includes(dow);
  }

  onEventDateTimeChange(): void {
    if (this.eventDateTime) {
      this.model.eventDateTime = this.convertDateToMoment(this.eventDateTime);
    }
  }

  onEventEndDateChange(): void {
    if (this.endDate) {
      this.model.endDate = this.convertDateToMoment(this.endDate);
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

  onTimesPerDayChange(): void {
    if (!_.isNumber(this.model.timesPerDay)) {
      this.model.timesPerDay = 1;
    } else {
      if (this.model.timesPerDay < this.minTimesPerDay) {
        this.model.timesPerDay = 1;
      } else if (this.model.timesPerDay > this.maxTimesPerDay) {
        this.model.timesPerDay = 5;
      }
    }

    this.generateSessionTimes();
  }

  onSessionTimeChange(): void {
    this.convertSessionTimes();
  }

  onDayOfWeekSelectionChange(dow: DayOfWeek): void {
    if (this.scheduleWeekValues.includes(dow)) {
      const index = this.scheduleWeekValues.findIndex(e => e === dow);
      if (index >= 0) {
        this.scheduleWeekValues.splice(dow);
      }
    } else {
      this.scheduleWeekValues.push(dow);
    }
    this.convertSessionWeeks();
  }

  onDaysOfMonthSelectionChange(): void {
    this.convertSessionForMonth();
  }

  onRecursionTypeChange(): void {
    switch (this.model.recursionType) {
      case EventRecursionType.Daily:
        this.scheduleWeekValues = undefined;
        this.scheduleMonthsValues = undefined;
        this.convertSessionWeeks();
        this.convertSessionForMonth();
        break;
      case EventRecursionType.Weekly:
        this.scheduleMonthsValues = undefined;
        this.convertSessionForMonth();
        break;
      case EventRecursionType.Monthly:
        this.scheduleWeekValues = undefined;
        this.convertSessionWeeks();
        break;
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

    let convertedSessionTimesArray = [];
    this.scheduleTimeValues.forEach(element => {
      convertedSessionTimesArray.push(element.value);
    });
    this.model.sessionTimes = JSON.stringify(convertedSessionTimesArray);

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
        if (response.endDate) {
          this.endDate = this.convertMomentToDate(response.endDate);
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

        if (this.model.sessionTimes) {
          const sessionTimesArray = JSON.parse(this.model.sessionTimes);
          let counter: number = 0;
          sessionTimesArray.forEach(element => {
            this.scheduleTimeValues.push({key: counter, value: element});
            counter++;
          });
          // this.scheduleTimeValues = JSON.parse(this.model.sessionTimes);

        }

        if (this.model.sessionDaysOfWeek) {
          this.scheduleWeekValues = JSON.parse(this.model.sessionDaysOfWeek);
        }

        if (this.model.sessionDaysOfMonth) {
          const date = new Date();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const daysOfMonth = JSON.parse(this.model.sessionDaysOfMonth) as string[];
          this.scheduleMonthsValues = daysOfMonth.map(monthValue => {
            return new Date(`${month}/${monthValue}/${year}`);
          });
        }

        setTimeout(() => {
          this.modelToSave = this.model;
          this.initAutoSave(this.saveEvent);
        });
      });
  }

  private generateSessionTimes(): void {
    const tempScheduleTimeValues = this.scheduleTimeValues;
    this.scheduleTimeValues = [];
    for (let index = 0; index < this.model.timesPerDay; index++) {
      if (tempScheduleTimeValues[index]) {
        this.scheduleTimeValues.push({ key:index, value: tempScheduleTimeValues[index].value});
      } else {
        this.scheduleTimeValues.push({ key: index, value: '10:00 AM'});
      }
    }

    this.convertSessionTimes();
  }

  private convertSessionTimes(): void {
    this.model.sessionTimes = JSON.stringify(this.scheduleTimeValues);
  }

  private convertSessionWeeks(): void {
    this.model.sessionDaysOfWeek = JSON.stringify(this.scheduleWeekValues);
  }

  private convertSessionForMonth(): void {
    if (this.scheduleMonthsValues && this.scheduleMonthsValues.length) {
      const daysOfMonth = this.scheduleMonthsValues.map(date => {
        return date.getDate();
      });
      this.model.sessionDaysOfMonth = JSON.stringify(daysOfMonth);
    } else {
      this.model.sessionDaysOfMonth = undefined;
    }
  }
}
