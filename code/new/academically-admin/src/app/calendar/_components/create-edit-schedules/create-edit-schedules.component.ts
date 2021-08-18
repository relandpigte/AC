import { Component, OnInit, Injector, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserAvailabilityDto, DayOfWeek, UserAvailabilitiesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-schedules',
  templateUrl: './create-edit-schedules.component.html',
  styleUrls: ['./create-edit-schedules.component.less']
})
export class CreateEditSchedulesComponent extends AppComponentBase implements OnInit {
  @Input() userAvailabilities: UserAvailabilityDto[] = [];
  @Output() modelSaved = new EventEmitter();
  selectedDayOfWeek = DayOfWeek.Sunday;
  model: UserAvailabilityDto = new UserAvailabilityDto();
  startTime: Date;
  endTime: Date;
  datePickerConfig: BsDatepickerConfig;
  isLoading = false;

  DayOfWeek = DayOfWeek;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this.setSelectedUserAvailability();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._userAvailabilitiesService.createEdit(this.userAvailabilities)
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
    }
    this.model.startTime = this.strPadLeft(this.startTime.getHours(), 2) + ':' + this.strPadLeft(this.startTime.getMinutes(), 2);
  }

  onEndTimeChange(): void {
    if (this.endTime && this.endTime < this.startTime) {
      this.startTime = this.endTime;
    }
    this.model.endTime = this.strPadLeft(this.endTime.getHours(), 2) + ':' + this.strPadLeft(this.endTime.getMinutes(), 2);
  }

  onDayOfWeekClick(dayOfWeek: number): void {
    this.selectedDayOfWeek = DayOfWeek[DayOfWeek[dayOfWeek]];
    this.setSelectedUserAvailability();
  }

  private setSelectedUserAvailability(): void {
    this.model = this.userAvailabilities.find(e => e.dayOfWeek === this.selectedDayOfWeek);
    const dateNow = new Date();
    this.startTime = this.createDateFromTime(dateNow, this.model.startTime);
    this.endTime = this.createDateFromTime(dateNow, this.model.endTime);
  }

  private createDateFromTime(dateNow: Date, time: string): Date {
    const startTimeParts = time.split(':');
    return new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(),
      +startTimeParts[0], +startTimeParts[1], 0);
  }
}
