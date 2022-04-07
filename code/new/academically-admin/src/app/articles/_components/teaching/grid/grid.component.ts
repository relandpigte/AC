import { Component, OnInit , Input, Injector, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, ArticleType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-teaching-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent extends AppComponentBase implements OnInit {

  @Input() articles: ArticleDto[] = [];
  @Output() deleteArticle = new EventEmitter<string>();
  ArticleType = ArticleType;
  constructor(injector: Injector) {
    super(injector);
   }

  ngOnInit(): void {
  }

  onDeleteArticle(id: string) {
    this.deleteArticle.emit(id);
  }



}
