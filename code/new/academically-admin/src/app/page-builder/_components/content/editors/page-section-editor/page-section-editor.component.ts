import { Component, OnInit, Input } from '@angular/core';
import { PageSection } from '@app/page-builder/_models/page-section';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';
import { PageComponent } from '@app/page-builder/_models/page-component';

@Component({
  selector: 'app-page-section-editor',
  templateUrl: './page-section-editor.component.html',
  styleUrls: ['./page-section-editor.component.less']
})
export class PageSectionEditorComponent implements OnInit {
  @Input() pageSection: PageSection;

  constructor(
    private _pageBuilderService: PageBuilderService,
  ) { }

  ngOnInit(): void {
  }

  onSelectComponent(pageComponent: PageComponent): void {
    this._pageBuilderService.pageContent = pageComponent;
  }
}
