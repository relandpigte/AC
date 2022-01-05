import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VideoTemplate } from '../../_models/video-template';
import { VideoType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-choose-video-template',
  templateUrl: './choose-video-template.component.html',
  styleUrls: ['./choose-video-template.component.less']
})
export class ChooseVideoTemplateComponent implements OnInit {
  @Output() selectTemplate = new EventEmitter<VideoTemplate>();
  templates: VideoTemplate[] = [];

  constructor(
    private _modal: BsModalRef,
  ) {
    const singleVideoTemplate = new VideoTemplate();
    singleVideoTemplate.type = VideoType.SingleVideo;
    singleVideoTemplate.name = 'SingleVideo';
    singleVideoTemplate.description = 'SingleVideoDescription';
    this.templates.push(singleVideoTemplate);

    const videoSeriesTemplate = new VideoTemplate();
    videoSeriesTemplate.type = VideoType.VideoSeries;
    videoSeriesTemplate.name = 'VideoSeries';
    videoSeriesTemplate.description = 'VideoSeriesDescription';
    this.templates.push(videoSeriesTemplate);
  }

  ngOnInit(): void {
  }

  onTemplateSelect(template: VideoTemplate): void {
    if (template.type === VideoType.SingleVideo) {
      this.selectTemplate.emit(template);
      this._modal.hide();
    }
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
