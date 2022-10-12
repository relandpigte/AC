import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateEventDto, EventType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-broadcast',
  templateUrl: './create-broadcast.component.html',
  styleUrls: ['./create-broadcast.component.less']
})
export class CreateBroadcastComponent implements OnInit {
  @Input() model = new CreateEventDto();
  @Output() createBroadcast = new EventEmitter<CreateEventDto>();
  @Output() createCancel = new EventEmitter();
  isLoading = false;
  EventType = EventType;

  constructor(
    private _modal: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.createBroadcast.emit(this.model);
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
