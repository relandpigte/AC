import { Component, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { UserResearchMethodologiesServiceProxy, UserResearchMethodologyDto, UserResearchMethodologyDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash-es';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateEditResearchMethodologyComponent } from './create-edit-research-methodology/create-edit-research-methodology.component';

class PagedUserResearchMethodologiesRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
}

@Component({
  selector: 'app-research-methodologies',
  templateUrl: './research-methodologies.component.html',
  styleUrls: ['./research-methodologies.component.less']
})
export class ResearchMethodologiesComponent extends PagedListingComponentBase<UserResearchMethodologyDto> {
  userResearchMethodologies: UserResearchMethodologyDto[];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _userResearchMethodologiesService: UserResearchMethodologiesServiceProxy
  ) {
    super(injector);
    this.pageSize = 5;
  }

  list(request: PagedUserResearchMethodologiesRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.userIdFilter = this.appSession.userId;

    this._userResearchMethodologiesService
      .getPaged(
        request.userIdFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: UserResearchMethodologyDtoPagedResultDto) => {
        this.userResearchMethodologies = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onAddClick(): void {
    this.showCreateEditUserResearchMethodologyModal();
  }

  onEditClick(userResearchMethodology: UserResearchMethodologyDto): void {
    this.showCreateEditUserResearchMethodologyModal(_.cloneDeep(userResearchMethodology));
  }

  onDeleteClick(userResearchMethod: UserResearchMethodologyDto): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this._userResearchMethodologiesService.delete(userResearchMethod.id)
            .subscribe(() => {
              this.notify.success('SuccessfullyDeleted');
              this.pageNumber = 1;
              this.refresh();
            })
        }
      }
    );
  }

  private showCreateEditUserResearchMethodologyModal(userResearchMethodology?: UserResearchMethodologyDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditResearchMethodologyComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userResearchMethodology,
    };
    const modal = this._modalService.show(CreateEditResearchMethodologyComponent, modalSettings).content;
    modal.userResearchMethodologySaved.subscribe(() => {
      this.pageNumber = 1;
      this.refresh();
    });
  }
}
