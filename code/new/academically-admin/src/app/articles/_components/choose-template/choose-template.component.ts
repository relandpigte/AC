import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ArticleTemplate } from '../../_models/article-template';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ArticleType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.less']
})
export class ChooseTemplateComponent implements OnInit {
  @Output() selectTemplate = new EventEmitter<ArticleTemplate>();
  templates: ArticleTemplate[] = [];

  constructor(
    private _modal: BsModalRef,
  ) {
    const singleArticleTemplate = new ArticleTemplate();
    singleArticleTemplate.type = ArticleType.SingleArticle;
    singleArticleTemplate.name = 'SingleArticle';
    singleArticleTemplate.description = 'SingleArticleDescription';
    this.templates.push(singleArticleTemplate);

    const articleSeriesTemplate = new ArticleTemplate();
    articleSeriesTemplate.type = ArticleType.ArticleSeries;
    articleSeriesTemplate.name = 'ArticleSeries';
    articleSeriesTemplate.description = 'ArticleSeriesDescription';
    this.templates.push(articleSeriesTemplate);
  }

  ngOnInit(): void {
  }

  onTemplateSelect(template: ArticleTemplate): void {
    this.selectTemplate.emit(template);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
