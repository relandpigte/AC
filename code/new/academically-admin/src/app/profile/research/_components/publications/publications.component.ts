import { Component, Injector, Input } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { UserResearchMethodologyDto, UserPublicationDto, UserPublicationsServiceProxy, UserPublicationDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateEditPublicationComponent } from './create-edit-publication/create-edit-publication.component';

class PagedUserPublicationsRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter: string;
  publicationType: number;
}

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.less']
})
export class PublicationsComponent extends PagedListingComponentBase<UserResearchMethodologyDto> {
  @Input() userId: number;
  @Input() isViewOnly = false;
  userPublications: UserPublicationDto[];
  searchFilter: string;
  keyword = '';
  publicationType: number;

  constructor(
    injector: Injector,
    private _appSession: AppSessionService,
    private _modalService: BsModalService,
    private _userPublicationsService: UserPublicationsServiceProxy,
  ) {
    super(injector);
    this.pageSize = 5;
  }

  list(request: PagedUserPublicationsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.userIdFilter = this.userId ?? this._appSession.userId;
    request.publicationType = this.publicationType
    request.searchFilter = this.searchFilter

    this._userPublicationsService
      .getPaged(
        request.userIdFilter,
        request.searchFilter,
        request.publicationType,
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
            });
        }
      }
    );
  }

  private showCreateEditPublicationModal(userPublication?: UserPublicationDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditPublicationComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userPublication: userPublication,
    };
    const modal = this._modalService.show(CreateEditPublicationComponent, modalSettings).content;
    modal.userPublicationSaved.subscribe(() => {
      this.pageNumber = 1;
      this.refresh();
    });
  }

  onClearFiltersClick(): void {
    this.keyword = '';
    this.publicationType = undefined;
    this.getDataPage(1);
  }
}
