import { Component, OnInit } from '@angular/core';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { LandingPagesService } from '@shared/services/landing-pages.service';

@Component({
  selector: 'app-about-session',
  templateUrl: './about-session.component.html',
  styleUrls: ['./about-session.component.less']
})
export class AboutSessionComponent implements OnInit {

  shimmerType = ShimmerType;

  constructor(
    private _landingPageService: LandingPagesService
  ) { }

  get isLoading$() { return this._landingPageService.isLoading$; }

  ngOnInit(): void {
  }

}
