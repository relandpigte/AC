import { Component, Injector, Input, OnInit } from '@angular/core';
import { ContentSelectorComponent } from '@app/page-builder/_components/content-selector/content-selector.component';
import { SectionContent } from '@app/page-builder/_models/section-content';
import { PageBuilderService } from '@app/page-builder/_services/page-builder.service';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-section-preview',
  templateUrl: './section-preview.component.html',
  styleUrls: ['./section-preview.component.less']
})
export class SectionPreviewComponent extends AppComponentBase implements OnInit {
  @Input() content: SectionContent;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _pageBuilderService: PageBuilderService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddComponentContentClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<ContentSelectorComponent>;
    modalSettings.initialState = {
    };
    const modal = this._modalService.show(ContentSelectorComponent, modalSettings).content;
    modal.contentSelected
      .pipe(takeUntil(this.destroyed$))
      .subscribe(content => {
        this.content.components.push(content);
        this._pageBuilderService.content = content;
      });
  }
}
