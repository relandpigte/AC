import { Component, Input, OnInit } from '@angular/core';
import { PageContent } from '@app/page-builder/_models/page-content';

@Component({
  selector: 'app-page-preview',
  templateUrl: './page-preview.component.html',
  styleUrls: ['./page-preview.component.less']
})
export class PagePreviewComponent implements OnInit {
  @Input() content: PageContent;

  constructor() { }

  ngOnInit(): void {
  }

}
