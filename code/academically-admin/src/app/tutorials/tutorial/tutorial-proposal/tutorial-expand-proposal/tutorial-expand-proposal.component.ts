import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tutorial-expand-proposal',
  templateUrl: './tutorial-expand-proposal.component.html',
  styleUrls: ['./tutorial-expand-proposal.component.less']
})
export class TutorialExpandProposalComponent extends AppComponentBase implements OnInit {
  @Input() tutorOffer: GetTutorOfferDto;

  constructor(injector: Injector, private modal: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.close();
  }

  private close(): void {
    this.modal.hide();
  }
}
