import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends AppComponentBase implements OnInit {

  @Input() videos: VideoDto[] = [];
  @Output() visitVideos = new EventEmitter<VideoDto>();
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onVisitVideoClick(video: VideoDto) {
    this.visitVideos.emit(video);
  }
}
