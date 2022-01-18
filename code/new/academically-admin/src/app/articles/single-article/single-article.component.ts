import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../_services/article.service';
import { takeUntil } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.less'],
  animations: [appModuleAnimation()],
})
export class SingleArticleComponent extends AppComponentBase implements OnInit {
  id: string;
  model = new ArticleDto();

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _articleService: ArticleService,
    private _articlesService: ArticlesServiceProxy,
  ) {
    super(injector);
    route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.getArticle();
  }

  private getArticle(): void {
    this._articlesService.get(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.model = response;
        this._articleService.articleCreated = this.model;
      });
  }
}
