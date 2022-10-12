import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  UserDto,
  WorkshopsServiceProxy,
  CreateWorkshopPresenterDto,
  WorkshopPresenterType,
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { finalize, takeUntil } from 'rxjs/operators';

class PagedUserRequestDto extends PagedAndSortedRequestDto {
  workshopIdFilter: string;
  searchFilter?: string;
}

@Component({
  selector: 'app-invite-presenter',
  templateUrl: './invite-presenter.component.html',
  styleUrls: ['./invite-presenter.component.less']
})
export class InvitePresenterComponent extends PagedListingComponentBase<UserDto> implements OnInit {
  @Input() workshopId: string;
  @Output() presenterInvited = new EventEmitter();

  users: UserDto[] = [];
  searchFilter: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _workshopsService: WorkshopsServiceProxy,
  ) {
    super(injector);
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onInviteClick(user: UserDto): void {
    this.isTableLoading = true;
    this._workshopsService.invitePresenter(new CreateWorkshopPresenterDto({
      type: WorkshopPresenterType.Guest,
      workshopId: this.workshopId,
      email: user.emailAddress,
    }))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.presenterInvited.emit();
        this._modal.hide();
      });
  }

  protected list(
    request: PagedUserRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.workshopIdFilter = this.workshopId;
    request.searchFilter = this.searchFilter;

    this._workshopsService
      .getPresentersForInvite(
        request.workshopIdFilter,
        request.searchFilter,
        request.skipCount,
        request.maxResultCount,
      )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        this.users = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
