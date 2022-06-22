import { Component, Injector, OnInit } from '@angular/core';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import {
  CoachingReplayType,
  CoachingsServiceProxy,
  CoachingType,
  QuestionType,
  UpdateCoachingSettingsDto,
  ServiceDelayType,
  DayOfWeek,
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { takeUntil } from 'rxjs/operators';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AutoSaveComponentBase implements OnInit {
  id: string;
  model = new UpdateCoachingSettingsDto();
  isLoading = false;
  coachingType = CoachingType.Single;

  CoachingReplayType = CoachingReplayType;
  QuestionType = QuestionType;
  CoachingType = CoachingType;

  constructor(
    injector: Injector,
    private _coachingService: CoachingService,
    private _coachingsService: CoachingsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._coachingService.coachingCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && !this.id && this.id !== response.id) {
          this.id = response.id;
          this.getCoaching();
        }
      });
  }

  private saveCoaching(): void {
    this._coachingsService.updateSettings(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {});
  }

  private getCoaching(): void {
    this._coachingsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.coachingType = response.type;
        this.model.init(response);
        this.coachingType = response.type;

        setTimeout(() => {
          this.modelToSave = this.model;
          this.initAutoSave(this.saveCoaching);
        });
      });
  }
}
