import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, VideoType } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { UploadService } from '@app/_shared/services/upload.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PreviewService } from './_services/preview.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
  animations: [appModuleAnimation()],
})
export class PreviewComponent extends AppComponentBase implements OnInit {
  videoUrl: string;
  thumbnailUrl: string;

  model = new VideoDto();
  VideoType = VideoType;
  isSidebarHidden = false;
  isPreview = false;

  private _id: string;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _uploadService: UploadService,
    private _videosService: VideosServiceProxy,
    private _previewService: PreviewService,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.isPreview = true;
        this.id = paramMap.get('id');
      }
    });
  }

  @Input() set id(value: string) {
    this._id = value;
    this._previewService.preview = this.isPreview;
    this.getVideo();
  }

  ngOnInit(): void {
  }

  onExitClick(): void {
    if (this.isPreview) {
      this._location.back();
    } else {
      this._router.navigate(['/app/home/videos']);
    }
  }

  private getVideo(): void {
    this._videosService.get(this._id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this.thumbnailUrl = this._uploadService.getFileUrl(response.thumbnailDocument);
        this.videoUrl = this._uploadService.getFileUrl(response.document);
        this._previewService.video = response;
      });
  }
}
