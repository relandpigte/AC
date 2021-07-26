import { Component, Injector, Input } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { UserResearchMethodologyDto, UserResearchMethodologiesServiceProxy, UserResearchMethodologyDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateEditMethodologyComponent } from './create-edit-methodology/create-edit-methodology.component';

class PagedUserResearchMethodologiesRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
}

@Component({
  selector: 'app-methodologies',
  templateUrl: './methodologies.component.html',
  styleUrls: ['./methodologies.component.less']
})
export class MethodologiesComponent extends PagedListingComponentBase<UserResearchMethodologyDto> {
  @Input() userId: number;
  @Input() isViewOnly = false;
  userResearchMethodologies: UserResearchMethodologyDto[];

  constructor(
    injector: Injector,
    private _appSession: AppSessionService,
    private _modalService: BsModalService,
    private _userResearchMethodologiesService: UserResearchMethodologiesServiceProxy
  ) {
    super(injector);
    this.pageSize = 5;
  }

  list(request: PagedUserResearchMethodologiesRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.userIdFilter = this.userId ?? this._appSession.userId;

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
            });
        }
      }
    );
  }

  private showCreateEditUserResearchMethodologyModal(userResearchMethodology?: UserResearchMethodologyDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditMethodologyComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userResearchMethodology,
    };
    const modal = this._modalService.show(CreateEditMethodologyComponent, modalSettings).content;
    modal.userResearchMethodologySaved.subscribe(() => {
      this.pageNumber = 1;
      this.refresh();
    });
  }
}
