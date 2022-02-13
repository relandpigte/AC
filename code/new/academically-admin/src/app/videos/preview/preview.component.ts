import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, VideoType } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { UploadService } from '@app/_shared/services/upload.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
  animations: [appModuleAnimation()],
})
export class PreviewComponent extends AppComponentBase implements OnInit {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;

  model = new VideoDto();
  VideoType = VideoType;
  isSidebarHidden = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _location: Location,
    private _uploadService: UploadService,
    private _videosService: VideosServiceProxy,
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
  }

  onExitClick(): void {
    this._location.back();
  }

  private getVideo(): void {
    this._videosService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this.thumbnailUrl = this._uploadService.getFileUrl(response.thumbnailDocument);
        this.videoUrl = this._uploadService.getFileUrl(response.document);
      });
  }
}
