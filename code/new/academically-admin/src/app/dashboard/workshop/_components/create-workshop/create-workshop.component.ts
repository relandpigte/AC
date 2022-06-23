import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateWorkshopDto, WorkshopType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-workshop',
  templateUrl: './create-workshop.component.html',
  styleUrls: ['./create-workshop.component.less']
})
export class CreateWorkshopComponent implements OnInit {
  @Input() model = new CreateWorkshopDto();
  @Output() createWorkshop = new EventEmitter<CreateWorkshopDto>();
  @Output() createCancel = new EventEmitter();
  isLoading = false;
  WorkshopType = WorkshopType;

  constructor(
    private _modal: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.createWorkshop.emit(this.model);
    this._modal.hide();
  }

  onCancelClick(): void {
    this.createCancel.emit();
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
