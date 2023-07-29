import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { RatingExperienceType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-review-stats',
  templateUrl: './review-stats.component.html',
  styleUrls: ['./review-stats.component.less']
})
export class ReviewStatsComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  protected readonly RatingExperienceType = RatingExperienceType;
}
