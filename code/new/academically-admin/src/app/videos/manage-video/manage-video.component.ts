import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { VideosServiceProxy, VideoDto, VideoStatus, ServicesType } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { VideoService } from '../_services/video.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { finalize } from '@node_modules/rxjs/operators';
import { CommunityPostService } from '@shared/services/community-post.service';
import { MenuItem, ServiceCreateService } from '@shared/services/service-create.service';

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
  defaultMenuItem: MenuItem;
  menuItems: MenuItem[] = [
    {
      id: 'playlist',
      label: 'Playlist',
      icon: 'assets/img/service/create/play-circle.svg',
      iconHover: 'assets/img/service/create/play-circle-hover.svg',
      infoText: 'Drag videos into the drop zone to create the playlist for your tutorial. You can rearrange the order using the drag handle and edit the video by clicking on the arrow next to each video.'
    },
    {
      id: 'details',
      label: 'Details',
      icon: 'assets/img/service/create/list.svg',
      iconHover: 'assets/img/service/create/list-hover.svg',
      infoText: 'Here, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'assets/img/service/create/settings.svg',
      iconHover: 'assets/img/service/create/settings-hover.svg',
      infoText: 'Here 4, you can input all the details for your article. This information will be visible to potential clients, so keep it clear and informative.'
    },
  ];

  readonly ServicesType = ServicesType;
  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _videoService: VideoService,
    private _videosService: VideosServiceProxy,
    private _communityPostService: CommunityPostService,
    private _modalDialogService: ModalDialogService,
    private _serviceCreateService: ServiceCreateService
  ) {
    super(injector);
    this._serviceCreateService.setDefaultMenuItem(this.menuItems[0]);
    this._serviceCreateService.getDefaultMenuItem().subscribe(x => this.defaultMenuItem = x);
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
            this.notify.success(this.l('SavedSuccessfully'));
            this._communityPostService.hasNewItemToShare({ serviceId: this.model.id });
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
            this.notify.success(this.l('SavedSuccessfully'));
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
