import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ComponentContent } from '@app/page-builder/_models/component-content';
import { Content } from '@app/page-builder/_models/content';
import { ImageComponentContent } from '@app/page-builder/_models/image-component-content';
import { HeaderComponentContent } from '@app/page-builder/_models/header-component-content';
import { TextComponentContent } from '@app/page-builder/_models/text-component-content';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-content-selector',
  templateUrl: './content-selector.component.html',
  styleUrls: ['./content-selector.component.less']
})
export class ContentSelectorComponent extends AppComponentBase implements OnInit {
  @Output() contentSelected = new EventEmitter<ComponentContent>();

  contents: Content[] = [];
  selectedContent: ComponentContent;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
  ) {
    super(injector);
    this.contents.push(new HeaderComponentContent());
    this.contents.push(new TextComponentContent());
    this.contents.push(new ImageComponentContent());
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this._modal.hide();
  }

  onSelectComponentContent(content: ComponentContent): void {
    this.selectedContent = content;
  }

  onOkayClick(): void {
    this.contentSelected.emit(this.selectedContent);
    this._modal.hide();
  }
}
