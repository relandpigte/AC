import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PassportVerificationStatus, ProfilesServiceProxy, VerificationStatusDto } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';
import { VerifyPassportComponent } from './verify-passport/verify-passport.component';

@Component({
  selector: 'app-verifications',
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.less']
})
export class VerificationsComponent extends AppComponentBase implements OnInit {
  @Input() isTutor: boolean;
  PassportVerificationStatus = PassportVerificationStatus;
  verifcationStatus: VerificationStatusDto = new VerificationStatusDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _profilesService: ProfilesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getVerificationStatus();
  }

  onVerifyMobileNumberClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<VerifyMobileComponent>;
    modalSettings.class = 'modal-md';
    const modal = this._modalService.show(VerifyMobileComponent, modalSettings).content;
    modal.phoneNumberVerified.subscribe((result: boolean) => {
      if (result) {
        this.getVerificationStatus();
      }
    });
  }

  onVerifiyPassportClick(): void {
    const modalSettings = this.defaultModalSettings;
    const modalRef = this._modalService.show(VerifyPassportComponent, modalSettings);
    const modal: VerifyPassportComponent = modalRef.content;
    modal.passportVerified.subscribe(() => {
      this.getVerificationStatus();
    });
  }

  private getVerificationStatus(): void {
    this.isLoading = true;
    this._profilesService.getVerificationStatus(this.appSession.userId)
      .subscribe(verificationStatus => {
        this.verifcationStatus = verificationStatus;
        this.isLoading = false;
      })
  }
}
