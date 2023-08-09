import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ChooseVideoTemplateComponent } from './_components/choose-video-template/choose-video-template.component';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { CreateVideoComponent } from './_components/create-video/create-video.component';
import { VideosServiceProxy, VideoDto, VideoStatus, VideoType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { VideoTemplate } from './_models/video-template';
import { VideoService } from './_services/video.service';
import { Router } from '@angular/router';
import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.less'],
  animations: [appModuleAnimation()],
})
export class VideosComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _videoService: VideoService,
    private _router: Router,
    private _videosService: VideosServiceProxy,
    private _dashboardService: DashboardService
  ) {
    super(injector);
  }

  get dashboardServiceView() { return DashboardServiceView; }
  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get defaultUserView(): DashboardServiceView { return this._dashboardService.getUserView(); }

  ngOnInit(): void {
    this._dashboardService.setUserView(DashboardServiceView.learner);
  }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
  }

  onNewVideoClick(): void {
    this.showChooseTemplateModal();
  }

  private showChooseTemplateModal(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseVideoTemplateComponent>;
    const modal = this._modalService.show(ChooseVideoTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: VideoTemplate) => {
      const newVideo = new VideoDto();
      newVideo.type = template.type;
      newVideo.status = VideoStatus.Draft;
      newVideo.name = '';

      const createVideoModalSettings = this.defaultModalSettings as ModalOptions<CreateVideoComponent>;
      createVideoModalSettings.initialState = {
        model: newVideo,
      };
      const createVideoModal = this._modalService.show(CreateVideoComponent, createVideoModalSettings).content;
      createVideoModal.createCancel.subscribe(() => {
        this.showChooseTemplateModal();
      });
      createVideoModal.createVideo.subscribe(video => {
        this._videosService.create(video)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(response => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._videoService.videoCreated = video;
            if (response.type === VideoType.SingleVideo) {
              this._router.navigate(['/app/videos/', response.id]);
            } else {
              this._router.navigate(['/app/videos/video-series/', response.id]);
            }
          });
      });
    });
  }
}
