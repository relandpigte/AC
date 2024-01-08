import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { PostsServiceProxy, PostType, SearchFollowingInvitedDto, UserFollowerInvitedDto, UserFollowersServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss'],
  providers: [ TitleCasePipe ]
})
export class InviteUserComponent extends AppComponentBase implements OnInit {
  postId: string;
  postType: number;
  activeTab: string = 'following';

  isAllowLoading = true;
  isSearching = false;

  followedUsers: Map<string, UserFollowerInvitedDto> = new Map();
  rowLoaders: Map<string, { isInvitingUser?: boolean }> = new Map();

  searchFilter: string;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modal: BsModalRef,
    private _cdr: ChangeDetectorRef,
    private _titleCasePipe: TitleCasePipe,
    private _userFollowersService: UserFollowersServiceProxy,
    private _postsService: PostsServiceProxy
  ) {
    super(injector);
  }

  get isLoading(): boolean { return this.isSearching || this.isSomeRowsLoading; }
  get isSomeRowsLoading(): boolean { return Array.from(this.rowLoaders.keys()).some(k => this.isRowLoading(k)); }
  get followedUsersValues(): any { return Array.from(this.followedUsers.values()); }
  get postTypeName(): string { return PostType[this.postType]?.toLowerCase(); }
  get popupTitle(): string { return PostType.Discussion === this.postType ? 'discussion' : 'answer'; }

  searchProcess$ = (searchFilter: string) => {
    this.searchFilter = searchFilter;

    const request = new SearchFollowingInvitedDto();
    request.keyword = searchFilter;
    request.take = 10;
    request.postId = this.postId;
    request.inviterUserId = this.appSession.userId;
    request.isInvitedOnly = this.activeTab === 'invited';

    return this._userFollowersService.searchFollowingInvited(request)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => {
        this.isSearching = false;
      }));
  }

  ngOnInit(): void {
    this.handleOnSearch(this.searchFilter);
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  navigateToAllTopics(): void {
    this.onCloseClick();
    this._router.navigate(['app', 'community', 'topics' ]);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.handleOnSearch(this.searchFilter);
    this._cdr.detectChanges();
  }

  setRowLoading(id: string, property: string, value: boolean): void {
    if (!this.rowLoaders.has(id)) this.rowLoaders.set(id, {});
    const rowLoaders = this.rowLoaders.get(id);
    rowLoaders[property] = value;
    if (Object.keys(rowLoaders).every(p => !rowLoaders[p])) this.rowLoaders.delete(id);
    this.resetIsAllowLoading();
  }

  resetIsAllowLoading(): void {
    if (!this.isAllowLoading && !this.isSomeRowsLoading) this.isAllowLoading = true;
  }

  isRowLoading(id: string, property?: string): boolean {
    const rowLoaders = this.rowLoaders.get(id);
    if (!rowLoaders) return false;
    if (property) return rowLoaders[property];
    else return Object.keys(rowLoaders).some(p => rowLoaders[p]);
  }

  isShowInviteButtons(userFollower: UserFollowerInvitedDto): boolean {
    return userFollower.isInvited === false;
  }

  isShowInvitedButtons(userFollower: UserFollowerInvitedDto): boolean {
    return userFollower.isInvited === true;
  }

  handleOnSearch(searchFilter: string): void {
    this.isSearching = true;
    this.searchProcess$(searchFilter)
        .subscribe(topics => {
            this.updateSearchResults(topics);
        });
  }

  handleOnInvite(userFollower: UserFollowerInvitedDto): void {
    this.isAllowLoading = false;
    this.setRowLoading(userFollower.id, 'isInvitingUser', true);

    this._postsService.createPostInvitation(
      this.postId,
      userFollower.userId,
      this.currentUserId
    )
    .pipe(switchMap(() => this.searchProcess$(this.searchFilter)))
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => {
      this.setRowLoading(userFollower.id, 'isInvitingUser', false);
      this.updateFollowedUserFromData(userFollower, true);
    }))
    .subscribe(() => {
      this.notify.info(`You have invited ${ this._titleCasePipe.transform(userFollower.user.name) } to this ${this.postTypeName}.`);
    });
  }

  private updateSearchResults(followedUsers: UserFollowerInvitedDto[]): void {
    if (this.isAllowLoading) this.followedUsers = Utils.toMap(followedUsers, f => f.id);
    else followedUsers.forEach(f => Utils.assignToMap(this.followedUsers, f.id, f, true));
  }

  private updateFollowedUserFromData(followedUser: UserFollowerInvitedDto, isInvited: boolean): void {
    let existing = this.followedUsers.get(followedUser.id);
    existing.isInvited = isInvited;
    this.followedUsers.set(followedUser.id, existing);
  }
}
