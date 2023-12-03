import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, StudentVideosServiceProxy, PricingType, StudentVideoDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, take } from 'rxjs/operators';
import * as _ from 'lodash';
import { PreviewService } from '@app/videos/preview/_services/preview.service';

@Component({
  selector: 'app-series-videos',
  templateUrl: './series-videos.component.html',
  styleUrls: ['./series-videos.component.less']
})
export class SeriesVideosComponent extends AppComponentBase implements OnInit {
  @Input() parentVideo = new VideoDto();

  models: VideoDto[] = [];
  purchasedVideo: string[] = [];

  PricingType = PricingType;

  private _videoId: string;

  constructor(
    injector: Injector,
    private _videosService: VideosServiceProxy,
    private _studentVideosService: StudentVideosServiceProxy,
    private _previewService: PreviewService,
  ) {
    super(injector);
  }

  @Input() set videoId(value: string) {
    this._videoId = value;
    this.getSeriesVideos();
    this._previewService.studentVideo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.videoId === this.parentVideo.id) {
          this.getStudentVideos();
        }
      });
  }

  ngOnInit(): void {
  }

  onPurchaseClick(video: VideoDto): void {
    this.message.confirm(this.l('PurchaseVideoConfirmationMessage'), undefined,
      (result => {
        if (result) {
          const studentVideo = new StudentVideoDto();
          studentVideo.videoId = video.id;
          studentVideo.saveOnly = false;
          this._studentVideosService.create(studentVideo)
            .pipe(
              takeUntil(this.destroyed$),
            )
            .subscribe(response => {
              this.purchasedVideo[video.id] = true;
              this.notify.success(this.l('VideoPurchaseSuccessMessage'));
            });
        }
      }));
  }

  private getSeriesVideos(): void {
    this._videosService.getOtherVideosForSeries(this._videoId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(reponses => {
        this.models = reponses;
        this.getStudentVideos();
      });
  }

  private getStudentVideo(videoId: string): void {
    this._studentVideosService.getByVideo(videoId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id) {
          this.purchasedVideo[videoId] = true;
        }
      });
  }

  private getStudentVideos(): void {
    _.each(this.models, model => {
      if (model.pricingType !== PricingType.Free) {
        this.getStudentVideo(model.id);
      }
    });
  }
}
