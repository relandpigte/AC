import { Component, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { UserPublicationDto, UserPublicationDtoPagedResultDto, UserPublicationsServiceProxy, UserResearchMethodologyDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateEditResearchPublicationComponent } from './create-edit-research-publication/create-edit-research-publication.component';

class PagedUserPublicationsRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter: string;
}

@Component({
  selector: 'app-research-publications',
  templateUrl: './research-publications.component.html',
  styleUrls: ['./research-publications.component.less']
})
export class ResearchPublicationsComponent extends PagedListingComponentBase<UserResearchMethodologyDto> {
  userPublications: UserPublicationDto[];
  searchFilter: string;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _userPublicationsService: UserPublicationsServiceProxy,
  ) {
    super(injector);
    this.pageSize = 5;
  }

  list(request: PagedUserPublicationsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.userIdFilter = this.appSession.userId;
    request.searchFilter = this.searchFilter

    this._userPublicationsService
      .getPaged(
        request.userIdFilter,
        request.searchFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: UserPublicationDtoPagedResultDto) => {
        this.userPublications = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onSearchSubmit(): void {
    this.pageNumber = 1;
    this.refresh();
  }

  onAddClick(): void {
    this.showCreateEditPublicationModal();
  }

  onEditClick(userPublication: UserPublicationDto): void {
    this.showCreateEditPublicationModal(_.cloneDeep(userPublication));
  }

  onDeleteClick(userPublication: UserPublicationDto): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this._userPublicationsService.delete(userPublication.id)
            .subscribe(() => {
              this.notify.success('SuccessfullyDeleted');
              this.pageNumber = 1;
              this.refresh();
            })
        }
      }
    );
  }

  private showCreateEditPublicationModal(userPublication?: UserPublicationDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditResearchPublicationComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userPublication: userPublication,
    };
    const modal = this._modalService.show(CreateEditResearchPublicationComponent, modalSettings).content;
    modal.userPublicationSaved.subscribe(() => {
      this.pageNumber = 1;
      this.refresh();
    });
  }
}
