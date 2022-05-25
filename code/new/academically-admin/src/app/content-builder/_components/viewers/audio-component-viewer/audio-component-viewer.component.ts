import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from '@app/_shared/services/upload.service';
import { AudioComponentContent } from '@app/content-builder/_models/audio-component-content';

@Component({
  selector: 'app-audio-component-viewer',
  templateUrl: './audio-component-viewer.component.html',
  styleUrls: ['./audio-component-viewer.component.less']
})
export class AudioComponentViewerComponent implements OnInit {
  @Input() component: AudioComponentContent;

  constructor(
    private _uploadService: UploadService,
  ) { }

  ngOnInit(): void {
  }

  getFileUrl(): string {
    return this._uploadService.getFileUrl(this.component.audioDocument);
  }
}
