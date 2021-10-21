import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DayOfWeek } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { Availability } from '../../_models/availability';

@Component({
  selector: 'app-create-edit-availability',
  templateUrl: './create-edit-availability.component.html',
  styleUrls: ['./create-edit-availability.component.less']
})
export class CreateEditAvailabilityComponent extends AppComponentBase implements OnInit {
  @Output() modelSaved = new EventEmitter<Availability[]>();
  DayOfWeek = DayOfWeek;
  dayOfWeeks: DayOfWeek[] = [];
  startTime: Date = new Date();
  endTime: Date = new Date();

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
  ) {
    super(injector);
    this.startTime.setHours(8);
    this.startTime.setMinutes(0);
    this.endTime.setHours(17);
    this.endTime.setMinutes(0);
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    const availabilities: Availability[] = [];
    _.sortBy(this.dayOfWeeks).forEach(dayOfWeek => {
      const availability = new Availability();
      availability.dayOfWeek = dayOfWeek;
      availability.times.push({
        startTime: this.startTime,
        endTime: this.endTime,
      });
      availabilities.push(availability);
    });
    this.modelSaved.emit(availabilities);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onDayOfWeekSelected(dayOfWeek: DayOfWeek, isChecked: boolean): void {
    if (isChecked) {
      this.dayOfWeeks.push(dayOfWeek);
    } else {
      const index = this.dayOfWeeks.findIndex(e => e === dayOfWeek);
      this.dayOfWeeks.splice(index, 1);
    }
  }

  onAvailabilityChange(type: string): void {
    const morningStartTime = new Date();
    const morningEndTime = new Date();
    const eveningStartTime = new Date();
    const eveningEndTime = new Date();

    morningStartTime.setHours(6);
    morningEndTime.setHours(11);
    eveningStartTime.setHours(18);
    eveningEndTime.setHours(21);

    morningStartTime.setMinutes(0);
    morningEndTime.setMinutes(0);
    eveningStartTime.setMinutes(0);
    eveningEndTime.setMinutes(0);

    this.dayOfWeeks = [];
    switch (type) {
      case 'endeve':
        this.dayOfWeeks.push(DayOfWeek.Sunday);
        this.dayOfWeeks.push(DayOfWeek.Saturday);
        this.startTime = eveningStartTime;
        this.endTime = eveningEndTime;
        break;
      case 'endmor':
        this.dayOfWeeks.push(DayOfWeek.Sunday);
        this.dayOfWeeks.push(DayOfWeek.Saturday);
        this.startTime = morningStartTime;
        this.endTime = morningEndTime;
        break;
      case 'dayeve':
        this.dayOfWeeks.push(DayOfWeek.Monday);
        this.dayOfWeeks.push(DayOfWeek.Tuesday);
        this.dayOfWeeks.push(DayOfWeek.Wednesday);
        this.dayOfWeeks.push(DayOfWeek.Thursday);
        this.dayOfWeeks.push(DayOfWeek.Friday);
        this.startTime = eveningStartTime;
        this.endTime = eveningEndTime;
        break;
      case 'daymor':
        this.dayOfWeeks.push(DayOfWeek.Monday);
        this.dayOfWeeks.push(DayOfWeek.Tuesday);
        this.dayOfWeeks.push(DayOfWeek.Wednesday);
        this.dayOfWeeks.push(DayOfWeek.Thursday);
        this.dayOfWeeks.push(DayOfWeek.Friday);
        this.startTime = morningStartTime;
        this.endTime = morningEndTime;
        break;
    }
  }
}
