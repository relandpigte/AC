import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticleType } from '@shared/service-proxies/service-proxies';
import { TutorPortalService } from '../_services/tutor-portal.service';

@Component({
  selector: 'app-tutor-portal-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less'],
  animations: [appModuleAnimation()],
})
export class CommentsComponent extends AppComponentBase implements OnInit {
  model = new ArticleDto();
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
    this._tutorPortalService.article$.subscribe(article => {
      if (article && article.id) {
        this.model = article;
      }
    });
  }

  ngOnInit(): void {
  }

}
