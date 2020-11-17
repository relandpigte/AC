import { Component, Injector, Input, OnInit } from '@angular/core';
import { SessionRatesComponent } from '@app/shared/session-rates/session-rates.component';
import { SupportServicesSearchComponent } from '@app/shared/support-services-search/support-services-search.component';
import { AppComponentBase } from '@shared/app-component-base';
import { SupportServiceDto, UserProfilesServiceProxy, UserSupportServiceSessionRateDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'profile-support-services',
  templateUrl: './profile-support-services.component.html',
  styleUrls: ['./profile-support-services.component.less']
})
export class ProfileSupportServicesComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Input() isViewOnly = false;
  supportServices: SupportServiceDto[] = [];
  isLoading = false;

  constructor(injector: Injector, private _userProfilesService: UserProfilesServiceProxy, private _modalService: BsModalService) {
    super(injector);
  }

  ngOnInit(): void {
    this.getSupportServicesOfUser();
  }

  onAddClick(): void {
    this.showSupportServicesSearchModal();
  }

  onRemoveClick(supportServiceId: string): void {
    this.removeSupportServiceFromUser(supportServiceId);
  }

  onSelectSupportService(supportServiceId: string): void {
    this.showUserSupportServiceSessionRateModal(supportServiceId);
  }

  private getSupportServicesOfUser(): void {
    this.isLoading = true;
    this._userProfilesService
      .getSupportServices(this.userId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(supportServices => {
        this.supportServices = supportServices;
      });
  }

  private addSupportServicesToUser(supportServiceIds: string[]): void {
    this.isLoading = true;
    this._userProfilesService
      .createManySupportServices(supportServiceIds)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('TheSupportServicesWereAdded'));
        this.getSupportServicesOfUser();
      });
  }

  private removeSupportServiceFromUser(supportServiceId: string): void {
    this.isLoading = true;
    this._userProfilesService
      .deleteSupportService(this.userId, supportServiceId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('TheSupportServiceWasRemoved'));
        this.getSupportServicesOfUser();
      });
  }

  private showSupportServicesSearchModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userId: this.userId
    };
    const modalRef = this._modalService.show(SupportServicesSearchComponent, modalSettings);
    const modal: SupportServicesSearchComponent = modalRef.content;
    modal.modalSave.subscribe((selectedMethods: SupportServiceDto[]) => {
      const methodIds = selectedMethods.map(e => e.id);
      this.addSupportServicesToUser(methodIds);
    });
  }

  private showUserSupportServiceSessionRateModal(supportServiceId: string): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      userId: this.appSession.userId,
      supportServiceId: supportServiceId
    };
    const modalRef = this._modalService.show(SessionRatesComponent, modalSettings);
    const modal: SessionRatesComponent = modalRef.content;
    modal.modalSave.subscribe(() => {});
  }
}
