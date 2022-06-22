import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  UserDto,
  CoachingsServiceProxy,
  CreateCoachingPresenterDto,
  CoachingPresenterType,
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { finalize, takeUntil } from 'rxjs/operators';

class PagedUserRequestDto extends PagedAndSortedRequestDto {
  coachingIdFilter: string;
  searchFilter?: string;
}

@Component({
  selector: 'app-invite-presenter',
  templateUrl: './invite-presenter.component.html',
  styleUrls: ['./invite-presenter.component.less']
})
export class InvitePresenterComponent extends PagedListingComponentBase<UserDto> implements OnInit {
  @Input() coachingId: string;
  @Output() presenterInvited = new EventEmitter();

  users: UserDto[] = [];
  searchFilter: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _coachingsService: CoachingsServiceProxy,
  ) {
    super(injector);
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onInviteClick(user: UserDto): void {
    this.isTableLoading = true;
    this._coachingsService.invitePresenter(new CreateCoachingPresenterDto({
      type: CoachingPresenterType.Guest,
      coachingId: this.coachingId,
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
    request.coachingIdFilter = this.coachingId;
    request.searchFilter = this.searchFilter;

    this._coachingsService
      .getPresentersForInvite(
        request.coachingIdFilter,
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
