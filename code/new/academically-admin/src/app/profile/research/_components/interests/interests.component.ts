import { Component, Injector, Input } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { UserResearchInterestDto, UserResearchInterestDtoPagedResultDto, UserResearchInterestsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateEditInterestComponent } from './create-edit-interest/create-edit-interest.component';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { takeUntil } from '@node_modules/rxjs/operators';

class PagedUserResearchInterestsRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
}

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.less']
})
export class InterestsComponent extends PagedListingComponentBase<UserResearchInterestDto> {
  @Input() userId = this.appSession.userId;
  @Input() isViewOnly = false;
  userResearchInterests: UserResearchInterestDto[];

  constructor(
    injector: Injector,
    private _appSession: AppSessionService,
    private _modalService: BsModalService,
    private _userResearchInterestsService: UserResearchInterestsServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this.pageSize = 5;
  }

  list(request: PagedUserResearchInterestsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.userIdFilter = this.userId;

    this._userResearchInterestsService
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
      .subscribe((result: UserResearchInterestDtoPagedResultDto) => {
        this.userResearchInterests = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onAddClick(): void {
    this.showCreateEditUserResearchInterestMdoal();
  }

  onEditClick(userResearchInterest: UserResearchInterestDto): void {
    this.showCreateEditUserResearchInterestMdoal(_.cloneDeep(userResearchInterest));
  }

  onDeleteClick(userResearchInterest: UserResearchInterestDto): void {
    const options: ModalDialogOptions = {
      title: undefined,
      text: undefined,
      confirmCb: (): void => {
        this._userResearchInterestsService.delete(userResearchInterest.id)
          .subscribe(() => {
            this.notify.success('SuccessfullyDeleted');
            this.pageNumber = 1;
            this.refresh();
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  private showCreateEditUserResearchInterestMdoal(userResearchInterest?: UserResearchInterestDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditInterestComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      userResearchInterest: userResearchInterest,
    };
    const modal = this._modalService.show(CreateEditInterestComponent, modalSettings).content;
    modal.userResearchInterestSaved.subscribe(() => {
      this.pageNumber = 1;
      this.refresh();
    });
  }
}
