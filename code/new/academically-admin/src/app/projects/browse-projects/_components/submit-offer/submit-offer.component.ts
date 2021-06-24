import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectOfferDto, ProjectDto, ProjectOffersServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-submit-offer',
  templateUrl: './submit-offer.component.html',
  styleUrls: ['./submit-offer.component.less']
})
export class SubmitOfferComponent extends AppComponentBase implements OnInit {
  @Input() project: ProjectDto = new ProjectDto();
  projectOffer: CreateProjectOfferDto = new CreateProjectOfferDto();

  isLoading = false;
  discountedTotalPrice = 0;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _modalService: BsModalService,
    private _projectOffersService: ProjectOffersServiceProxy
  ) {
    super(injector);
    this.projectOffer.hourlyRate = 0;
    this.projectOffer.isHourlySessionOffered = true;
    this.projectOffer.discountedHourlyRate = 0;
    this.projectOffer.discountedHours = 0;
    this.discountedTotalPrice = 0;
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.projectOffer.projectId = this.project.id;
    this._projectOffersService.create(this.projectOffer)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.isLoading = false;
        this.notify.success(this.l('OfferSentSuccessfully'));
        this._modal.hide();
      });
  }

  onNumberPress(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  calculateTotal(): void {
    const total = this.projectOffer.discountedHours * this.projectOffer.discountedHourlyRate;
    this.discountedTotalPrice = isNaN(total) ? 0 : total;
  }

  resetDiscountedHourlySessionOffered(): void {
    this.projectOffer.discountedHourlyRate = 0;
    this.projectOffer.discountedHours = 0;
    this.discountedTotalPrice = 0;
  }

  hasValidValues(): boolean {
    if (!this.projectOffer.isHourlySessionOffered && !this.projectOffer.isDiscountedHourlySessionOffered) {
      return false;
    }

    if (this.projectOffer.isHourlySessionOffered && this.projectOffer.hourlyRate <= 0) {
      return false;
    }

    if (this.projectOffer.isDiscountedHourlySessionOffered &&
      (this.projectOffer.discountedHourlyRate <= 0 || this.projectOffer.discountedHours <= 0)) {
        return false;
    }

    return true;
  }
}
