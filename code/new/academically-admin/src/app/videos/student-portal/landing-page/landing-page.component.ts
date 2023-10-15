import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateServicePurchaseDto, ServicesServiceProxy, ServicesType, VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent extends AppComponentBase implements OnInit {
  id: string;
  isLoading = false;
  video: VideoDto;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicesService: ServicesServiceProxy,
    private _videosService: VideosServiceProxy
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('video-id')) {
        this.id = paramMap.get('video-id');
      }
    });
  }

  ngOnInit(): void {
    this.initVideo();
  }

  onBuyNowClick(): void {
    this._servicesService.savePurchase(CreateServicePurchaseDto.fromJS({
      referenceId: this.id,
      creatorUserId: this.appSession.userId,
      creationTime: moment(),
      ownerId: this.video?.creatorUser?.id,
      type: ServicesType.Tutorial
    }))
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

  private initVideo(): void {
    this._videosService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(v => this.video = v);
  }
}
