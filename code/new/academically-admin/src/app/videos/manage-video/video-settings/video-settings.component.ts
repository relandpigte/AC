import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import {
  CommentSetting,
  GetDelayStatusDto,
  UpdateVideoSettingsDto,
  ServiceDelayType,
  VideoDto,
  VideosServiceProxy,
  VideoStatus,
  VideoType, ServiceFeatureFlagDto, ServicesType, ServicesServiceProxy
} from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { VideoService } from '@app/videos/_services/video.service';
import * as _ from 'lodash';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { switchMap } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-video-settings',
  templateUrl: './video-settings.component.html',
  styleUrls: ['./video-settings.component.less']
})
export class VideoSettingsComponent extends AutoSaveComponentBase implements OnInit {
  id: string;
  model: UpdateVideoSettingsDto = new UpdateVideoSettingsDto();
  CommentSetting = CommentSetting;
  isLoading = false;
  allowedVideoExtensions = fileUploadConfiguration.videoExtensions;
  VideoType = VideoType;
  DelayType = ServiceDelayType;
  hasParent = false;

  videoType: VideoType;
  lastVideoValue: string;
  specificDateValue: Date;
  datePickerConfig: BsDatepickerConfig;
  parentId: string;
  delayStatus = new GetDelayStatusDto();

  flags = new ServiceFeatureFlagDto();

  constructor(
    injector: Injector,
    private _router: Router,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.datePickerConfig.minDate = new Date();
  }

  get allDelaysVisible(): boolean {
    return this.delayStatus && this.delayStatus.isFirstVideoPublished && this.delayStatus.videoCount > 1;
  }

  ngOnInit(): void {
    this._videoService.videoCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && this.id !== response.id) {
          this.id = response.id;
          this.flags.init({
            referenceId: response.id,
            serviceType: ServicesType.Tutorial,
            creatorUserId: this.currentUserId,
            videoLockOrder: true,
            videoMandatoryActivity: true
          });
          this.getVideo();
          this.getServiceFlags();
        }
      });
  }

  toggleVisibility(): void {
    this.model.isVisible = !this.model.isVisible;
  }

  onBackClick(): void {
    this._router.navigate(['/app/videos/' + this.model.id + '/details']);
  }

  onDripTypeChange(): void {
    this.lastVideoValue = undefined;
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

  private updateSettings(): void {
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
        this.model.delayValue = this.lastVideoValue;
        break;
    }

    this._videosService.updateSettings(this.model)
      .pipe(takeUntil(this.destroyed$))
      .pipe(switchMap(() => {
        return this._servicesService.saveFeatureFlags(this.flags);
      }))
      .subscribe(flags => this.flags.init(flags));
  }

  private getVideo(): void {
    this.isLoading = true;
    this._videosService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.model.init(response);
        this.videoType = response.type;
        this.hasParent = !_.isNil(response.parentId);

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
              this.lastVideoValue = this.model.delayValue;
              break;
          }
        } else {
          this.model.delayType = ServiceDelayType.Immediate;
        }

        if (this.hasParent) {
          this.parentId = response.parentId;
          this.getDelayStatus();
        }
        this.modelToSave = [this.model, this.flags];
        this.initAutoSave(this.updateSettings);
      });
  }

  private getDelayStatus(): void {
    this._videosService.getDelayStatus(
      this.parentId,
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.delayStatus = response;
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

