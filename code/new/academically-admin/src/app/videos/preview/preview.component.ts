import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, VideoType, GetStudentVideoDto, StudentVideosServiceProxy, PricingType } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { UploadService } from '@app/_shared/services/upload.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PreviewService } from './_services/preview.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
  animations: [appModuleAnimation()],
})
export class PreviewComponent extends AppComponentBase implements OnInit {
  thumbnailUrl: string;

  model = new VideoDto();
  VideoType = VideoType;
  isSidebarHidden = false;
  isPreview = false;
  studentVideo = new GetStudentVideoDto();

  private _id: string;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _uploadService: UploadService,
    private _videosService: VideosServiceProxy,
    private _previewService: PreviewService,
    private _studentVideosService: StudentVideosServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.isPreview = true;
        this.id = paramMap.get('id');
      }
    });
    this._previewService.studentVideo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.studentVideo = response;
        }
      });
  }

  @Input() set id(value: string) {
    this._id = value;
    this._previewService.preview = this.isPreview;
    this.getVideo();
  }

  get shouldShowVideo(): boolean {
    return this.isPreview || this.model.pricingType === PricingType.Free || (!this.isPreview && !_.isEmpty(this.studentVideo));
  }

  get videoUrl(): string {
    return this._uploadService.getFileUrl(this.model.document);
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
        this._previewService.video = response;
        if (!this.isPreview) {
          this.getStudentVideo();
        }
      });
  }

  private getStudentVideo(): void {
    this._studentVideosService.getByVideo(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.studentVideo = response;
      });
  }
}
