import { Component, OnInit, Input, OnDestroy, Injector } from '@angular/core';
import { PageContent } from '@app/page-builder/_models/page-content';
import { SectionContent } from '@app/page-builder/_models/section-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';
import { AppComponentBase } from '@shared/app-component-base';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-page-preview',
  templateUrl: './page-preview.component.html',
  styleUrls: ['./page-preview.component.less']
})
export class PagePreviewComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Input() content: PageContent;
  sortableId = this.uuidv4();

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
    private _dragulaService: DragulaService,
  ) {

    super(injector);
    this._dragulaService.createGroup(this.sortableId, {
      moves: (el, source, handle) => handle.className === 'page-section-actions',
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._dragulaService.destroy(this.sortableId);
  }

  onAddClick(): void {
    const section = new SectionContent();
    this._pageBuilderService.content = section;
    this.content.sections.push(section);
  }

}
