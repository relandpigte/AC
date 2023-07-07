import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedAndSortedRequestDto
} from 'shared/paged-listing-component-base';
import {
  UserServiceProxy,
  UserDto,
  UserDtoPagedResultDto,
  TestDataGeneratorServiceProxy
} from '@shared/service-proxies/service-proxies';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';

class PagedUsersRequestDto extends PagedAndSortedRequestDto {
  keyword: string;
  isActive: boolean;
  excludeSelf: boolean;
}

@Component({
  templateUrl: './users.component.html',
  animations: [appModuleAnimation()]
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {
  users: UserDto[] = [];
  keyword = '';
  isActive: boolean;
  advancedFiltersVisible = false;
  headers: TableHeaderSortData[] = [
    { title: 'AccountNumber', sortColumn: 'id' },
    { title: 'Name', sortColumn: 'name' },
    { title: 'EmailAddress', sortColumn: 'emailAddress' },
    { title: 'Roles', sortColumn: 'role' },
    { title: 'LastLoginTime', sortColumn: 'lastLoginTime' },
    { title: 'IsActive', colspan: 2 },
  ];
  testRatingsGeneratorLoader: boolean[] = [];

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private _testDataGeneratorSevice: TestDataGeneratorServiceProxy,
  ) {
    super(injector);
    this.sorting = this.headers[0].sortColumn;
  }

  getRoleNames(user: UserDto): string {
    return user.roleDisplayNames.join(', ');
  }

  onCreateClick(): void {
    this.showCreateOrEditUserDialog();
  }

  onEditClick(user: UserDto): void {
    this.showCreateOrEditUserDialog(user.id);
  }

  onResetPasswordClick(user: UserDto): void {
    this.showResetPasswordUserDialog(user.id);
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
          this._userService.delete(user.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  onGenerateRatingsClick(user: UserDto): void {
    this.testRatingsGeneratorLoader[user.id] = true;
    const isTutor = user.roleNames.findIndex(e => e.toLowerCase() === 'tutor') >= 0;
    (isTutor
      ? this._testDataGeneratorSevice.generateTestRatingsForTutor(user.id, 300)
      : this._testDataGeneratorSevice.generateTestRatingsForStudent(user.id, 300))
      .pipe(
        finalize(() => {
          this.testRatingsGeneratorLoader[user.id] = false;
        })
      )
      .subscribe(() => {
        this.notify.success('The ratings were added.');
      });
  }

  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    request.excludeSelf = false;

    this._userService
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
      .subscribe((result: UserDtoPagedResultDto) => {
        this.users = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private showResetPasswordUserDialog(id?: number): void {
    this._modalService.show(ResetPasswordDialogComponent, {
      class: 'modal-lg',
      initialState: {
        id: id,
      },
    });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateUserDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditUserDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
