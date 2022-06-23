import { Component, Injector, OnInit } from '@angular/core';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import {
  WorkshopReplayType,
  WorkshopsServiceProxy,
  WorkshopType,
  QuestionType,
  UpdateWorkshopSettingsDto,
  ServiceDelayType,
  DayOfWeek,
  WorkshopFrequencyType,
  WorkshopRecursionType,
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { takeUntil } from 'rxjs/operators';
import { WorkshopService } from '@app/dashboard/workshop/_services/workshop.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AutoSaveComponentBase implements OnInit {
  id: string;
  model = new UpdateWorkshopSettingsDto();
  isLoading = false;
  workshopType = WorkshopType.Single;

  datePickerConfig: BsDatepickerConfig;
  minTimesPerDay = 1;
  maxTimesPerDay = 5;
  workshopDateTime: Date;
  endDate: Date;
  lastWorkshopValue: string;
  specificDateValue: Date;
  scheduleTimeValues: string[] = [];
  scheduleWeekValues: DayOfWeek[] = [];
  scheduleMonthsValues: Date[];

  WorkshopFrequencyType = WorkshopFrequencyType;
  WorkshopReplayType = WorkshopReplayType;
  QuestionType = QuestionType;
  WorkshopType = WorkshopType;
  DelayType = ServiceDelayType;
  WorkshopRecursionType = WorkshopRecursionType;
  DayOfWeek = DayOfWeek;

  constructor(
    injector: Injector,
    private _workshopService: WorkshopService,
    private _workshopsService: WorkshopsServiceProxy,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this._workshopService.workshopCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && !this.id && this.id !== response.id) {
          this.id = response.id;
          this.getWorkshop();
        }
      });
  }

  checkScheduleWeekInclusion(dow: DayOfWeek): boolean {
    return this.scheduleWeekValues?.includes(dow);
  }

  onWorkshopDateTimeChange(): void {
    if (this.workshopDateTime) {
      this.model.workshopDateTime = this.convertDateToMoment(this.workshopDateTime);
    }
  }

  onWorkshopEndDateChange(): void {
    if (this.endDate) {
      this.model.endDate = this.convertDateToMoment(this.endDate);
    }
  }

  onDripTypeChange(): void {
    this.lastWorkshopValue = undefined;
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
    if (this.scheduleWeekValues?.includes(dow)) {
      const index = this.scheduleWeekValues.findIndex(e => e === dow);
      if (index >= 0) {
        this.scheduleWeekValues.splice(dow);
      }
    } else {
      this.scheduleWeekValues = this.scheduleWeekValues ?? [];
      this.scheduleWeekValues.push(dow);
    }
    this.convertSessionWeeks();
  }

  onDaysOfMonthSelectionChange(): void {
    this.convertSessionForMonth();
  }

  onRecursionTypeChange(): void {
    switch (this.model.recursionType) {
      case WorkshopRecursionType.Daily:
        this.scheduleWeekValues = undefined;
        this.scheduleMonthsValues = undefined;
        this.convertSessionWeeks();
        this.convertSessionForMonth();
        break;
      case WorkshopRecursionType.Weekly:
        this.scheduleMonthsValues = undefined;
        this.convertSessionForMonth();
        break;
      case WorkshopRecursionType.Monthly:
        this.scheduleWeekValues = undefined;
        this.convertSessionWeeks();
        break;
    }
  }

  private saveWorkshop(): void {
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
        this.model.delayValue = this.lastWorkshopValue;
        break;
    }

    this._workshopsService.updateSettings(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {});
  }

  private getWorkshop(): void {
    this._workshopsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.workshopType = response.type;
        this.model.init(response);
        this.workshopType = response.type;

        if (response.workshopDateTime) {
          this.workshopDateTime = this.convertMomentToDate(response.workshopDateTime);
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
              this.lastWorkshopValue = this.model.delayValue;
              break;
          }
        } else {
          this.model.delayType = ServiceDelayType.Immediate;
        }

        if (this.model.sessionTimes) {
          this.scheduleTimeValues = JSON.parse(this.model.sessionTimes);
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
          this.initAutoSave(this.saveWorkshop);
        });
      });
  }

  private generateSessionTimes(): void {
    const tempScheduleTimeValues = this.scheduleTimeValues;
    this.scheduleTimeValues = [];
    for (let index = 0; index < this.model.timesPerDay; index++) {
      if (tempScheduleTimeValues[index]) {
        this.scheduleTimeValues.push(tempScheduleTimeValues[index]);
      } else {
        this.scheduleTimeValues.push('10:00 AM');
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
