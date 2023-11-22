import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { VideoDto, VideosServiceProxy, VideoStatus } from '@shared/service-proxies/service-proxies';

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

  handleArchive(id: string): void {
    this._videoService.updateStatus(id, VideoStatus.Archived)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((): void => {
        this.notify.success(this.l('SavedSuccessfully'));
        const data = this.draftVideos.find(x => x.id === id);
        if (!data) {
          return;
        }

        this.draftVideos = this.draftVideos?.filter(x => x.id !== id);
        data.status = VideoStatus.Archived;
        this.archiveVideos.push(data);
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
}
