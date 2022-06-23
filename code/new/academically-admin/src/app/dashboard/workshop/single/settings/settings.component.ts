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

  WorkshopReplayType = WorkshopReplayType;
  QuestionType = QuestionType;
  WorkshopType = WorkshopType;

  constructor(
    injector: Injector,
    private _workshopService: WorkshopService,
    private _workshopsService: WorkshopsServiceProxy,
  ) {
    super(injector);
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

  private saveWorkshop(): void {
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

        setTimeout(() => {
          this.modelToSave = this.model;
          this.initAutoSave(this.saveWorkshop);
        });
      });
  }
}
