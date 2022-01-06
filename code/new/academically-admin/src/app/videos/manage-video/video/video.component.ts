import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { FileParameter, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less']
})
export class VideoComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  id: string;
  videoDocumentId: string;
  allowedExtensions = fileUploadConfiguration.videoExtensions;
  defaultFile: DefaultFile;
  isLoading = false;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _videosService: VideosServiceProxy,
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

            const fileParameter = this.documentUploader.getFileParameterFromFiles()[0];
            this._videosService.updateDocument(this.id, fileParameter)
              .pipe(
                takeUntil(this.destroyed$),
                finalize(() => {
                  this.isLoading = false;
                })
              )
              .subscribe(response => {
                this.notify.success(this.l('SuccessfullyUploaded'));
                this.documentUploader.files = [];
                this.defaultFile = new DefaultFile();
                this.defaultFile.name = response.document.originalFileName;
                this.defaultFile.url = response.videoUrl;
                this.defaultFile.size = response.document.size;
                this.documentUploader.defaultFile = this.defaultFile;
                this.videoDocumentId = response.document.id;
              });
          }
        };

        videoEl.src = URL.createObjectURL(file);
      } else {
        this.defaultFile = undefined;
        if (this.videoDocumentId) {
          this.isLoading = true;
          this._videosService.removeDocument(this.id)
            .pipe(
              takeUntil(this.destroyed$),
              finalize(() => {
                this.isLoading = false;
              })
            )
            .subscribe(() => {
              this.notify.success(this.l('SuccessfullyRemoved'));
              this.defaultFile = undefined;
              this.videoDocumentId = undefined;
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
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = response.document.originalFileName;
          this.defaultFile.url = response.videoUrl;
          this.defaultFile.size = response.document.size;
          this.documentUploader.defaultFile = this.defaultFile;
          this.videoDocumentId = response.document.id;
        }
      });
  }
}
