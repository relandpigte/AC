import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticleType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-teaching-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends AppComponentBase implements OnInit {

  @Input() articles: ArticleDto[] = [];
  @Output() deleteArticle = new EventEmitter<string>();
  ArticleType = ArticleType;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onDeleteClick(id: string) {
    this.deleteArticle.emit(id);
  }

}
