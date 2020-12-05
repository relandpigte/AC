import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import {
  GetProfileDetailDto,
  GetStudentProposalDto,
  GetTutorOfferDto,
  ProposalsServiceProxy,
  TutorOffersServiceProxy,
  UserProfilesServiceProxy,
  UserSupportServiceDto
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AcceptTutorOfferComponent } from './accept-tutor-offer/accept-tutor-offer.component';

@Component({
  selector: 'tutor-offer-overview',
  templateUrl: './tutor-offer-overview.component.html',
  styleUrls: ['./tutor-offer-overview.component.less']
})
export class TutorOfferOverviewComponent extends AppComponentBase implements OnInit {
  id: string;
  tutorialId: string;
  tutorId: string;
  offer: GetTutorOfferDto = new GetTutorOfferDto();
  studentProposal: GetStudentProposalDto = new GetStudentProposalDto();
  tutorSupportService: UserSupportServiceDto = new UserSupportServiceDto();
  highestEducationLevel: number;
  isLoading = false;
  moment: any = moment;
  constructor(
    injector: Injector,
    private _activateRoute: ActivatedRoute,
    private _tutorOffersService: TutorOffersServiceProxy,
    private _userProfileService: UserProfilesServiceProxy,
    private _propsalsService: ProposalsServiceProxy,
    private _modalService: BsModalService,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._activateRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('offerId');
      if (this.id) {
        this.getTutorOffer();
        this.isLoading = false;
      }
    });
  }

  onAcceptClick(): void {
    this.showAcceptOfferModal();
  }

  private getTutorOffer(): void {
    this._tutorOffersService.get(this.id).subscribe(offer => {
      this.offer = offer;
      this.tutorId = this.offer.tutorId;
      this.tutorialId = this.offer.tutorialId;
      this.getStudentProposal(this.offer.tutorialId);
      this.getTutorSupportService(this.offer.tutor.userId);
      this.getTutorHighestEducationLevel(this.offer.tutor.userId);
    });
  }

  private getStudentProposal(tutorialId: string): void {
    this._propsalsService.getStudentProposal(tutorialId).subscribe(proposal => {
      this.studentProposal = proposal;
    });
  }

  private getTutorSupportService(userId: number): void {
    this._propsalsService.getTutorSupportService(userId).subscribe(tutorSupportService => {
      this.tutorSupportService = tutorSupportService;
    });
  }

  private getTutorHighestEducationLevel(userId: number): void {
    this._tutorOffersService.getTutorHighestEducationLevel(userId).subscribe(tutorHighestLevel => {
      this.highestEducationLevel = tutorHighestLevel;
    });
  }

  private showAcceptOfferModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-l';
    modalSettings.initialState = {
      offer: this.offer
    };
    const modalRef = this._modalService.show(AcceptTutorOfferComponent, modalSettings);
    const modal: AcceptTutorOfferComponent = modalRef.content;
    modal.modalSave.subscribe((offer: GetTutorOfferDto) => {
      this.offer = offer;
      this.acceptOffer();
    });
  }

  private acceptOffer(): void {
    this._tutorOffersService.acceptOffer(this.offer.id, this.offer.isAccepted).subscribe(isAccepted => {
      this.notify.success(this.l('AcceptTutorOfferMessage'));
      this.offer.isAccepted = isAccepted;
    });
  }
}
