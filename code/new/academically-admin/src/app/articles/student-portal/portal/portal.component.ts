import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less']
})
export class PortalComponent implements OnInit {
  articleId: string;

  constructor(
    route: ActivatedRoute,
  ) {
    route.parent.parent.parent.paramMap.subscribe(paramMap => {
      this.articleId = paramMap.get('article-id');
    });
  }

  ngOnInit(): void {
  }

}
