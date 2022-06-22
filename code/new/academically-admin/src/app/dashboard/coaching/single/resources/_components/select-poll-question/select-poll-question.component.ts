import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CoachingPollQuestionType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-select-poll-question',
  templateUrl: './select-poll-question.component.html',
  styleUrls: ['./select-poll-question.component.less']
})
export class SelectPollQuestionComponent implements OnInit {
  @Output() typeSelected = new EventEmitter<CoachingPollQuestionType>(undefined);

  isLoading = false;

  CoachingPollQuestionType = CoachingPollQuestionType;

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

  onTypeClick(type: CoachingPollQuestionType): void {
    this.typeSelected.emit(type);
    this._modal.hide();
  }
}
