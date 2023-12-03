import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ServiceReviewDto, ServicesServiceProxy, VideoDto } from '@shared/service-proxies/service-proxies';
import { switchMap, takeUntil } from 'rxjs/operators';
import { PreviewService } from '../../_services/preview.service';

@Component({
  selector: 'app-sidebar-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class ReviewsComponent extends AppComponentBase implements OnInit {
  video: VideoDto;
  reviews: ServiceReviewDto[];

  constructor(
    injector: Injector,
    private _previewService: PreviewService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._previewService.video$
      .pipe(takeUntil(this.destroyed$))
      .pipe(switchMap(video => {
        this.video = video;
        return this._servicesService.getServiceReviews(this.video.id);
      }))
      .subscribe(reviews => {
        this.reviews = reviews;
      });
  }
}
