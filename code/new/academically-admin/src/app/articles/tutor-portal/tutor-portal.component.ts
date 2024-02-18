import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '@app/_shared/services/upload.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy, ArticleType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { TutorPortalService } from './_services/tutor-portal.service';

@Component({
  selector: 'app-tutor-portal',
  templateUrl: './tutor-portal.component.html',
  styleUrls: ['./tutor-portal.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorPortalComponent extends AppComponentBase implements OnInit {
  id: string;
  thumbnailUrl: string;
  model = new ArticleDto();
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _tutorPortalService: TutorPortalService,
    private _articlesService: ArticlesServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getArticle();
      }
    });
    this._tutorPortalService.article$.subscribe(response => {
      this.model = response;
    });
  }

  ngOnInit(): void {
  }

  get title(): string {
    return this.model.type === ArticleType.SingleArticle ? 'Article' : 'ArticleSeries';
  }

  private getArticle(): void {
    this._articlesService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async response => {
        this._tutorPortalService.article = response;
        this.thumbnailUrl = await this._uploadService.getFileUrl(response.thumbnailDocument);
      });
  }
}
