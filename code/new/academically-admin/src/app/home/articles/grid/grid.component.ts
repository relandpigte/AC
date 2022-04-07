import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleDto, EventDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent extends AppComponentBase implements OnInit {

  @Input() articles: ArticleDto[] = [];
  @Output() visitArticle = new EventEmitter<ArticleDto>();

  constructor(injector: Injector) {
    super(injector);

   }

  ngOnInit(): void {
  }

  onVisitArticleClick(event: ArticleDto) {
    this.visitArticle.emit(event);
  }

}
