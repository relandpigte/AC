import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { OfficeComponentContent } from '@app/content-builder/_models/office-component-content';

@Component({
  selector: 'app-office-component-viewer',
  templateUrl: './office-component-viewer.component.html',
  styleUrls: ['./office-component-viewer.component.less']
})
export class OfficeComponentViewerComponent implements OnInit {
  @Input() component: OfficeComponentContent;

  constructor(
    private _uploadService: UploadService,
  ) { }

  ngOnInit(): void {
  }

  async getFileUrl(): Promise<string> {
    if (this.component.officeDocument) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${await this._uploadService.getFileUrl(this.component.officeDocument)}`;
    }
    return '';
  }
}
