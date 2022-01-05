import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-video',
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.less']
})
export class CreateVideoComponent implements OnInit {
  @Input() model = new VideoDto();
  @Output() createVideo = new EventEmitter<VideoDto>();
  @Output() createCancel = new EventEmitter();
  isLoading = false;

  constructor(
    private _modal: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.createVideo.emit(this.model);
    this._modal.hide();
  }

  onCancelClick(): void {
    this.createCancel.emit();
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
