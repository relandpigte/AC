import { Component, Injector, Input, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CreateEditPublicationComponent } from './create-edit-publication/create-edit-publication.component';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import {
  UserPublicationDto,
  UserPublicationDtoPagedResultDto,
  UserPublicationsServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { finalize } from 'rxjs/operators';

class PagedUserPublicationsRequestDto extends PagedAndSortedRequestDto {
  userId: number;
}

@Component({
  selector: 'profile-publications',
  templateUrl: './profile-publications.component.html',
  styleUrls: ['./profile-publications.component.less'],
})
export class ProfilePublicationsComponent extends PagedListingComponentBase<UserPublicationDto> {
  @Input() userId: number;
  @Input() isViewOnly = false;

  publications: UserPublicationDto[] = [];
  keyword: '';
  headers: TableHeaderSortData[] = [
    { title: 'Certificate', sortColumn: 'publicationCertificate' },
    { title: 'Organization', sortColumn: 'publisher', colspan: 2 },
  ];
  constructor(injector: Injector, private _modalService: BsModalService, private _userPublicationsService: UserPublicationsServiceProxy) {
    super(injector);
    this.sorting = this.headers[0].sortColumn;
  }

  list(request: PagedUserPublicationsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.userId = this.userId;

    this._userPublicationsService
      .getAll(this.userId, request.sort, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: UserPublicationDtoPagedResultDto) => {
        this.publications = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onCreateClick(): void {
    this.showCreateOrEditUserDialog();
  }

  onEditClick(id: string): void {
    this.showCreateOrEditUserDialog(id);
  }

  onDeleteClick(id: string): void {
    this.message.confirm('', undefined, (result: boolean) => {
      if (result) {
        this._userPublicationsService.delete(id).subscribe(() => {
          this.notify.success(this.l('SuccessfullyDeleted'));
          this.refresh();
        });
      }
    });
  }

  private showCreateOrEditUserDialog(id?: string): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      id: id,
    };
    const modalRef: BsModalRef = this._modalService.show(CreateEditPublicationComponent, modalSettings);
    const modal: CreateEditPublicationComponent = modalRef.content;
    modal.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
