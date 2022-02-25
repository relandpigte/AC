import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentVideosServiceProxy, StudentVideoDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent extends AppComponentBase implements OnInit {
  id: string;
  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _studentVideosService: StudentVideosServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('video-id')) {
        this.id = paramMap.get('video-id');
      }
    });
  }

  ngOnInit(): void {
  }

  onBuyNowClick(): void {
    const studentVideo = new StudentVideoDto();
    studentVideo.videoId = this.id;
    studentVideo.saveOnly = false;
    this._studentVideosService.create(studentVideo)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this._router.navigate([`/app/videos/student-portal/${this.id}/portal`]);
      });
  }
}
