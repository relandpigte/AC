import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectDto, ProjectOfferDto, ProjectOffersServiceProxy, ProjectsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { finalize } from 'rxjs/operators';
// import { SubmitOfferComponent } from '../submit-offer/submit-offer.component';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-tutor-proposal.component.html',
  styleUrls: ['./view-tutor-proposal.component.less']
})
export class ViewTutorProposalComponent extends AppComponentBase implements OnInit {
  @Input() projectOffer: ProjectOfferDto = new ProjectOfferDto();
  userTitle: string;
  modalTitle: string;
  isLoading = false;
  isHourlyTutorialOffered = false;
  showPayButton = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _projectOffersService: ProjectOffersServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.modalTitle = this.projectOffer.creatorUser.name + '\'s Offer';

    this.isLoading = true;
    this._projectOffersService.get(this.projectOffer.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.projectOffer = response;
        this.isHourlyTutorialOffered = this.projectOffer.isDiscountedHourlySessionOffered;

        if (response && response.creatorUser) {
          this.userTitle =  response.creatorUser.roleNames.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Student';
        }
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  // onPayClick(): void {
  //   const modalSettings = this.defaultModalSettings;
  //   modalSettings.initialState = {
  //     project: this.project
  //   };
  //   this._modalService.show(SubmitOfferComponent, modalSettings);
  // }

  onTabClick(index: number): void {
    this.showPayButton = index === 1;
  }
}
