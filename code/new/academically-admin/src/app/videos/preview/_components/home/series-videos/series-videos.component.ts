import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideosServiceProxy, StudentVideosServiceProxy, PricingType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-series-videos',
  templateUrl: './series-videos.component.html',
  styleUrls: ['./series-videos.component.less']
})
export class SeriesVideosComponent extends AppComponentBase implements OnInit {
  models: VideoDto[] = [];
  purchasedVideo: string[] = [];

  PricingType = PricingType;

  private _videoId: string;

  constructor(
    injector: Injector,
    private _videosService: VideosServiceProxy,
    private _studentVideosService: StudentVideosServiceProxy,
  ) {
    super(injector);
  }

  @Input() set videoId(value: string) {
    this._videoId = value;
    this.getSeriesVideos();
  }

  ngOnInit(): void {
  }

  private getSeriesVideos(): void {
    this._videosService.getOtherVideosForSeries(this._videoId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(reponses => {
        this.models = reponses;
        _.each(this.models, model => {
          if (model.pricingType !== PricingType.Free) {
            this.getStudentVideo(model.id);
          }
        });
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
}
