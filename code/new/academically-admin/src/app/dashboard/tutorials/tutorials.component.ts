import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { DashboardService, DashboardServiceView } from '@app/dashboard/_services/dashboard.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { ChooseVideoTemplateComponent } from '@app/videos/_components/choose-video-template/choose-video-template.component';
import { VideoTemplate } from '@app/videos/_models/video-template';
import { ServicesType, VideoDto, VideosServiceProxy, VideoStatus, VideoType } from '@shared/service-proxies/service-proxies';
import { CreateVideoComponent } from '@app/videos/_components/create-video/create-video.component';
import { VideoService } from '@app/videos/_services/video.service';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorialsComponent extends AppComponentBase implements OnInit, AfterViewInit {
  shimmerType = ShimmerType;
  readonly DashboardServiceView = DashboardServiceView;
  readonly ServicesType = ServicesType;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _dashboardService: DashboardService,
    private _dashboardPageService: DashboardPagesService,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {
    super(injector);
  }

  get switchButtonText(): string { return this._dashboardService.switchButtonText(); }
  get userView(): string { return this._dashboardService.getUserView(); }
  get isLearnerView(): boolean { return this._dashboardService.getUserView() === DashboardServiceView.learner; }
  get isLoading$() { return this._dashboardPageService.isLoading$; }

  ngOnInit(): void {
    setTimeout(() => this._dashboardPageService.setIsLoading(false), 3000);
  }

  ngAfterViewInit(): void {
    this._cdr.detectChanges();
  }

  handleSwitchView(): void {
    this._dashboardService.handleSwitchView();
    this._cdr.detectChanges();
  }

  handleCreateVideo(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ChooseVideoTemplateComponent>;
    const modal = this._modalService.show(ChooseVideoTemplateComponent, modalSettings).content;
    modal.selectTemplate.subscribe((template: VideoTemplate): void => {
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
        this.handleCreateVideo();
      });
      createVideoModal.createVideo.subscribe(video => {
        this._videosService.create(video)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(async response => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._videoService.videoCreated = video;
            if (response.type === VideoType.SingleVideo) {
              await this._router.navigate(['/app/videos/', response.id]);
            } else {
              await this._router.navigate(['/app/videos/video-series/', response.id]);
            }
          });
      });
    });
  }
}
