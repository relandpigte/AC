import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from '@app/videos/_services/video.service';
import { UploadService } from '@app/_shared/services/upload.service';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { VideoDto, VideoStatus, VideoType, VideosServiceProxy, VideoDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.less']
})
export class VideosComponent extends PagedListingComponentBase<VideoDto> implements OnInit {
  videos: VideoDto[] = [];
  searchFilter?: string;
  statusFilter?: number;
  thumbnailUrls: string[] = [];

  VideoStatus = VideoStatus;
  VideoType = VideoType;

  headers: TableHeaderSortData[] = [
    { title: 'Name', sortColumn: 'name' },
    { title: '' },
  ];

  constructor(
    injector: Injector,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
    private _uploadService: UploadService,
    private router: Router,
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

  onViewVideos(event: VideoDto) {
    this.router.navigate(['app/videos/student-portal' , event.id]);
  }

  protected list(
    request: PagedAndSortedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._videosService
      .getAllForHome(
        request.maxResultCount,
        request.skipCount,
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: VideoDtoPagedResultDto) => {
        this.videos = result.items;
        _.each(this.videos, video => {
          this.thumbnailUrls[video.id] = this._uploadService.getFileUrl(video.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
