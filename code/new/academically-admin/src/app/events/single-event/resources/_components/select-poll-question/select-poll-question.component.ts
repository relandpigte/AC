import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventPollQuestionType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-select-poll-question',
  templateUrl: './select-poll-question.component.html',
  styleUrls: ['./select-poll-question.component.less']
})
export class SelectPollQuestionComponent implements OnInit {
  @Output() typeSelected = new EventEmitter<EventPollQuestionType>(undefined);

  isLoading = false;

  EventPollQuestionType = EventPollQuestionType;

  constructor(
    private _modal: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit(): void {

  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onTypeClick(type: EventPollQuestionType): void {
    this.typeSelected.emit(type);
    this._modal.hide();
  }
}
