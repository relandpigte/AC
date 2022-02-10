import { Component, Injector, OnInit } from '@angular/core';
import { TutorPortalService } from '@app/videos/tutor-portal/_services/tutor-portal.service';
import { AppComponentBase } from '@shared/app-component-base';
import { VideoDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-single-video',
  templateUrl: './single-video.component.html',
  styleUrls: ['./single-video.component.less']
})
export class SingleVideoComponent extends AppComponentBase implements OnInit {
  model = new VideoDto();

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._tutorPortalService.video$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.model = response;
        }
      });
  }

}
