import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { DocumentDto, DocumentType, FileParameter, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { UploadService } from '@app/_shared/services/upload.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less']
})
export class VideoComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  id: string;
  defaultFile: DefaultFile;

  allowedExtensions = fileUploadConfiguration.videoExtensions;
  document = new DocumentDto();
  isLoading = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _videosService: VideosServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
    route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getVideo();
      }
    });
  }

  ngOnInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        const file = files[0].data as File;
        const videoEl = document.createElement('video') as HTMLVideoElement;
        videoEl.preload = 'metadata';
        videoEl.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoEl.src);
          const duration = videoEl.duration;
          if (duration > 600) {
            this.notify.error(this.l('InvalidFileDurationUploadError', '10 Seconds'), this.l('InvalidFileUploadError'));
            this.documentUploader.files = [];
          } else {
            this.isLoading = true;
            this._uploadService.upload(file, DocumentType.Video, this.id)
              .pipe(
                takeUntil(this.destroyed$),
                finalize(() => {
                  this.isLoading = false;
                }),
              )
              .subscribe(response => {
                this.notify.success(this.l('SuccessfullyUploaded'));
                this.document = response;
                this.documentUploader.files = [];
                this.setDefaultFile();
              });
          }
        };

        videoEl.src = URL.createObjectURL(file);
      } else {
        this.defaultFile = undefined;
        if (this.document && this.document.id) {
          this.isLoading = true;
          this._uploadService.delete(this.document, this.id)
            .pipe(
              takeUntil(this.destroyed$),
              finalize(() => {
                this.isLoading = false;
              }),
            )
            .subscribe(() => {
              this.notify.success(this.l('SuccessfullyRemoved'));
              this.defaultFile = undefined;
              this.document = new DocumentDto();
            });
        }
      }
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
}
