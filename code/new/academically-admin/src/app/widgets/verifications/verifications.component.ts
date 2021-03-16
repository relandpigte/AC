import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProfilesServiceProxy, VerificationStatusDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';

@Component({
  selector: 'app-verifications',
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.less']
})
export class VerificationsComponent extends AppComponentBase implements OnInit {
  verifcationStatus: VerificationStatusDto = new VerificationStatusDto();

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
    const modalSettings = this.defaultModalSettings;
    const modalRef = this._modalService.show(VerifyMobileComponent, modalSettings);
    const modal: VerifyMobileComponent = modalRef.content;
    modal.phoneNumberVerified.subscribe((result: boolean) => {
      if (result) {
        this.getVerificationStatus();
      }
    });
  }

  private getVerificationStatus(): void {
    this._profilesService.getVerificationStatus(this.appSession.userId)
      .subscribe(verificationStatus => {
        this.verifcationStatus = verificationStatus;
        console.log(this.verifcationStatus);
      })
  }
}
