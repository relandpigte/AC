import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { CreateEventPresenterDto, EventPresenterType, EventsServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
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
    private _workshopsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onInviteClick(user: UserDto): void {
    this.isTableLoading = true;
    this._workshopsService.invitePresenter(new CreateEventPresenterDto({
      type: EventPresenterType.Guest,
      eventId: this.workshopId,
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
