import { Component, OnInit, Input, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { DocumentType, FileParameter } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { PdfComponentContent } from '@app/content-builder/_models/pdf-component-content';

@Component({
  selector: 'app-pdf-component-editor',
  templateUrl: './pdf-component-editor.component.html',
  styleUrls: ['./pdf-component-editor.component.less']
})
export class PdfComponentEditorComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  isLoading = false;

  pdfExtensions = ['.pdf'];
  defaultFile: DefaultFile;
  pdfComponentContent: PdfComponentContent = new PdfComponentContent();

  constructor(
    injector: Injector,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  @Input() set component(value: PdfComponentContent) {
    this.documentUploader.files = [];
    this.documentUploader.defaultFile = undefined;
    this.pdfComponentContent = value;
    if (this.pdfComponentContent.pdfDocument) {
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
            this.pdfComponentContent.pdfDocument = response;
            this.documentUploader.files = [];
            this.setDefaultFile();
          });
      } else {
        this.pdfComponentContent.pdfDocument = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      if (this.pdfComponentContent.pdfDocument) {
        this.isLoading = true;
        this._uploadService.delete(this.pdfComponentContent.pdfDocument)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe(() => {
            this.pdfComponentContent.pdfDocument = undefined;
          });
      }
    });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.pdfComponentContent.pdfDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.pdfComponentContent.pdfDocument);
    this.defaultFile.size = this.pdfComponentContent.pdfDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }
}
