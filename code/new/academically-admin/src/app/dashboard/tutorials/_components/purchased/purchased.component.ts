import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';

@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  tutorials: VideoDto[] = [];
  unwatchedTutorials: VideoDto[] = [];
  watchedTutorials: VideoDto[] = [];

  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _videoService: VideosServiceProxy
  ) {
    super(injector);
  }

  get isLoading$(): Observable<boolean> { return this._dashboardPageService.isLoading$; }
  get totalTutorials(): number { return this.tutorials?.length; }
  get totalUnwatchedTutorials(): number { return this.unwatchedTutorials?.length; }
  get totalWatchedTutorials(): number { return this.watchedTutorials?.length; }

  ngOnInit(): void {
    this.initTutorials();
  }

  private initTutorials(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._videoService.getEnrolledVideosByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(videos => {
        this.tutorials = videos;
      });
  }
}
