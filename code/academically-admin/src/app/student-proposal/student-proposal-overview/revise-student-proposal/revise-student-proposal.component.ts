import { Component, EventEmitter, Inject, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateTutorOfferDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-revise-student-proposal',
  templateUrl: './revise-student-proposal.component.html',
  styleUrls: ['./revise-student-proposal.component.less']
})
export class ReviseStudentProposalComponent extends AppComponentBase implements OnInit {
  @Input() offer: CreateTutorOfferDto;
  @Output() modalSave = new EventEmitter<any>();
  isLoading = false;
  constructor(injector: Injector, private _modalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {}

  onFormSubmit(): void {
    this.saveRevisedStudentProposal();
  }

  onCloseClick(): void {
    this.close();
  }

  private saveRevisedStudentProposal(): void {
    this.isLoading = true;
    this.modalSave.emit(this.offer);
    this.notify.success(this.l('ReviseSessionRateMessage'));
    this.close();
    this.isLoading = false;
  }

  private close(): void {
    this._modalRef.hide();
  }
}
