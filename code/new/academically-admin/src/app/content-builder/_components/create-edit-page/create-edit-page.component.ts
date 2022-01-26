import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageContent } from '../../_models/page-content';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-edit-page',
  templateUrl: './create-edit-page.component.html',
  styleUrls: ['./create-edit-page.component.less']
})
export class CreateEditPageComponent implements OnInit {
  @Input() isEdit = false;
  @Input() content: PageContent = new PageContent;
  @Output() modalSave = new EventEmitter<PageContent>();

  constructor(
    private _modal: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {
    this.modalSave.emit(this.content);
    this._modal.hide();
  }
}
