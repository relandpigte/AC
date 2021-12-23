import { Component, OnInit, Input, Injector } from '@angular/core';
import { PageContent } from '../../_models/page-content';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddComponentComponent } from '../add-component/add-component.component';
import { ComponentContent } from '../../_models/component-content';

@Component({
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.less']
})
export class PageViewerComponent extends AppComponentBase implements OnInit {
  @Input() page: PageContent;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onAddClick(component?: ComponentContent): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<AddComponentComponent>;
    modalSettings.initialState = {
      page: this.page,
      appendToComponent: component,
    };
    const modal = this._modalService.show(AddComponentComponent, modalSettings).content;
  }
}
