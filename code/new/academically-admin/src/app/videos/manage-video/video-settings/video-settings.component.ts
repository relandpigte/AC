import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { CommentSetting, UpdateVideoSettingsDto, VideosServiceProxy, VideoType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { VideoService } from '@app/videos/_services/video.service';

enum EditField {
  Comments = 1,
  Url = 2,
  Visibility = 3,
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
  editField: EditField;
  videoType: VideoType;
  EditField = EditField;
  VideoType = VideoType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
  ) {
    super(injector);
    this._videoService.videoCreated$.subscribe(video => {
      if (video) {
        this.model.init(video);
        this.videoType = video.type;
      }
    });
  }

  ngOnInit(): void {
  }

  onBackClick(): void {
    this._router.navigate(['/app/videos/' + this.model.id + '/details']);
  }

  onFormSubmit(): void {
    this.isLoading = true;

    this._videosService.updateSettings(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        setTimeout(() => {
          this.editField = undefined;
        });
      });
  }

  onEditClick(editField: EditField): void {
    this.editField = editField;
  }
}

