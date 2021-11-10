import { Component, Input, OnInit } from '@angular/core';
import { Content } from '@app/page-builder/_models/content';
import { PageContent } from '@app/page-builder/_models/page-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.less']
})
export class PageEditorComponent implements OnInit {
  @Input() content: PageContent;

  constructor(
    private _pageBuilderService: PageBuilderService,
  ) { }

  ngOnInit(): void {
  }

  onSelectContent(content: Content): void {
    this._pageBuilderService.content = content;
  }
}
