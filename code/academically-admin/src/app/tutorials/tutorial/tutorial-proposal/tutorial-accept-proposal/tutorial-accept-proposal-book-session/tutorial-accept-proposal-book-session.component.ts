import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tutorial-accept-proposal-book-session',
  templateUrl: './tutorial-accept-proposal-book-session.component.html',
  styleUrls: ['./tutorial-accept-proposal-book-session.component.less']
})
export class TutorialAcceptProposalBookSessionComponent extends AppComponentBase implements OnInit {
  @Input() tutorOffer: GetTutorOfferDto;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
}
