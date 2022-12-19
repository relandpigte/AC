import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, DisciplineTaxonomyDtoPagedResultDto, UserTopicsServiceProxy, UserTopicType, UserTopicDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-children-topics',
    templateUrl: './children.component.html',
    styleUrls: ['./children.component.scss']
})
export class ChildrenComponent extends AppComponentBase implements OnInit {
  id: string;

  topic: DisciplineTaxonomyDto;
  clusteredTopics: any = { 'Topic': this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomCoaching()), 3) };
  pagedTopics: DisciplineTaxonomyDtoPagedResultDto;

  topicInFocus: string;

  searchObj: any;

  isAllowLoading = true;
  isLoadingTaxonomyChildren = false;
  isLoadingTaxonomyInfo = false;
  isLoadingTopics = false;
  isFollowingTopic = false;
  isUnfollowingTopic = false;
  isSearching = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    private _userTopics: UserTopicsServiceProxy
  ) {
    super(injector);

    this._route.paramMap.subscribe(paramMap => {
        if (paramMap.has('id')) {
          this.id = paramMap.get('id');
        }
    });
  }

  get loading(): boolean {
    return this.isLoadingTaxonomyInfo || this.isLoadingTaxonomyChildren || this.isLoadingTopics || this.isFollowingTopic
      || this.isUnfollowingTopic || this.isSearching;
  }

  ngOnInit(): void {
    this.loadTaxonomyInfo();
    this.loadTaxonomyChildren();
  }

  private loadTaxonomyInfo(): void {
    this.isLoadingTaxonomyInfo = true;
    this._taxonomyService.get(this.id)
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoadingTaxonomyInfo = false))
    .subscribe(topic => this.topic = topic);
  }

  private loadTaxonomyChildren(): void {
    this.isLoadingTaxonomyChildren = true;
    this._taxonomyService.getAll(
      this.id,
      undefined,
      true,
      true,
      TopicSorting.ForYou
    )
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoadingTaxonomyChildren = false))
    .subscribe(topics => this.clusteredTopics = topics.reduce((topics, t) => ({...topics, [t.name] : this.chunkArrayInGroups(t.children, 3) }), {}));
  }

  private updateTopicFromPagedData(topic: DisciplineTaxonomyDto, isFollowing: boolean): void {
    this.pagedTopics.items.forEach(t => {
      if (t.id === topic.id) {
        if (isFollowing && !t.userTopics.some(u => u.userId === this.appSession.userId)) {
          t.userTopics.push({ userId: this.appSession.userId, type: UserTopicType.Following } as UserTopicDto);
        } else {
          t.userTopics = t.userTopics.filter(u => !(u.userId === this.appSession.userId && u.type === UserTopicType.Following));
        }
      }
    });
  }

  isFollowed(topic: DisciplineTaxonomyDto): boolean {
    return topic.userTopics.some(u => u.userId === this.appSession.userId && u.type === UserTopicType.Following);
  }

  handleOnSearch(searchObj: any, isAllowLoading = true): void {
    this.searchObj = searchObj;

    this.isLoadingTopics = isAllowLoading;
    this._taxonomyService.getAllPaged(
      this.id,
      searchObj?.request?.searchFilter,
      true,
      true,
      TopicSorting.Recent,
      searchObj?.request?.skipCount,
      searchObj?.request?.maxResultCount
    )
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoadingTopics = false))
    .subscribe((pagedTopics) => this.pagedTopics = pagedTopics);
  }

  handleOnFollow(topic: DisciplineTaxonomyDto): void {
    this.isAllowLoading = false;
    this.isFollowingTopic = true;
    this.topicInFocus = topic.id;

    const userTopic = this.pagedTopics.items.find(t => topic.id === t.id);

    if (userTopic) {
      const request = new CreateUserTopicDto();
      request.userId = this.appSession.userId;
      request.disciplineTaxonomyId = topic.id;
      request.type = UserTopicType.Following;

      this._userTopics.create(request)
          .pipe(takeUntil(this.destroyed$))
          .pipe(finalize(() => {
            this.isFollowingTopic = false;
            this.isAllowLoading = true;
            this.topicInFocus = undefined;
            this.handleOnSearch(this.searchObj, false);
          }))
          .subscribe(_ => {
              this.notify.info(this.l('Community.Topics.Follow.Success', topic.name));
          });
    }
  }

  handleOnUnfollow(topic: DisciplineTaxonomyDto): void {
    this.isAllowLoading = false;
    this.isUnfollowingTopic = true;
    this.topicInFocus = topic.id;

    this._userTopics.deleteByTopicId(topic.id)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => {
          this.isUnfollowingTopic = false;
          this.isAllowLoading = true;
          this.topicInFocus = undefined;
            this.handleOnSearch(this.searchObj, false);
        }))
        .subscribe(_ => {
          this.notify.info(this.l('Community.Topics.Unfollow.Success', topic.name));
        });
  }
}
