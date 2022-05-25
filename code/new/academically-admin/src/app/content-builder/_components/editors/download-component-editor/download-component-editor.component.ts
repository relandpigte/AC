import { Component, OnInit, Input, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { UploadService } from '@app/_shared/services/upload.service';
import { DocumentType, FileParameter } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { DownloadComponentContent } from '@app/content-builder/_models/download-component-content';

@Component({
  selector: 'app-download-component-editor',
  templateUrl: './download-component-editor.component.html',
  styleUrls: ['./download-component-editor.component.less']
})
export class DownloadComponentEditorComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  isLoading = false;

  fileExtensions = fileUploadConfiguration.allowedFileExtensions;
  defaultFile: DefaultFile;
  imageComponentContent: DownloadComponentContent = new DownloadComponentContent();

  constructor(
    injector: Injector,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  @Input() set component(value: DownloadComponentContent) {
    this.documentUploader.files = [];
    this.documentUploader.defaultFile = undefined;
    this.imageComponentContent = value;
    if (this.imageComponentContent.downloadDocument) {
      this.setDefaultFile();
    }
  }

  ngOnInit(): void {
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
            this.imageComponentContent.downloadDocument = response;
            this.documentUploader.files = [];
            this.setDefaultFile();
          });
      } else {
        this.imageComponentContent.downloadDocument = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      if (this.imageComponentContent.downloadDocument) {
        this.isLoading = true;
        this._uploadService.delete(this.imageComponentContent.downloadDocument)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.imageComponentContent.downloadDocument = undefined;
          });
      }
    });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.imageComponentContent.downloadDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.imageComponentContent.downloadDocument);
    this.defaultFile.size = this.imageComponentContent.downloadDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }
}
