import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ArticleType, StudentArticleDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends AppComponentBase implements OnInit {

  @Input() models: StudentArticleDto[] = [];
  ArticleType = ArticleType;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
