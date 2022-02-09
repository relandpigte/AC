import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { ImageComponentContent } from '../../../_models/image-component-content';

@Component({
  selector: 'app-image-component-viewer',
  templateUrl: './image-component-viewer.component.html',
  styleUrls: ['./image-component-viewer.component.less']
})
export class ImageComponentViewerComponent implements OnInit {
  @Input() component: ImageComponentContent;

  constructor(
    private _uploadService: UploadService,
  ) { }

  ngOnInit(): void {
  }

  getFileUrl(): string {
    return this._uploadService.getFileUrl(this.component.imageDocument);
  }
}
