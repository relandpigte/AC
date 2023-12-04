import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less']
})
export class PortalComponent implements OnInit {
  articleId: string;
  tab: string;

  constructor(
    route: ActivatedRoute,
  ) {
    route.paramMap.subscribe(paramMap => {
      this.articleId = paramMap.get('article-id');
      this.tab = paramMap.get('tab');
    });
  }

  ngOnInit(): void {
  }

}
