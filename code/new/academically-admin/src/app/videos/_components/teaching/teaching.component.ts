import { Component, OnInit, Injector, Input } from '@angular/core';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { VideoDto, VideosServiceProxy, VideoDtoPagedResultDto, VideoStatus, VideoType } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { VideoService } from '@app/videos/_services/video.service';

class PagedVideoRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter?: string;
  statusFilter?: VideoStatus;
}

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.less']
})
export class TeachingComponent extends PagedListingComponentBase<VideoDto> implements OnInit {
  videos: VideoDto[] = [];
  searchFilter?: string;
  statusFilter?: number;

  VideoStatus = VideoStatus;
  VideoType = VideoType;

  constructor(
    injector: Injector,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
  ) {
    super(injector);
    this._videoService.videoCreated$.subscribe(video => {
      if (video) {
        this.refresh();
      }
    });
  }

  onClearFiltersClick(): void {
    this.searchFilter = undefined;
    this.statusFilter = undefined;
  }

  protected list(
    request: PagedVideoRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.userIdFilter = this.appSession.userId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._videosService
      .getAll(
        request.userIdFilter,
        request.searchFilter,
        request.statusFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: VideoDtoPagedResultDto) => {
        this.videos = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
