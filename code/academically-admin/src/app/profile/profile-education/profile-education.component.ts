import { Component, Injector, OnInit } from '@angular/core';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { UserEducationDto, UserEducationDtoPagedResultDto, UserEducationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateEditProfileEducationComponent } from './create-edit-profile-education/create-edit-profile-education.component';

@Component({
  selector: 'profile-education',
  templateUrl: './profile-education.component.html',
  styleUrls: ['./profile-education.component.less']
})
export class ProfileEducationComponent extends PagedListingComponentBase<UserEducationDto> {
  userEducations: UserEducationDto[] = [];
  headers: TableHeaderSortData[] = [
    { title: 'UniversityOrCollege', sortColumn: 'universityOrCollege' },
    { title: 'Degree', sortColumn: 'degree' },
    { title: 'StartYear', sortColumn: 'startYear' },
    { title: 'EndYear', sortColumn: 'endYear' },
    { title: 'Level', sortColumn: 'level', colspan: 2 },
  ];

  constructor(
    injector: Injector,
    private _userEducations: UserEducationsServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
    this.sorting = this.headers[0].sortColumn;
  }

  list(request: PagedAndSortedRequestDto, pageNumber: number, finishedCallback: Function): void {

    this._userEducations
      .getAll(request.skipCount, request.maxResultCount, request.sort)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: UserEducationDtoPagedResultDto) => {
        this.userEducations = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onCreateClick(): void {
    this.showCreateEditModal();
  }

  onEditClick(id: string): void {
    this.showCreateEditModal(id);
  }

  onDeleteClick(id: string): void {
    abp.message.confirm('', undefined,
      (result: boolean) => {
        if (result) {
          this._userEducations.delete(id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  private showCreateEditModal(id = ''): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      id: id,
    };
    const modalRef = this._modalService.show(CreateEditProfileEducationComponent, modalSettings);
    const modal: CreateEditProfileEducationComponent = modalRef.content;
    modal.modalSave.subscribe(() => {
      this.refresh();
    });
  }
}
