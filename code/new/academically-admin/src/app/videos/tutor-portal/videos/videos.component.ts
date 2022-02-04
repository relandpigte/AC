import { Component, Injector, OnInit } from '@angular/core';
import { VideoService } from '@app/videos/_services/video.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { VideoStatus, VideoDto, VideoType, VideosServiceProxy, VideoDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { TutorPortalService } from '../_services/tutor-portal.service';

class PagedVideoRequestDto extends PagedAndSortedRequestDto {
  parentIdFilter: string;
  searchFilter?: string;
  statusFilter?: VideoStatus;
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.less'],
  animations: [appModuleAnimation()],
})
export class VideosComponent extends PagedListingComponentBase<VideoDto> implements OnInit {
  videos: VideoDto[] = [];
  searchFilter?: string;
  statusFilter?: number;

  model = new VideoDto();
  VideoStatus = VideoStatus;
  VideoType = VideoType;

  constructor(
    injector: Injector,
    private _videosService: VideosServiceProxy,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this._tutorPortalService.video$.subscribe(video => {
      if (video && video.id) {
        this.model = video;
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
    request.parentIdFilter = this.model.id,
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
