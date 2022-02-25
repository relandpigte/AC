import { Component, OnInit, Injector } from '@angular/core';
import { PreviewService } from '../../_services/preview.service';
import { VideoDto, StudentVideosServiceProxy, StudentVideoDto, VideoType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent extends AppComponentBase implements OnInit {
  model = new VideoDto();
  studentVideo = new StudentVideoDto();
  preview = true;

  VideoType = VideoType;

  constructor(
    injector: Injector,
    private _previewService: PreviewService,
    private _studentVideosService: StudentVideosServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._previewService.video$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this.getStudentVideo();
      });
    this._previewService.preview$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.preview = response;
      });
  }

  onSaveClick(): void {
    this._studentVideosService.create(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.getStudentVideo();
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
