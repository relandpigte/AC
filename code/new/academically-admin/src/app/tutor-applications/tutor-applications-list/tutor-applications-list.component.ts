import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from '@app/users/reset-password/reset-password.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { TutorApplicationServiceProxy, TutorVerificationDto, TutorVerificationStatus, UserDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

class PagedUsersRequestDto extends PagedAndSortedRequestDto {
  keyword: string;
  isActive: boolean;
  excludeSelf: boolean;
}

@Component({
  selector: 'app-tutor-applications-list',
  templateUrl: './tutor-applications-list.component.html',
  styleUrls: ['./tutor-applications-list.component.less'],
  animations: [appModuleAnimation()]
})
export class TutorApplicationsListComponent extends PagedListingComponentBase<UserDto> {
  tutorApplications: TutorVerificationDto[] = [];
  TutorVerificationStatus = TutorVerificationStatus;
  keyword = '';
  isActive: boolean;
  advancedFiltersVisible = false;
  headers: TableHeaderSortData[] = [
    { title: 'AccountNumber', sortColumn: 'creatorUser.id' },
    { title: this.l('Name'), sortColumn: 'creatorUser.name' },
    { title: this.l('EmailAddress'), sortColumn: 'creatorUser.emailAddress' },
    { title: this.l('Status'), sortColumn: 'status', colspan: 2},
  ];
  testRatingsGeneratorLoader: boolean[] = [];

  constructor(
    injector: Injector,
    private _router: Router,
    private _tutorApplicationService: TutorApplicationServiceProxy,
  ) {
    super(injector);
    this.sorting = this.headers[0].sortColumn;
  }

  getRoleNames(user: UserDto): string {
    return user.roleDisplayNames.join(', ');
  }

  onViewClick(id: string): void {
    this._router.navigate([ '/app/tutor-applications/' + id ]);
  }

  onClearFiltersClick(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  onDeleteClick(user: UserDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', user.fullName),
      undefined,
      (result: boolean) => {
        if (result) {
          // this._tutorApplicationService.delete(user.id).subscribe(() => {
          //   abp.notify.success(this.l('SuccessfullyDeleted'));
          //   this.refresh();
          // });
        }
      }
    );
  }

  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    request.excludeSelf = false;

    this._tutorApplicationService
      .getAll(
        request.keyword,
        request.isActive,
        request.excludeSelf,
        request.sort,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        this.tutorApplications = result.items;
        this.showPaging(result, pageNumber);
      });
  }


  private showCreateOrEditUserDialog(id?: number): void {
    // let createOrEditUserDialog: BsModalRef;
    // if (!id) {
    //   createOrEditUserDialog = this._modalService.show(
    //     CreateUserDialogComponent,
    //     {
    //       class: 'modal-lg',
    //     }
    //   );
    // } else {
    //   createOrEditUserDialog = this._modalService.show(
    //     EditUserDialogComponent,
    //     {
    //       class: 'modal-lg',
    //       initialState: {
    //         id: id,
    //       },
    //     }
    //   );
    // }

    // createOrEditUserDialog.content.onSave.subscribe(() => {
    //   this.refresh();
    // });
  }
}
