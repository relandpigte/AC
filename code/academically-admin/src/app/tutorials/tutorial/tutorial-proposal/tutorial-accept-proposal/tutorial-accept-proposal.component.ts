import { Component, inject, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto, UserDto, UserProfileDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tutorial-accept-proposal',
  templateUrl: './tutorial-accept-proposal.component.html',
  styleUrls: ['./tutorial-accept-proposal.component.less'],
  animations: [appModuleAnimation()]
})
export class TutorialAcceptProposalComponent extends AppComponentBase implements OnInit {
  @Input() tutorOffer: GetTutorOfferDto;
  tutor: UserProfileDto = new UserProfileDto();
  constructor(injector: Injector, private modal: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.tutorOffer);
    this.tutor = this.tutorOffer.tutor;
  }

  onCloseClick(): void {
    this.close();
  }

  private close(): void {
    this.modal.hide();
  }
}
