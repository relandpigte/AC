import { Component, OnInit , Input, Injector, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideoType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-teaching-video-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent extends AppComponentBase implements OnInit {

  @Input() videos: VideoDto[] = [];
  @Output() deleteVideo = new EventEmitter<string>();
  VideoType = VideoType;
  constructor(injector: Injector, private router: Router) {
    super(injector);
   }

  ngOnInit(): void {
  }

  navToUrl(url, id) {
    this.router.navigate([url , id]);
  }

  onDeleteClick(id) {
    this.deleteVideo.emit(id);
  }

}
