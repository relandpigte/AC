import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ServiceReviewDto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { switchMap, takeUntil } from 'rxjs/operators';
import { PreviewService } from '../../_services/preview.service';

@Component({
  selector: 'app-sidebar-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class ReviewsComponent extends AppComponentBase implements OnInit {
  article: ArticleDto;
  reviews: ServiceReviewDto[];

  constructor(
    injector: Injector,
    private _previewService: PreviewService,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._previewService.article$
      .pipe(takeUntil(this.destroyed$))
      .pipe(switchMap(article => {
        this.article = article;
        return this._servicesService.getServiceReviews(this.article.id, undefined);
      }))
      .subscribe(reviews => {
        this.reviews = reviews;
      });
  }
}
