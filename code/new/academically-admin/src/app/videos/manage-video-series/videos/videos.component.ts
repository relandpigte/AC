import { Component, OnInit, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { VideoStatus, VideoDto, VideoType, VideosServiceProxy, VideoDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { VideoService } from '@app/videos/_services/video.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

class PagedVideoRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: VideoStatus;
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.less']
})
export class VideosComponent extends PagedListingComponentBase<VideoDto> implements OnInit {
  parentId: string;
  videos: VideoDto[] = [];
  searchFilter?: string;
  statusFilter?: number;

  VideoStatus = VideoStatus;
  VideoType = VideoType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
  ) {
    super(injector);
    this._videoService.videoCreated$.subscribe(video => {
      if (video) {
        this.refresh();
      }
    });
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('parent-id')) {
        this.parentId = paramMap.get('parent-id');
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
    request.parentIdFilter = this.parentId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._videosService
      .getAllForSeries(
        request.parentIdFilter,
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
