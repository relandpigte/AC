import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticleType } from '@shared/service-proxies/service-proxies';
import { TutorPortalService } from '../_services/tutor-portal.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less'],
  animations: [appModuleAnimation()],
})
export class OverviewComponent extends AppComponentBase implements OnInit {
  model = new ArticleDto();
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this._tutorPortalService.article$.subscribe(response => {
      this.model = response;
    });
  }

  ngOnInit(): void {
  }
}
