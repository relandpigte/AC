import { Component, Injector, OnInit } from '@angular/core';
import { TutorPortalService } from '@app/videos/tutor-portal/_services/tutor-portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-video-series',
  templateUrl: './video-series.component.html',
  styleUrls: ['./video-series.component.less']
})
export class VideoSeriesComponent extends AppComponentBase implements OnInit {
  model = new VideoDto();
  selectedVideo = new VideoDto();

  videos: VideoDto[] = [];

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
    private _videosService: VideosServiceProxy,
  ) {
    super(injector);
    this._tutorPortalService.video$.subscribe(video => {
      if (video && video.id) {
        this.model = video;
        this.getVideos();
      }
    });
  }

  ngOnInit(): void {
  }

  onVideoClick(video: VideoDto): void {
    this.selectedVideo = video;
  }

  private getVideos(): void {
    this._videosService.getAllForSeries(
      this.model.id,
      undefined,
      undefined,
      undefined,
      100
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.videos = response.items;
        if (this.videos && this.videos.length) {
          this.selectedVideo = this.videos[0];
        }
      })
  }
}
