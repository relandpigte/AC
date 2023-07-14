import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { Utils } from '@shared/helpers/utils';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, GetDisciplineTaxonomyFollowerCountDto, UserTopicDtoPagedResultDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';


@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent extends AppComponentBase implements OnInit {

  pagedTopics: UserTopicDtoPagedResultDto;

  followers: GetDisciplineTaxonomyFollowerCountDto[] = [];
  followersMap: Map<string, number> = new Map();

  searchObj: any;

  isLoadingUserTopics = true;
  isUnfollowingTopic = false;
  isSearching = false;

  constructor(
    injector: Injector,
    private _userTopics: UserTopicsServiceProxy,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
  }

  get shimmerType() { return ShimmerType; }
  get loading(): boolean { return this.isLoadingUserTopics || this.isUnfollowingTopic || this.isSearching; }

  ngOnInit(): void {}

  getFollowersCount(item: DisciplineTaxonomyDto): number { return this.followersMap.get(item.id) ?? 0; }

  handleOnSearch(searchObj: any): void {
    this.searchObj = searchObj;

    this._userTopics.getAllPaged(
      searchObj?.request?.searchFilter,
      this.appSession.userId,
      UserTopicType.Following,
      TopicSorting.Recent,
      searchObj?.request?.skipCount,
      searchObj?.request?.maxResultCount
    )
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
            this.handleOnSearch(this.searchObj);
        });
    }
  }
}
