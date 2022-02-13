import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideoType } from '@shared/service-proxies/service-proxies';
import { TutorPortalService } from '../_services/tutor-portal.service';

@Component({
  selector: 'app-tutor-portal-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less'],
  animations: [appModuleAnimation()],
})
export class CommentsComponent extends AppComponentBase implements OnInit {
  model = new VideoDto();
  VideoType = VideoType;

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this._tutorPortalService.video$.subscribe(video => {
      if (video && video.id) {
        this.model = video;
      }
    })
  }

  ngOnInit(): void {
  }

}
