import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tutorial-accept-proposal-overview',
  templateUrl: './tutorial-accept-proposal-overview.component.html',
  styleUrls: ['./tutorial-accept-proposal-overview.component.less']
})
export class TutorialAcceptProposalOverviewComponent extends AppComponentBase implements OnInit {
  @Input() tutorOffer: GetTutorOfferDto;
  acceptTutorialOverViewCheck = false;
  acceptDiscountOverViewCheck = false;
  constructor(injector: Injector, private modal: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {}

  getTotal(): any {
    let total = 0;
    if (this.acceptTutorialOverViewCheck) {
      total += this.tutorOffer.singleSessionRate;
    }

    if (this.acceptDiscountOverViewCheck) {
      const multipleSessionTotal = this.tutorOffer.multipleSessionCount * this.tutorOffer.multipleSessionRate;
      total += multipleSessionTotal;
    }

    return total;
  }
}
