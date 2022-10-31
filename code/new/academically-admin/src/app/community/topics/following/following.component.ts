import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, GetDisciplineTaxonomyFollowerCountDto, UserTopicDto, UserTopicDtoPagedResultDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent extends AppComponentBase implements OnInit {

  pagedTopics: UserTopicDtoPagedResultDto;

  followers: GetDisciplineTaxonomyFollowerCountDto[] = [];
  followersMap: Map<string, number> = new Map();

  searchFilter: string;
  currentPage: number;
  skipCount: number;
  maxResultCount: number;

  isLoadingUserTopics = false;
  isUnfollowingTopic = false;
  isSearching = false;

  constructor(
    injector: Injector,
    private _userTopics: UserTopicsServiceProxy,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
  }

  get loading(): boolean { return this.isLoadingUserTopics || this.isUnfollowingTopic || this.isSearching; }

  ngOnInit(): void {}

  getFollowersCount(item: DisciplineTaxonomyDto): number { return this.followersMap.get(item.id) ?? 0; }

  handleOnSearch(searchObj: any): void {
    this.searchFilter = searchObj?.request?.searchFilter;
    this.currentPage = searchObj?.pageNumber;
    this.skipCount = searchObj?.request?.skipCount;
    this.maxResultCount = searchObj?.request?.maxResultCount;

    this.isLoadingUserTopics = true;
    this._userTopics.getAllPaged(this.searchFilter, this.appSession.userId, UserTopicType.Following, 'recent', this.skipCount, this.maxResultCount)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoadingUserTopics = false))
        .pipe(switchMap((pagedTopics) => {
            this.pagedTopics = pagedTopics;
            return this._taxonomyService.getFollowerCount(this.pagedTopics.items.map(t => t.disciplineTaxonomyId));
        }))
        .subscribe(followers => {
            this.followersMap = Utils.toMap(followers, f => f.disciplineTaxonomyId, f => f.followerCount);
        });
  }

  handleOnUnfollow(topic: DisciplineTaxonomyDto): void {
    this.isUnfollowingTopic = true;

    const userTopic = this.pagedTopics.items.find(u => topic.id === u.disciplineTaxonomyId);

    if (userTopic) {
        this._userTopics.delete(userTopic.id)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isUnfollowingTopic = false))
        .subscribe(_ => {
            this.notify.info(this.l('Community.Topics.Unfollow.Success', topic.name));
            this.handleOnSearch(this.searchFilter);
        });
    }
  }
}
