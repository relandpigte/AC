import { Component, InjectionToken, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { GuardianConsentProfileDto, GuardianProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-guardian-consent',
  templateUrl: './guardian-consent.component.html',
  styleUrls: ['./guardian-consent.component.less']
})
export class GuardianConsentComponent extends AppComponentBase implements OnInit {
  @Input() tutorialId: string;
  isLoading = false;
  guardianConsent: GuardianConsentProfileDto = new GuardianConsentProfileDto();
  constructor(
    injector: Injector,
    private _modalRef: BsModalRef,
    private _guardianConsentProfileService: GuardianProfilesServiceProxy,
    private router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.guardianConsent.referenceId = this.tutorialId;
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.guardianConsent.sourceType = 0;
    this.guardianConsent.consentedDate = null;
    this.guardianConsent.hasExpired = false;
    this._guardianConsentProfileService.save(this.guardianConsent).subscribe(() => {
      this.isLoading = false;
      this.message.info(this.l('SendConsentSuccesfully'));
      this.router.navigate(['/app/tutorial', this.tutorialId]);
      this._modalRef.hide();
    });
  }
}
