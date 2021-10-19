import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { MarginType } from '@app/page-builder/_models/margin-type';
import { PageContent } from '@app/page-builder/_models/page-content';
import { AppComponentBase } from '@shared/app-component-base';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';

@Component({
  selector: 'app-page-content-editor',
  templateUrl: './page-content-editor.component.html',
  styleUrls: ['./page-content-editor.component.less']
})
export class PageContentEditorComponent extends AppComponentBase implements OnInit {
  @Output() deleteContent = new EventEmitter<PageContent>();
  @Output() selectParent = new EventEmitter();
  @Input() pageContent: PageContent = new PageContent();

  MarginType = MarginType;

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
  }

  ngOnInit(): void {

  }

  onMarginTypeChange(): void {
    this.pageContent.setMargins();
  }

  onContentDelete(): void {
    this.deleteContent.emit(this.pageContent);
  }

  onSelectParentClick(): void {
    this.selectParent.emit();
  }
}
