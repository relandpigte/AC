import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserAvailabilitiesServiceProxy, UserAvailabilityDto, UserAvailabilitySettingDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { flatMap } from 'lodash';

export enum ScheduleType {
  DEFAULT = 'default',
  CUSTOM = 'custom',
  SETTINGS = 'settings'
}

@Component({
  selector: 'app-create-edit-schedules',
  templateUrl: './create-edit-schedules.component.html',
  styleUrls: ['./create-edit-schedules.component.less'],
})
export class CreateEditSchedulesComponent extends AppComponentBase implements OnInit {
  @Input() userAvailabilities: UserAvailabilityDto[] = [];
  @Input() userAvailabilitySettings: UserAvailabilitySettingDto;

  @Output() modelSaved = new EventEmitter();

  defaultModels: any;
  isLoading = false;
  activeTab = ScheduleType.DEFAULT;

  readonly ScheduleType = ScheduleType;
  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _userAvailabilitiesService: UserAvailabilitiesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleModelChanged(changes: any): void {
    this.defaultModels = changes;
  }

  handleSettingsChanged(data: UserAvailabilitySettingDto): void {
    this.userAvailabilitySettings = data;
  }

  onFormSubmit(): void {
    this.isLoading = true;
    if (this.activeTab === ScheduleType.SETTINGS) {
      this._userAvailabilitiesService.saveAvailabilitySettings(this.userAvailabilitySettings)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((): void => {
          this.notify.success(this.l('SavedSuccessfully'));
          this.modelSaved.emit();
          this._modal.hide();
        });
    } else {
      const availabilities = [
        ...Object.keys(this.defaultModels).map(m => this.defaultModels[m].availability),
        ...(flatMap(Object.keys(this.defaultModels), m => this.defaultModels[m].breaks).map(m => m.availability))
      ];
      this._userAvailabilitiesService.createEdit(availabilities)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(() => {
          this.notify.success(this.l('SavedSuccessfully'));
          this.modelSaved.emit();
          this._modal.hide();
        });
    }
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  get isModelValid(): boolean {
    return this.defaultModels && Object.keys(this.defaultModels).every(m => (this.defaultModels[m].breaks?.every(b => b.startTime?.value < b.endTime?.value) ?? false) === true);
  }
}
