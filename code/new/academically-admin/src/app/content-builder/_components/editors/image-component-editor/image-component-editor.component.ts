import { Component, OnInit, Input, ViewChild, Injector } from '@angular/core';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentsServiceProxy, DocumentType, FileParameter } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { ImageComponentContent } from '../../../_models/image-component-content';

@Component({
  selector: 'app-image-component-editor',
  templateUrl: './image-component-editor.component.html',
  styleUrls: ['./image-component-editor.component.less']
})
export class ImageComponentEditorComponent extends AppComponentBase implements OnInit {
  @Input() cropperAspectRationWidth = 1;
  @Input() cropperAspectRationHeight = 1;
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  isLoading = false;

  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  defaultFile: DefaultFile;
  imageComponentContent: ImageComponentContent = new ImageComponentContent();

  constructor(
    injector: Injector,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  @Input() set component(value: ImageComponentContent) {
    this.documentUploader.files = [];
    this.documentUploader.defaultFile = undefined;
    this.imageComponentContent = value;
    if (this.imageComponentContent.imageDocument) {
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
            this.imageComponentContent.test = 'hello!';
            this.imageComponentContent.imageDocument = response
            this.documentUploader.files = [];
            this.setDefaultFile();
          });
      } else {
        this.imageComponentContent.imageDocument = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      if (this.imageComponentContent.imageDocument) {
        this.isLoading = true;
        this._uploadService.delete(this.imageComponentContent.imageDocument)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.imageComponentContent.imageDocument = undefined;
          })
      }
    });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.imageComponentContent.imageDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.imageComponentContent.imageDocument);
    this.defaultFile.size = this.imageComponentContent.imageDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }
}
