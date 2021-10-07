import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageComponent } from '../../_models/page-component';
import { TextPageComponent } from '../../_models/text-page-component';
import { ImagePageComponent } from '../../_models/image-page-component';

@Component({
  selector: 'app-page-component-selector',
  templateUrl: './page-component-selector.component.html',
  styleUrls: ['./page-component-selector.component.less']
})
export class PageComponentSelectorComponent extends AppComponentBase implements OnInit {
  @Output() pageComponentSelected = new EventEmitter<PageComponent>();

  pageComponents: PageComponent[] = [];
  selectedPageComponent: PageComponent = new PageComponent();
  isTemplateSelected = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
  ) {
    super(injector);
    this.pageComponents.push(new TextPageComponent());
    this.pageComponents.push(new ImagePageComponent());
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this._modal.hide();
  }

  onSelectPageComponent(pageComponent: PageComponent): void {
    this.selectedPageComponent = pageComponent;
  }

  onOkayClick(): void {
    this.pageComponentSelected.emit(this.selectedPageComponent);
    this._modal.hide();
  }
}
