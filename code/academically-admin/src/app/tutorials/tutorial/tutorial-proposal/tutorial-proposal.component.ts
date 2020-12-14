import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import {
  EducationLevel,
  GetTutorOfferDto,
  GetTutorOfferDtoPagedResultDto,
  TutorOffersServiceProxy
} from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { TutorialAcceptProposalComponent } from './tutorial-accept-proposal/tutorial-accept-proposal.component';
import { TutorialExpandProposalComponent } from './tutorial-expand-proposal/tutorial-expand-proposal.component';

class PagedAndSortedOffersRequestDto extends PagedAndSortedRequestDto {
  tutorialIdFilter: string;
  educationLevelFilter?: EducationLevel;
  distanceFilter?: number;
}

@Component({
  selector: 'tutorial-proposal',
  templateUrl: './tutorial-proposal.component.html',
  styleUrls: ['./tutorial-proposal.component.less']
})
export class TutorialProposalComponent extends PagedListingComponentBase<GetTutorOfferDto> {
  @Output() sessionBooked = new EventEmitter<boolean>(false);
  @Input() id: string;
  educationLevelFilter?: EducationLevel;
  distanceFilter?: number;
  educationLevels: number[] = [];
  tutorOffers: GetTutorOfferDto[] = [];
  keyword: string;

  constructor(injector: Injector, private _tutorOffersService: TutorOffersServiceProxy, private _modalService: BsModalService) {
    super(injector);
    this.getEducationLevels();
    this.pageSize = 5;
  }

  onFullDetailsClick(tutorOffer: GetTutorOfferDto): void {
    this.showProposalModal(tutorOffer);
  }

  onAcceptOfferDetailsClick(tutor: GetTutorOfferDto): void {
    this.showOfferModal(tutor);
  }

  onEducationLevelChange(): void {
    this.refresh();
  }

  onDistanceChange(): void {
    this.refresh();
  }

  list(request: PagedAndSortedOffersRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.tutorialIdFilter = this.id;
    request.educationLevelFilter = this.educationLevelFilter;
    request.distanceFilter = this.distanceFilter;

    this._tutorOffersService
      .getAll(
        request.tutorialIdFilter,
        request.educationLevelFilter,
        request.distanceFilter,
        request.sort,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: GetTutorOfferDtoPagedResultDto) => {
        this.tutorOffers = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private getEducationLevels(): void {
    this.educationLevels = this.enumToArray(EducationLevel).reverse();
  }

  private showProposalModal(tutorOffer: GetTutorOfferDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    modalSettings.initialState = {
      tutorOffer
    };
    const modal = this._modalService.show(TutorialExpandProposalComponent, modalSettings);
  }

  private showOfferModal(tutorOffer: GetTutorOfferDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-xl';
    modalSettings.initialState = {
      tutorOffer: tutorOffer
    };
    const modalRef = this._modalService.show(TutorialAcceptProposalComponent, modalSettings);
    const modal: TutorialAcceptProposalComponent = modalRef.content;
    modal.sessionBooked.subscribe((isBooked: boolean) => {
      if (isBooked) {
        this.refresh();
        this.sessionBooked.emit(true);
      }
    });
  }
}
