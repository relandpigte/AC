import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { CommentSetting, GetDelayStatusDto, UpdateVideoSettingsDto, VideoDelayType, VideoDto, VideosServiceProxy, VideoStatus, VideoType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { VideoService } from '@app/videos/_services/video.service';
import * as _ from 'lodash';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

enum EditField {
  Comments = 1,
  Url = 2,
  Visibility = 3,
  Delay = 4,
}

@Component({
  selector: 'app-video-settings',
  templateUrl: './video-settings.component.html',
  styleUrls: ['./video-settings.component.less']
})
export class VideoSettingsComponent extends AppComponentBase implements OnInit {
  model: UpdateVideoSettingsDto = new UpdateVideoSettingsDto();
  CommentSetting = CommentSetting;
  isLoading = false;
  allowedVideoExtensions = fileUploadConfiguration.videoExtensions;
  EditField = EditField;
  VideoType = VideoType;
  DelayType = VideoDelayType;
  hasParent = false;

  editField: EditField;
  videoType: VideoType;
  lastVideoValue: string;
  specificDateValue: Date;
  datePickerConfig: BsDatepickerConfig;
  parentId: string;
  delayStatus = new GetDelayStatusDto();

  constructor(
    injector: Injector,
    private _router: Router,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.datePickerConfig.minDate = new Date();
    this._videoService.videoCreated$.subscribe(video => {
      if (video) {
        this.model.init(video);
        this.videoType = video.type;
        this.hasParent = !_.isNil(video.parentId);

        if (this.model.delayType) {
          switch (this.model.delayType) {
            case VideoDelayType.SpecificDate:
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
          this.model.delayType = VideoDelayType.Immediate;
        }

        if (this.hasParent) {
          this.parentId = video.parentId;
          this.getDelayStatus();
        }
      }
    });
  }

  get allDelaysVisible(): boolean {
    return this.delayStatus && this.delayStatus.isFirstVideoPublished && this.delayStatus.videoCount > 1;
  }

  ngOnInit(): void {
  }

  onBackClick(): void {
    this._router.navigate(['/app/videos/' + this.model.id + '/details']);
  }

  onFormSubmit(): void {
    this.isLoading = true;

    switch (this.model.delayType) {
      case VideoDelayType.SpecificDate:
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
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._videoService.videoCreated = response;
        setTimeout(() => {
          this.editField = undefined;
        });
      });
  }

  onEditClick(editField: EditField): void {
    this.editField = editField;
  }

  onDripTypeChange(): void {
    this.lastVideoValue = undefined;
    this.specificDateValue = undefined;
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
}

