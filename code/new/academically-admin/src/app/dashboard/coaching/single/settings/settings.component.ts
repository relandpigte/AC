import { Component, Injector, OnInit } from '@angular/core';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import {
  CoachingReplayType,
  CoachingsServiceProxy,
  CoachingType,
  QuestionType,
  UpdateCoachingSettingsDto,
  ServiceDelayType,
  DayOfWeek, ServicesServiceProxy, ServiceFeatureFlagDto, ServicesType,
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { takeUntil } from 'rxjs/operators';
import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import * as _ from 'lodash';
import { switchMap } from '@node_modules/rxjs/operators';

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
  flags = new ServiceFeatureFlagDto();

  CoachingReplayType = CoachingReplayType;
  QuestionType = QuestionType;
  CoachingType = CoachingType;

  constructor(
    injector: Injector,
    private _coachingService: CoachingService,
    private _coachingsService: CoachingsServiceProxy,
    private _servicesService: ServicesServiceProxy
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

          this.flags.init({
            referenceId: response.id,
            serviceType: ServicesType.Coaching,
            creatorUserId: this.currentUserId
          });
          this.getServiceFlags();
        }
      });
  }

  toggleVisibility(): void {
    this.model.visible = !this.model.visible;
  }

  private saveCoaching(): void {
    this._coachingsService.updateSettings(this.model)
      .pipe(takeUntil(this.destroyed$))
      .pipe(switchMap(() => this._servicesService.saveFeatureFlags(this.flags)))
      .subscribe(flags => this.flags.init(flags));
  }

  private getCoaching(): void {
    this._coachingsService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.coachingType = response.type;
        this.model.init(response);
        this.coachingType = response.type;

        setTimeout(() => {
          this.modelToSave = [this.model, this.flags];
          this.initAutoSave(this.saveCoaching);
        });
      });
  }

  private getServiceFlags(): void {
    this.pipeDestroy(this._servicesService.getFeatureFlags(this.id), response => {
      if (_.isEmpty(response)) {
        return;
      }
      this.flags.init(response);
    });
  }
}
