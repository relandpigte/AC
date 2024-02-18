import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { VideoComponentContent } from '@app/content-builder/_models/video-component-content';

@Component({
  selector: 'app-video-component-viewer',
  templateUrl: './video-component-viewer.component.html',
  styleUrls: ['./video-component-viewer.component.less']
})
export class VideoComponentViewerComponent implements OnInit {
  @Input() component: VideoComponentContent;

  constructor(
    private _uploadService: UploadService,
  ) { }

  ngOnInit(): void {
  }

  async getFileUrl(): Promise<string> {
    return await this._uploadService.getFileUrl(this.component.videoDocument);
  }
}
