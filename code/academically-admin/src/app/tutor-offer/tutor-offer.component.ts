import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import {
  GetProfileDetailDto,
  GetTutorOfferDto,
  ProposalsServiceProxy,
  TutorOffersServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tutor-offer',
  templateUrl: './tutor-offer.component.html',
  styleUrls: ['./tutor-offer.component.less'],
  animations: [appModuleAnimation()]
})
export class TutorOfferComponent extends AppComponentBase implements OnInit {
  id: string;
  offer: GetTutorOfferDto = new GetTutorOfferDto();
  tutorProfile: GetProfileDetailDto = new GetProfileDetailDto();
  studentFullName = '';
  constructor(
    injector: Injector,
    private _activateRoute: ActivatedRoute,
    private _tutorOffersService: TutorOffersServiceProxy,
    private _proposalsService: ProposalsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._activateRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('offerId');
      if (this.id) {
        this.getTutorOffer();
      }
    });
  }

  private getTutorOffer(): void {
    this._tutorOffersService.get(this.id).subscribe(offer => {
      this.offer = offer;
      this.getStudentProposal(this.offer.tutorialId);
    });
  }

  private getStudentProposal(tutorialId: string): void {
    this._proposalsService.getStudentProposal(tutorialId).subscribe(studentProposal => {
      this.studentFullName = studentProposal.student.user.fullName;
    });
  }
}
