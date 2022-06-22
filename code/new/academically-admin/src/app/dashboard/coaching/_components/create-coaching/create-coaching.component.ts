import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateCoachingDto, CoachingType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-coaching',
  templateUrl: './create-coaching.component.html',
  styleUrls: ['./create-coaching.component.less']
})
export class CreateCoachingComponent implements OnInit {
  @Input() model = new CreateCoachingDto();
  @Output() createCoaching = new EventEmitter<CreateCoachingDto>();
  @Output() createCancel = new EventEmitter();
  isLoading = false;
  CoachingType = CoachingType;

  constructor(
    private _modal: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.createCoaching.emit(this.model);
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
