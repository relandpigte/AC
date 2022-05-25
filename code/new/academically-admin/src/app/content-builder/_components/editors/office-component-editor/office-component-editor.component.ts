import { Component, OnInit, Input, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { OfficeComponentContent } from '@app/content-builder/_models/office-component-content';
import { UploadService } from '@app/_shared/services/upload.service';
import { DocumentType, FileParameter } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-office-component-editor',
  templateUrl: './office-component-editor.component.html',
  styleUrls: ['./office-component-editor.component.less']
})
export class OfficeComponentEditorComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  isLoading = false;

  officeExtensions = fileUploadConfiguration.msOfficeExtensions;
  defaultFile: DefaultFile;
  officeComponentContent: OfficeComponentContent = new OfficeComponentContent();

  constructor(
    injector: Injector,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  @Input() set component(value: OfficeComponentContent) {
    this.documentUploader.files = [];
    this.documentUploader.defaultFile = undefined;
    this.officeComponentContent = value;
    if (this.officeComponentContent.officeDocument) {
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
            this.officeComponentContent.officeDocument = response;
            this.documentUploader.files = [];
            this.setDefaultFile();
          });
      } else {
        this.officeComponentContent.officeDocument = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      if (this.officeComponentContent.officeDocument) {
        this.isLoading = true;
        this._uploadService.delete(this.officeComponentContent.officeDocument)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.officeComponentContent.officeDocument = undefined;
          });
      }
    });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.officeComponentContent.officeDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.officeComponentContent.officeDocument);
    this.defaultFile.size = this.officeComponentContent.officeDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }
}
