import { Component, OnInit, Injector, Input } from '@angular/core';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { VideoDto, VideosServiceProxy, VideoDtoPagedResultDto, VideoStatus, VideoType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { VideoService } from '@app/videos/_services/video.service';
import * as _ from 'lodash';
import { UploadService } from '@app/_shared/services/upload.service';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

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
  thumbnailUrls: string[] = [];

  VideoStatus = VideoStatus;
  VideoType = VideoType;

  constructor(
    injector: Injector,
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
    private _uploadService: UploadService,
    private _modalDialogService: ModalDialogService
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

  onDeleteClick(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteVideoConfirmationMessage'),
      confirmCb: (): void => {
        this._videosService.delete(id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
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
        _.each(this.videos, async video => {
          this.thumbnailUrls[video.id] = await this._uploadService.getFileUrl(video.thumbnailDocument);
        });
        this.showPaging(result, pageNumber);
      });
  }
}
