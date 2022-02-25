import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { TutorPortalService } from '@app/articles/tutor-portal/_services/tutor-portal.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-article-series',
  templateUrl: './article-series.component.html',
  styleUrls: ['./article-series.component.less']
})
export class ArticleSeriesComponent extends AppComponentBase implements OnInit {
  model = new ArticleDto();
  selectedArticle = new ArticleDto();

  articles: ArticleDto[] = [];

  constructor(
    injector: Injector,
    private _tutorPortalService: TutorPortalService,
    private _articlesService: ArticlesServiceProxy,
  ) {
    super(injector);
    this._tutorPortalService.article$.subscribe(article => {
      if (article && article.id) {
        this.model = article;
        this.getArticles();
      }
    });
  }

  ngOnInit(): void {
  }

  onArticleClick(article: ArticleDto): void {
    this.selectedArticle = article;
  }

  private getArticles(): void {
    this._articlesService.getAllForSeries(
      this.model.id,
      undefined,
      undefined,
      undefined,
      100
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.articles = response.items;
        if (this.articles && this.articles.length) {
          this.selectedArticle = this.articles[0];
        }
      });
  }
}
