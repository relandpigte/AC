import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import * as _ from 'lodash';
import { takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { UploadService } from '@app/_shared/services/upload.service';
import { DocumentDto, FileParameter, VideoAttachmentDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less']
})
export class VideoComponent extends AppComponentBase implements OnInit, OnDestroy {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  id: string;
  defaultFile: DefaultFile;
  attachments: VideoAttachmentDto[] = [];

  allowedExtensions = fileUploadConfiguration.videoExtensions;
  document = new DocumentDto();
  isLoading = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _videosService: VideosServiceProxy,
    private _uploadService: UploadService,
    private _dragulaService: DragulaService
  ) {
    super(injector);
    this.id = route.snapshot.paramMap.get('id');

    this._dragulaService.createGroup('Videos', {
      revertOnSpill: true,
      moves: (el, source, handle) => handle.classList.contains('drag-handle')
    });

    this._dragulaService.dropModel('Videos').subscribe(({ sourceModel }): void => {
      this.updateVideoAttachmentDisplayOrder(sourceModel);
    });
  }

  get isAttachments(): boolean { return this.attachments?.length > 0; }

  ngOnInit(): void {
    this.getVideo();
    this.getAllVideoAttachments();
    // this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
    //   if (files && files.length) {
    //     const file = files[0].data as File;
    //     console.warn('file', file);
    //     const videoEl = document.createElement('video') as HTMLVideoElement;
    //     videoEl.preload = 'metadata';
    //     videoEl.onloadedmetadata = () => {
    //       window.URL.revokeObjectURL(videoEl.src);
    //       const duration = videoEl.duration;
    //       if (duration > 600) {
    //         this.notify.error(this.l('InvalidFileDurationUploadError', '10 Seconds'), this.l('InvalidFileUploadError'));
    //         this.documentUploader.files = [];
    //       } else {
    //         this.isLoading = true;
    //         this._uploadService.upload(file, DocumentType.Video, this.id)
    //           .pipe(
    //             takeUntil(this.destroyed$),
    //             finalize(() => {
    //               this.isLoading = false;
    //             }),
    //           )
    //           .subscribe(response => {
    //             this.notify.success(this.l('SuccessfullyUploaded'));
    //             this.document = response;
    //             this.documentUploader.files = [];
    //             this.setDefaultFile();
    //           });
    //       }
    //     };
    //
    //     videoEl.src = URL.createObjectURL(file);
    //   } else {
    //     this.defaultFile = undefined;
    //     if (this.document && this.document.id) {
    //       this.isLoading = true;
    //       this._uploadService.delete(this.document, this.id)
    //         .pipe(
    //           takeUntil(this.destroyed$),
    //           finalize(() => {
    //             this.isLoading = false;
    //           }),
    //         )
    //         .subscribe(() => {
    //           this.notify.success(this.l('SuccessfullyRemoved'));
    //           this.defaultFile = undefined;
    //           this.document = new DocumentDto();
    //         });
    //     }
    //   }
    // });
  }

  ngOnDestroy(): void {
    this._dragulaService.destroy('Videos');
  }

  onFileChanged(files: FileParameter[]): void {
    if (!files) {
      return;
    }

    this.isLoading = true;
    const file = files.pop();
    this._videosService.saveVideoAttachments(this.id, [file])
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => this.getAllVideoAttachments());
  }

  private updateVideoAttachmentDisplayOrder(attachments: VideoAttachmentDto[]): void {
    if (_.isEmpty(attachments)) {
      return;
    }

    this.isLoading = true;
    attachments.forEach((item, index): void => {
      this._videosService.updateVideoAttachmentDisplayOrder(item.id, index)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe();
    });
  }

  private getVideo(): void {
    this.isLoading = true;
    this._videosService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (response.document) {
          this.document = response.document;
          this.setDefaultFile();
        }
      });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.document.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.document);
    this.defaultFile.size = this.document.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }

  private getAllVideoAttachments(): void {
    this._videosService.getAllVideoAttachments(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(attachments => this.attachments = attachments);
  }
}
