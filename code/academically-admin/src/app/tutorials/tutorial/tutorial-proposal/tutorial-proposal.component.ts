import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { EducationLevel, GetTutorOfferDto, TutorOffersServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TutorialExpandProposalComponent } from './tutorial-expand-proposal/tutorial-expand-proposal.component';

@Component({
  selector: 'tutorial-proposal',
  templateUrl: './tutorial-proposal.component.html',
  styleUrls: ['./tutorial-proposal.component.less'],
})
export class TutorialProposalComponent extends AppComponentBase implements OnInit {
  @Input() id: string;
  educationLevels: number[] = [];
  tutorOffers: GetTutorOfferDto[] = [];
  keyword: string;

  constructor(injector: Injector, private _tutorOffersService: TutorOffersServiceProxy, private _modalService: BsModalService) {
    super(injector);
  }

  ngOnInit(): void {
    this.getEducationLevels();
    this.getTutorOffers();
  }

  onFullDetailsClick(tutorOffer: GetTutorOfferDto): void {
    this.showProposalModal(tutorOffer);
  }

  private getEducationLevels(): void {
    this.educationLevels = this.enumToArray(EducationLevel).reverse();
  }

  private getTutorOffers(): void {
    this._tutorOffersService.getAll(this.id).subscribe((tutorOffers) => {
      this.tutorOffers = tutorOffers;
    });
  }

  private showProposalModal(tutorOffer: GetTutorOfferDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    modalSettings.initialState = {
      tutorOffer,
    };
    const modal = this._modalService.show(TutorialExpandProposalComponent, modalSettings);
  }
}
