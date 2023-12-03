import { Component, OnInit, Input, Injector, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideosServiceProxy, VideoDto, PricingType, StudentVideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-related',
  templateUrl: './related.component.html',
  styleUrls: ['./related.component.less']
})
export class RelatedComponent extends AppComponentBase implements OnInit {
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
    this.getRelatedVideos();
  }

  ngOnInit(): void {
  }

  private getRelatedVideos(): void {
    this._videosService.getAllRelated(this._videoId)
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
