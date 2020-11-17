import { Component, Injector, Input, OnInit } from '@angular/core';
import { ResearchMethodsSearchComponent } from '@app/shared/research-methods-search/research-methods-search.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ResearchMethodDto, ResearchMethodsServiceProxy, UserProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'profile-research-methods',
  templateUrl: './profile-research-methods.component.html',
  styleUrls: ['./profile-research-methods.component.less']
})
export class ProfileResearchMethodsComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
  @Input() isViewOnly = false;
  researchMethods: ResearchMethodDto[] = [];
  isLoading = false;

  constructor(injector: Injector, private _userProfilesService: UserProfilesServiceProxy, private _modalService: BsModalService) {
    super(injector);
  }

  ngOnInit(): void {
    this.getResearchMethodsOfUser();
  }

  onAddClick(): void {
    this.showResearchMethodsSearchModal();
  }

  onRemoveClick(researchMethodId: string): void {
    this.removeResearchMethodFromUser(researchMethodId);
  }

  private getResearchMethodsOfUser(): void {
    this.isLoading = true;
    this._userProfilesService
      .getResearchMethods(this.userId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(researchMethods => {
        this.researchMethods = researchMethods;
      });
  }

  private addResearchMethodsToUser(researchMethodIds: string[]): void {
    this.isLoading = true;
    this._userProfilesService
      .createManyResearchMethods(researchMethodIds)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('TheResearchMethodsWereAdded'));
        this.getResearchMethodsOfUser();
      });
  }

  private removeResearchMethodFromUser(researchMethodId: string): void {
    this.isLoading = true;
    this._userProfilesService
      .deleteResearchMethod(this.userId, researchMethodId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('TheResearchMethodWasRemoved'));
        this.getResearchMethodsOfUser();
      });
  }

  private showResearchMethodsSearchModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userId: this.userId
    };
    const modalRef = this._modalService.show(ResearchMethodsSearchComponent, modalSettings);
    const modal: ResearchMethodsSearchComponent = modalRef.content;
    modal.modalSave.subscribe((selectedMethods: ResearchMethodDto[]) => {
      const methodIds = selectedMethods.map(e => e.id);
      this.addResearchMethodsToUser(methodIds);
    });
  }
}
