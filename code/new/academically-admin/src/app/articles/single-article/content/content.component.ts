import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '@app/articles/_services/article.service';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent extends AppComponentBase implements OnInit {
  id: string;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _articleService: ArticleService,
  ) {
    super(injector);
    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.id = article.id;
      }
    });
  }

  ngOnInit(): void {
  }
}
