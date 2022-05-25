import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { PdfComponentContent } from '@app/content-builder/_models/pdf-component-content';

@Component({
  selector: 'app-pdf-component-viewer',
  templateUrl: './pdf-component-viewer.component.html',
  styleUrls: ['./pdf-component-viewer.component.less']
})
export class PdfComponentViewerComponent implements OnInit {
  @Input() component: PdfComponentContent;

  constructor(
    private _uploadService: UploadService,
  ) { }

  ngOnInit(): void {
  }

  getFileUrl(): string {
    if (this.component.pdfDocument) {
      return `https://docs.google.com/viewer?url=${this._uploadService.getFileUrl(this.component.pdfDocument)}&embedded=true`;
    }
    return '';
  }
}
