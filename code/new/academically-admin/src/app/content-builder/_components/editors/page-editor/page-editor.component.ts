import { Component, OnInit, Injector, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PageContent } from '../../../_models/page-content';
import { PageBuilderService } from '../../../_services/page-builder.service';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { AddComponentComponent } from '../../add-component/add-component.component';
import { ComponentContent } from '../../../_models/component-content';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.less']
})
export class PageEditorComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Output() moveUp = new EventEmitter();
  @Input() page: PageContent;
  dragulaGroup = 'COMPONENTS';
  isSinglePage = false;

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,
    private _modalService: BsModalService,
    private _dragulaService: DragulaService,
  ) {
    super(injector);
    _dragulaService.createGroup(this.dragulaGroup, {
      moves: (el, source, handle) => handle.classList.contains('drag-handle'),
    });
  }

  ngOnInit(): void {
    this._pageBuilderService.singlePageOnly$.subscribe(response => {
      this.isSinglePage = response;
    });
  }

  ngOnDestroy(): void {
    this._dragulaService.destroy(this.dragulaGroup);
  }

  onAddClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<AddComponentComponent>;
    modalSettings.initialState = {
      page: this.page,
    };
    const modal = this._modalService.show(AddComponentComponent, modalSettings).content;
  }

  onMoveUpClick(): void {
    this._pageBuilderService.nagivateUp = this.page;
  }

  onComponentClick(component: ComponentContent): void {
    this._pageBuilderService.content = component;
  }

  onRemoveClick(): void {
    this._pageBuilderService.remove = this.page;
  }
}
