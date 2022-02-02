import { Component, Injector, OnInit } from '@angular/core';
import { TutorPortalService } from '@app/videos/tutor-portal/_services/tutor-portal.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto, VideoType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less'],
  animations: [appModuleAnimation()],
})
export class OverviewComponent extends AppComponentBase implements OnInit {
  model = new VideoDto();
  VideoType = VideoType;

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this._tutorPortalService.video$.subscribe(response => {
      this.model = response;
    });
  }

  ngOnInit(): void {
  }
}
