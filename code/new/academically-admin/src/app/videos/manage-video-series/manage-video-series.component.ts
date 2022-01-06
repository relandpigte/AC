import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, VideoType, VideoStatus } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CreateVideoComponent } from '../_components/create-video/create-video.component';

@Component({
  selector: 'app-manage-video-series',
  templateUrl: './manage-video-series.component.html',
  styleUrls: ['./manage-video-series.component.less'],
  animations: [appModuleAnimation()],
})
export class ManageVideoSeriesComponent extends AppComponentBase implements OnInit {
  parentId: string;
  model = new VideoDto();

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _videosService: VideosServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
        this.getVideoSeries();
      }
    });
  }

  ngOnInit(): void {
  }

  onAddVideoClick(): void {
    const newVideo = new VideoDto();
    newVideo.type = VideoType.SingleVideo;
    newVideo.status = VideoStatus.Draft;
    newVideo.name = '';
    newVideo.parentId = this.parentId;

    const modalSettings = this.defaultModalSettings as ModalOptions<CreateVideoComponent>;
    modalSettings.initialState = {
      model: newVideo,
    };
    const modal = this._modalService.show(CreateVideoComponent, modalSettings).content;
    modal.createVideo.subscribe(video => {
      this._videosService.create(video)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.notify.success(this.l('SavedSuccessfully'));
          this._router.navigate(['app/videos/video-series', response.parentId, response.id]);
        });
    });
  }

  private getVideoSeries(): void {
    this._videosService.get(this.parentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
      });
  }
}
