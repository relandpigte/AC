import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  UserDto,
  EventsServiceProxy,
  CreateEventPresenterDto,
  EventPresenterType,
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { finalize, takeUntil } from 'rxjs/operators';

class PagedUserRequestDto extends PagedAndSortedRequestDto {
  eventIdFilter: string;
  searchFilter?: string;
}

@Component({
  selector: 'app-invite-presenter',
  templateUrl: './invite-presenter.component.html',
  styleUrls: ['./invite-presenter.component.less']
})
export class InvitePresenterComponent extends PagedListingComponentBase<UserDto> implements OnInit {
  @Input() eventId: string;
  @Output() presenterInvited = new EventEmitter();

  users: UserDto[] = [];
  searchFilter: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _eventsService: EventsServiceProxy,
  ) {
    super(injector);
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onInviteClick(user: UserDto): void {
    this.isTableLoading = true;
    this._eventsService.invitePresenter(new CreateEventPresenterDto({
      type: EventPresenterType.Guest,
      eventId: this.eventId,
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
    request.eventIdFilter = this.eventId;
    request.searchFilter = this.searchFilter;

    this._eventsService
      .getPresentersForInvite(
        request.eventIdFilter,
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
