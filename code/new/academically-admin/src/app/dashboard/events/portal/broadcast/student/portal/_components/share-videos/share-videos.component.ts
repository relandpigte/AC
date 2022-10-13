import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';

@Component({
  selector: 'app-share-videos',
  templateUrl: './share-videos.component.html',
  styleUrls: ['./share-videos.component.less']
})
export class ShareVideosComponent extends AppComponentBase implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  @Output() shareVideo = new EventEmitter<File>();
  @Output() unshareVideo = new EventEmitter();

  showShareVideos = false;
  videos: File[] = [];
  videoThumbnails: string[] = [];
  selectedVideo: File;
  sharingVideo = false;

  constructor(
    injector: Injector,
    private _sanitizer: DomSanitizer,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  public uploadFiles(): void {
    (this.fileInput.nativeElement as HTMLInputElement).click();
  }

  onFileChange(): void {
    const fileInput = (this.fileInput.nativeElement as HTMLInputElement);
    if (fileInput.files && fileInput.files.length) {
      setTimeout(() => {
        _.each(fileInput.files, file => {
          this.videos.push(file);
          this.videoThumbnails[file.name] = this._sanitizer.bypassSecurityTrustUrl(`${URL.createObjectURL(file)}#t=5`);
        });
        this.showShareVideos = true;
      });
    }
  }

  onSelectClick(file: File): void {
    this.selectedVideo = file;
  }

  onShareClick(): void {
    this.sharingVideo = true;
    this.shareVideo.emit(this.selectedVideo);
  }

  onCancelClick(): void {
    this.selectedVideo = undefined;
  }

  onUnshareClick(): void {
    this.sharingVideo = false;
    this.unshareVideo.emit();
  }
}
