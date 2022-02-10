import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '@app/_shared/services/upload.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, VideoType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { TutorPortalService } from './_services/tutor-portal.service';

@Component({
  selector: 'app-tutor-portal',
  templateUrl: './tutor-portal.component.html',
  styleUrls: ['./tutor-portal.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorPortalComponent extends AppComponentBase implements OnInit {
  id: string;
  thumbnailUrl: string;
  model = new VideoDto();
  VideoType = VideoType;
  isSidebarHidden = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _tutorPortalService: TutorPortalService,
    private _videosService: VideosServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getVideo();
      }
    });
    this._tutorPortalService.video$.subscribe(response => {
      this.model = response;
    });
  }

  ngOnInit(): void {
  }

  get title(): string {
    return this.model.type === VideoType.SingleVideo ? 'Video' : 'VideoSeries';
  }

  private getVideo(): void {
    this._videosService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._tutorPortalService.video = response;
        this.thumbnailUrl = this._uploadService.getFileUrl(response.thumbnailDocument);
      });
  }
}
