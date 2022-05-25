import { Component, OnInit, Input, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { VideoComponentContent } from '@app/content-builder/_models/video-component-content';
import { UploadService } from '@app/_shared/services/upload.service';
import { DocumentType, FileParameter } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-video-component-editor',
  templateUrl: './video-component-editor.component.html',
  styleUrls: ['./video-component-editor.component.less']
})
export class VideoComponentEditorComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent) documentUploader: DocumentUploaderComponent;
  isLoading = false;

  videoExtensions = fileUploadConfiguration.videoExtensions;
  defaultFile: DefaultFile;
  videoComponentContent: VideoComponentContent = new VideoComponentContent();

  constructor(
    injector: Injector,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  @Input() set component(value: VideoComponentContent) {
    this.videoComponentContent = value;
    if (!this.videoComponentContent.isUrl) {
      setTimeout(() => {
        this.documentUploader.files = [];
        this.documentUploader.defaultFile = undefined;
        this.initUploader();
        if (this.videoComponentContent.videoDocument) {
          this.setDefaultFile();
        }
      });
    }
  }

  ngOnInit(): void {
  }

  onIsUrlToggle(): void {
    if (!this.videoComponentContent.isUrl) {
      setTimeout(() => {
        this.documentUploader.files = [];
        this.documentUploader.defaultFile = undefined;
        this.initUploader();
        if (this.videoComponentContent.videoDocument) {
          this.setDefaultFile();
        }
      });
    }
  }

  private initUploader(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        const file = files[0].data as File;
        this.isLoading = true;
        this._uploadService.upload(file, DocumentType.CourseSectionImage)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(response => {
            this.videoComponentContent.videoDocument = response;
            this.documentUploader.files = [];
            this.setDefaultFile();
          });
      } else {
        this.videoComponentContent.videoDocument = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      if (this.videoComponentContent.videoDocument) {
        this.isLoading = true;
        this._uploadService.delete(this.videoComponentContent.videoDocument)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.videoComponentContent.videoDocument = undefined;
          });
      }
    });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.videoComponentContent.videoDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.videoComponentContent.videoDocument);
    this.defaultFile.size = this.videoComponentContent.videoDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }
}
