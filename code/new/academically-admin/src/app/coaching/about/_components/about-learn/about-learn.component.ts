import { Component, OnInit } from '@angular/core';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-about-learn',
  templateUrl: './about-learn.component.html',
  styleUrls: ['./about-learn.component.less']
})
export class AboutLearnComponent implements OnInit {

  shimmerType = ShimmerType;

  constructor(
    private _landingPageService: LandingPagesService
  ) { }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }

}
