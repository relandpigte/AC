import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import {
  CoachingDto,
  CoachingStatus,
  VideoDto,
  VideosServiceProxy,
  VideoStatus
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.less']
})
export class CreatedComponent extends AppComponentBase implements OnInit {
  activeVideos: VideoDto[] = [];
  draftVideos: VideoDto[] = [];
  archiveVideos: VideoDto[] = [];
  shimmerType = ShimmerType;

  readonly VideoStatus = VideoStatus;
  protected readonly fns = {
    [VideoStatus.Draft]: 'draftVideos',
    [VideoStatus.Published]: 'activeVideos',
    [VideoStatus.Archived]: 'archiveVideos'
  };
  constructor(
    injector: Injector,
    private _dashboardPageService: DashboardPagesService,
    private _videoService: VideosServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalActiveVideos(): number { return this.activeVideos?.length; }
  get totalDraftVideos(): number { return this.draftVideos?.length; }
  get totalArchivedVideos(): number { return this.archiveVideos?.length; }

  ngOnInit(): void {
    this.loadVideos();
  }

  async onRedirection(e: any, id: string): Promise<void> {
    const tags = ['I', 'A'];
    if (tags.includes(e.target.tagName)) {
      return;
    }

    await this._router.navigate(['app/videos/student-portal', id, 'portal']);
  }

  onUpdateStatus(data: VideoDto, changeToStatus: VideoStatus): void {
    const { id, status } = data;
    const service = this[this.fns[status]]?.find(x => x.id === id);
    if (!service) {
      return;
    }
    this._videoService.updateStatus(id, changeToStatus)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.notify.success(this.l('SavedSuccessfully'));
        this[this.fns[status]] = this[this.fns[status]]?.filter(x => x.id !== id);
        service.status = changeToStatus;
        this[this.fns[changeToStatus]].push(service);
      });
  }

  private loadVideos(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._videoService.getAll(this.appSession.userId, undefined, undefined, undefined, undefined)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this._dashboardPageService.isLoading$.next(false)))
      .subscribe(videos => {
        this.activeVideos = videos?.items.filter(a => a.status === 1);
        this.draftVideos = videos?.items.filter(a => a.status === 0);
        this.archiveVideos = videos?.items.filter(a => a.status === 2);
      });
  }

  protected readonly CoachingStatus = CoachingStatus;
}
