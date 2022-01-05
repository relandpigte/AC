import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { VideosServiceProxy, VideoDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-video',
  templateUrl: './manage-video.component.html',
  styleUrls: ['./manage-video.component.less'],
  animations: [appModuleAnimation()],
})
export class ManageVideoComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new VideoDto();

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _videosService: VideosServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.getVideo();
  }

  private getVideo(): void {
    this._videosService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
      });
  }
}
