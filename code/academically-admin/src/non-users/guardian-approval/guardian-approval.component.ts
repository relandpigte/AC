import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { GuardianConsentProfileDto, GuardianProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { ipFind } from '@shared/constants/ip-find';
@Component({
  selector: 'app-guardian-approval',
  templateUrl: './guardian-approval.component.html',
  styleUrls: ['./guardian-approval.component.less']
})
export class GuardianApprovalComponent extends AppComponentBase implements OnInit {
  guardianConsentProfile: GuardianConsentProfileDto = new GuardianConsentProfileDto();
  termsAndConditionsCheck = false;
  privacyPolicyCheck = false;
  authorityCheck = false;
  isLoading = false;
  id: string;
  ipAddress: string;
  constructor(
    injector: Injector,
    private guardianConsentProfileService: GuardianProfilesServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private http: HttpClient
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.id) {
        this.getGuardianConsentProfile();
      }
      this.getIPAddress();
    });
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.guardianConsentProfile.ipAddress = this.ipAddress;
    this.guardianConsentProfile.consentedDate = moment.utc();
    this.guardianConsentProfileService.grantAccessToTutorial(this.guardianConsentProfile).subscribe(() => {
      this.isLoading = false;
      this.notify.success(this.l('TutorialAccessGranted'));
      this._router.navigate(['thank-you']);
    });
  }

  private getGuardianConsentProfile(): void {
    this.guardianConsentProfileService.get(this.id).subscribe(guardianConsentProfile => {
      this.guardianConsentProfile = guardianConsentProfile;
    });
  }

  getIPAddress() {
    var url = `${ipFind.url}?auth=${ipFind.apiKey}`;
    this.http.get(url).subscribe((res: any) => {
      this.ipAddress = res.ip_address;
    });
  }
}
