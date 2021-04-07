import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-edit-research-publication',
  templateUrl: './create-edit-research-publication.component.html',
  styleUrls: ['./create-edit-research-publication.component.less']
})
export class CreateEditResearchPublicationComponent extends AppComponentBase implements OnInit {
  userPublication = {
    id: undefined,
    title: undefined,
    publicationType: undefined,
    publisher: undefined,
    publicationDate: undefined,
    abstract: undefined,
  };
  isLoading = false;
  tags = '';
  publicationDate: Date;
  datePickerConfig: BsDatepickerConfig;

  constructor(
    injector: Injector,
    private _modal: BsModalRef
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
  }

  onFormSubmit(): void {

  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
