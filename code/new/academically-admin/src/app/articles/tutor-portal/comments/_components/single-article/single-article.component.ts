import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto } from '@shared/service-proxies/service-proxies';
import { TutorPortalService } from '@app/articles/tutor-portal/_services/tutor-portal.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.less']
})
export class SingleArticleComponent extends AppComponentBase implements OnInit {
  model = new ArticleDto();

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._tutorPortalService.article$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response) {
          this.model = response;
        }
      });
  }

}
