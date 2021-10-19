import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { PageSection } from '../../../../_models/page-section';
import { AppComponentBase } from '@shared/app-component-base';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { PageComponentSelectorComponent } from '@app/page-builder/_components/page-component-selector/page-component-selector.component';
import { takeUntil } from 'rxjs/operators';
import { PageContent } from '@app/page-builder/_models/page-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';

@Component({
  selector: 'app-page-section-preview',
  templateUrl: './page-section-preview.component.html',
  styleUrls: ['./page-section-preview.component.less']
})
export class PageSectionPreviewComponent extends AppComponentBase implements OnInit {
  @Input() pageSection: PageSection = new PageSection();
  @Input() selectedPageContent: PageContent;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddPageComponentClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<PageComponentSelectorComponent>;
    modalSettings.initialState = {
    };
    const modal = this._modalService.show(PageComponentSelectorComponent, modalSettings).content;
    modal.pageComponentSelected
      .pipe(takeUntil(this.destroyed$))
      .subscribe(pageComponent => {
        this.pageSection.pageComponents.push(pageComponent);
        this._pageBuilderService.pageContent = pageComponent;
      });
  }
}
