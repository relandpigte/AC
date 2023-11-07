import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, UserTopicDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { BehaviorSubject, combineLatest, of } from 'rxjs';

export const NUMBER_OF_TOPICS_TO_LOAD = 50;

@Component({
  selector: 'app-all-topics',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.less']
})
export class AllComponent extends AppComponentBase implements OnInit {

  parentTopics: any = this.chunkArrayInGroups(Array(12).fill([]).map(() => this.generateRandomTopic()), 3);
  forYouTopics: any = this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomTopic()), 3);
  tailoredTopics: any;

  forYouTopicsMap: Map<string, any> = new Map();
  tailoredTopicsMap: Map<string, Map<string, any>> = new Map();

  forYouTopicsList: DisciplineTaxonomyDto[];
  tailoredTopicsList: { [key: string]: DisciplineTaxonomyDto[] } = {};
  isLoading_forYouTopicsList$ = new BehaviorSubject<boolean>(false);
  isLoading_tailoredTopicsList$: { [key:string]: BehaviorSubject<boolean> } = {};
  forYouTopicsListMaxItems: number = 0;
  tailoredTopicsListMaxItems: { [key:string]: number } = {};

  isLoadingParentTopics = false;
  isFollowingTopic = false;
  isUnfollowingTopic = false;
  isRemovingTopic = false;
  ShimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    private _userTopics: UserTopicsServiceProxy
  ) {
    super(injector);
  }

  get loadingSources$() {
    return [
      new BehaviorSubject(this.isLoadingParentTopics),
      new BehaviorSubject(this.isFollowingTopic),
      new BehaviorSubject(this.isUnfollowingTopic),
      new BehaviorSubject(this.isRemovingTopic),
      this.isLoading_forYouTopicsList$,
      ...(this.isLoading_tailoredTopicsList$ ? Object.values(this.isLoading_tailoredTopicsList$) : [new BehaviorSubject(false)]),
    ];
  }

  get isLoading$() { return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }

  ngOnInit(): void {
    this.loadParentTopics();
    this.loadForYouTopics();
  }

  handleForYouTopicsListRequestData(): void {
    this.loadInfiniteData(
      this._taxonomyService,
      'getAllLastChildrenPaged',
      [undefined, undefined, true, undefined, TopicSorting.ForYou, this.forYouTopicsList.length, NUMBER_OF_TOPICS_TO_LOAD],
      'forYouTopicsList',
      {
        allowLoader: false,
        callback: () => {
          this.updateForYouTopicsMap(this.forYouTopicsList);
          this.forYouTopics = this.chunkArrayInGroups(Array.from(this.forYouTopicsMap.values()), 3);
        }
      }
    );
  }

  handleTopicClick(topic: any): void {
    if (!topic?.children?.length) {
      return;
    }
    this._router.navigate(['app', 'community', 'topics', 'view', topic.id]);
  }

  handleViewAllTopicsClick(topicId: string): void {
    this._router.navigate(['app', 'community', 'topics', 'view', topicId]);
  }

  handleTopicFollowClick(key: string, topic: any): void {
    const request = new CreateUserTopicDto();
    request.userId = this.appSession.userId;
    request.disciplineTaxonomyId = topic.id;
    request.type = UserTopicType.Following;

    this._userTopics.create(request)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isFollowingTopic = false))
      .subscribe(_ => {
        topic.userTopics.push(request as UserTopicDto);
        this.refreshTopicLists(topic);
        this.notify.info(this.l('Community.Topics.Follow.Success', topic.name));
      });
  }

  handleTopicUnfollowClick(key: string, topic: any): void {
    this._userTopics.deleteByTopicId(topic.id)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isUnfollowingTopic = false))
      .subscribe(_ => {
        topic.userTopics = topic.userTopics.filter(t => t.disciplineTaxonomyId !== topic.id);
        this.refreshTopicLists(topic);
        this.notify.info(this.l('Community.Topics.Unfollow.Success', topic.name));
      });
  }

  handleTopicRemoveClick(key: string, topic: any): void {
    this.isRemovingTopic = true;

    const request = new CreateUserTopicDto();
    request.userId = this.appSession.userId;
    request.disciplineTaxonomyId = topic.id;
    request.type = UserTopicType.NotInterested;

    this._userTopics.create(request)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isRemovingTopic = false))
      .subscribe(_ => {
        topic.userTopics.push(request as UserTopicDto);
        this.refreshTopicLists(topic);
        this.notify.info(this.l('Community.Topics.NotInterested.Success', topic.name));
      });
  }

  handleTailoredTopicsListRequestData(groupId: string): void {
    this.loadInfiniteData(
      this._taxonomyService,
      'getAllPaged',
      [ groupId, undefined, true, true, TopicSorting.ForYou, this.tailoredTopicsList[groupId].length, NUMBER_OF_TOPICS_TO_LOAD ],
      'tailoredTopicsList',
      {
        destinationFieldKey: groupId,
        allowLoader: false,
        callback: () => {
          this.updateTailoredTopicsMap(groupId, this.tailoredTopicsList[groupId]);
          this.tailoredTopics[groupId].items = this.chunkArrayInGroups(Array.from(this.tailoredTopicsMap.get(groupId).values()), 3);
        }
      }
    );
  }

  private loadTailoredTopics(topics: any): void {
    this.tailoredTopics = topics.reduce((topics, t) => ({...topics,
        [t.id]: {
          name: t.name,
          items: this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomCoaching()), 3)
        }
      }), {});
    this.tailoredTopicsList = topics.reduce((topics, t) => ({ ...topics, [t.id]: [] }), {});
    this.isLoading_tailoredTopicsList$ = topics.reduce((topics, t) => ({ ...topics, [t.id]: new BehaviorSubject(false) }), {});
    this.tailoredTopicsListMaxItems = topics.reduce((topics, t) => ({ ...topics, [t.id]: 0 }), {});

    topics.forEach(t => this.loadInfiniteData(
      this._taxonomyService,
      'getAllPaged',
      [ t.id, undefined, true, true, TopicSorting.ForYou, 0, NUMBER_OF_TOPICS_TO_LOAD ],
      'tailoredTopicsList',
      {
        destinationFieldKey: t.id,
        allowLoader: true,
        callback: () => {
          this.updateTailoredTopicsMap(t.id, this.tailoredTopicsList[t.id]);
          this.tailoredTopics[t.id].items = this.chunkArrayInGroups(Array.from(this.tailoredTopicsMap.get(t.id).values()), 3);
        }
      }
    ));
  }

  private refreshTopicLists(topic: any): void {
    this.updateForYouTopicsMap([topic]);
    this.forYouTopics.forEach(g => g.forEach(t => t = t.id === topic.id ? topic : t));

    Object.keys(this.tailoredTopics).forEach(k => {
      this.updateTailoredTopicsMap(k, [topic], true);
      this.tailoredTopics[k].items.forEach(g => g.forEach(t => t = t.id === topic.id ? topic : t));
    });
  }

  private updateForYouTopicsMap(topics: any): void {
    topics.forEach(t => Utils.assignToMap(this.forYouTopicsMap, t.id, t));
  }

  private updateTailoredTopicsMap(group: string, topics: any, skipInsert = false): void {
    let groupMap = this.tailoredTopicsMap.get(group);
    if (groupMap) {
      topics.forEach(t => Utils.assignToMap(groupMap, t.id, t, skipInsert));
      this.tailoredTopicsMap.set(group, groupMap);
    } else {
      this.tailoredTopicsMap.set(group, Utils.toMap<any, any>(topics, t => t.id,));
    }
  }

  private loadParentTopics(): void {
    this.isLoadingParentTopics = true;
    this._taxonomyService.getAll(
      undefined,
      undefined,
      true,
      false,
      TopicSorting.ForYou
    )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingParentTopics = false ))
      .subscribe(topics => {
        this.parentTopics = this.chunkArrayInGroups(topics, 3);
        this.loadTailoredTopics(topics);
      });
  }

  private loadForYouTopics(): void {
    this.forYouTopicsList = [];
    this.loadInfiniteData(
      this._taxonomyService,
      'getAllLastChildrenPaged',
      [ undefined, undefined, true, undefined, TopicSorting.ForYou, 0, NUMBER_OF_TOPICS_TO_LOAD ],
      'forYouTopicsList',
      {
        allowLoader: true,
        callback: () => {
          this.updateForYouTopicsMap(this.forYouTopicsList);
          this.forYouTopics = this.chunkArrayInGroups(Array.from(this.forYouTopicsMap.values()), 3);
        }
      }
    );
  }
}
