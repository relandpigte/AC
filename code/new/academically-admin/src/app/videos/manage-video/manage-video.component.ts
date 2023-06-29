import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { VideosServiceProxy, VideoDto, VideoStatus } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { VideoService } from '../_services/video.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-manage-video',
  templateUrl: './manage-video.component.html',
  styleUrls: ['./manage-video.component.less'],
  animations: [appModuleAnimation()],
})
export class ManageVideoComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new VideoDto();
  VideoStatus = VideoStatus;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _videoService: VideoService,
    private _videosService: VideosServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getVideo();
      }
    });
  }

  ngOnInit(): void {
    this._videoService.videoCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.model = response;
        }
      });
  }

  onPublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('PublishVideoConfirmationMessage'),
      confirmCb: (): void => {
        this._videosService.updateStatus(this.model.id, VideoStatus.Published)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = VideoStatus.Published;
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onUnpublishClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('UnpublishVideoConfirmationMessage'),
      confirmCb: (): void => {
        this._videosService.updateStatus(this.model.id, VideoStatus.Draft)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.model.status = VideoStatus.Draft;
            this.l('SavedSuccessfully');
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private getVideo(): void {
    this._videosService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._videoService.videoCreated = response;
      });
  }
}
