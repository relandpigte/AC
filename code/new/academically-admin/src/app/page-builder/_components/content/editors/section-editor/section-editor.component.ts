import { Component, Input, OnInit } from '@angular/core';
import { Content } from '@app/page-builder/_models/content';
import { SectionContent } from '@app/page-builder/_models/section-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';

@Component({
  selector: 'app-section-editor',
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.less']
})
export class SectionEditorComponent implements OnInit {
  @Input() content: SectionContent;

  constructor(
    private _pageBuilderService: PageBuilderService,
  ) { }

  ngOnInit(): void {
  }

  onSelectContent(content: Content): void {
    this._pageBuilderService.content = content;
  }
}
