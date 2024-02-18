import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { DownloadComponentContent } from '@app/content-builder/_models/download-component-content';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-download-component-viewer',
  templateUrl: './download-component-viewer.component.html',
  styleUrls: ['./download-component-viewer.component.less']
})
export class DownloadComponentViewerComponent implements OnInit {
  @Input() component: DownloadComponentContent;

  constructor(
    private _uploadService: UploadService,
  ) { }

  ngOnInit(): void {
  }

  async getFileUrl(): Promise<string> {
    return await this._uploadService.getFileUrl(this.component.downloadDocument);
  }

  onDownloadClick(url: string): void {
    FileSaver.saveAs(url, this.component.downloadDocument.originalFileName);
  }
}
