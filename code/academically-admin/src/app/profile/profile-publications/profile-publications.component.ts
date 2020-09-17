import { Component, Injector, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CreateEditPublicationComponent } from './create-edit-publication/create-edit-publication.component';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import {
  UserPublicationsServiceProxy,
  GetPublicationDto,
  GetPublicationDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { finalize } from 'rxjs/operators';

class PagedPublicationsRequestDto extends PagedAndSortedRequestDto {
  UserId: number;
  keyword: string;
}
@Component({
  selector: 'profile-publications',
  templateUrl: './profile-publications.component.html',
  styleUrls: ['./profile-publications.component.less']
})
export class ProfilePublicationsComponent extends PagedListingComponentBase<GetPublicationDto> {
  publications: GetPublicationDto[] = [];
  keyword: '';
  userId: number;
  headers: TableHeaderSortData[] = [
    { title: 'Certificate', sortColumn: 'publicationCertificate' },
    { title: 'Organization', sortColumn: 'publisher', colspan: 2  },
  ];
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _userPublicationsService: UserPublicationsServiceProxy
  ) {
    super(injector);
    this.userId = this.appSession.userId;
    this.sorting = this.headers[0].sortColumn;
  }

  list(
    request: PagedPublicationsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._userPublicationsService
      .getAll(
        this.userId,
        request.keyword,
        request.sort,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: GetPublicationDtoPagedResultDto) => {
        this.publications = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onFormSubmit(): void {
  }

  onCreateClick(): void {
    this.showCreateOrEditUserDialog();
  }
  onEditClick(id: string): void {
    this.showCreateOrEditUserDialog(id);
  }
  onDeleteClick(id: string): void {
    this.message.confirm('', undefined,
      (result: boolean) => {
        if (result) {
          this._userPublicationsService.delete(id).subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  private showCreateOrEditUserDialog(id?: string): void {
    let createOrEditUserDialog: BsModalRef;
      createOrEditUserDialog = this._modalService.show(
        CreateEditPublicationComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
            userId: this.userId
          },
        }
      );

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
