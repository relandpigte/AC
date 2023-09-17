import { Component, Input, OnInit } from '@angular/core';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';
import { CoachingDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-about-learn',
  templateUrl: './about-learn.component.html',
  styleUrls: ['./about-learn.component.less']
})
export class AboutLearnComponent implements OnInit {
  shimmerType = ShimmerType;

  @Input() data: CoachingDto;

  constructor(
    private _landingPageService: LandingPagesService
  ) { }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }

}
