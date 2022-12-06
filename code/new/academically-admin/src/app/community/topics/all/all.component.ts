import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { TopicSorting } from '@shared/components/topic/topic.component';
import * as _ from 'lodash';

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

  isAllowLoading = true;
  isLoadingParentTopics = false;
  isLoadingForYouTopics = false;
  isLoadingTailoredTopics: { key: string, value: boolean };
  isFollowingTopic = false;
  isUnfollowingTopic = false;
  isRemovingTopic = false;

  get isLoading(): boolean { return this.isLoadingParentTopics || this.isLoadingForYouTopics || Object.values(this.isLoadingTailoredTopics).some(t => t) || this.isFollowingTopic || this.isUnfollowingTopic; }

  constructor(
    injector: Injector,
    private _router: Router,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    private _userTopics: UserTopicsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadParentTopics();
    this.loadForYouTopics();
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
      this.getTailoredTopics(topics);
    });
  }

  private loadForYouTopics(excludeFollowing = true): void {
    this.isLoadingForYouTopics = true;
    this._taxonomyService.getAllLastChildren(
      undefined,
      undefined,
      excludeFollowing,
      TopicSorting.ForYou,
      50
    )
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoadingForYouTopics = false ))
    .subscribe((topics) => {
      this.updateForYouTopicsMap(topics);
      this.forYouTopics = this.chunkArrayInGroups(Array.from(this.forYouTopicsMap.values()), 3);
    });
  }

  private getTailoredTopics(source: any, count?: number): void {
    const topics = count ? _.take(source, count) : source;

    this.tailoredTopics = topics.reduce((topics, t) => ({ ...topics, [t.id]: { name: t.name, items: this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomCoaching()), 3) } }), {});
    this.isLoadingTailoredTopics = topics.reduce((topics, t) => ({ ...topics, [t.id]: true }), {});

    topics.forEach(t => {
      this._taxonomyService.getAll(
        t.id,
        undefined,
        true,
        true,
        TopicSorting.ForYou
      )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingTailoredTopics[t.id] = false ))
      .subscribe((topics) => {
        this.updateTailoredTopicsMap(t.id, topics);
        this.tailoredTopics[t.id].items = this.chunkArrayInGroups(Array.from(this.tailoredTopicsMap.get(t.id).values()), 3);
      });
    });
  }

  private refreshTailoredTopics(groupId: string): void {
    this.isLoadingTailoredTopics[groupId] = true;

    this._taxonomyService.getAll(
      groupId,
      undefined,
      true,
      false,
      TopicSorting.ForYou
    )
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => {
      this.isLoadingTailoredTopics[groupId] = false;
      this.isAllowLoading = true;
    }))
    .subscribe((topics) => {
      this.updateTailoredTopicsMap(groupId, topics);
      this.tailoredTopics[groupId].items = this.chunkArrayInGroups(Array.from(this.tailoredTopicsMap.get(groupId).values()), 3);
    });
  }

  handleTopicClick(topic: any): void {
    if (topic?.children?.length) this._router.navigate(['app', 'community', 'topics', 'view', topic.id]);
  }

  handleViewAllTopicsClick(topicId: string): void {
    this._router.navigate(['app', 'community', 'topics', 'view', topicId]);
  }

  handleTopicFollowClick(key: string, topic: any): void {
      this.isAllowLoading = false;
      this.isFollowingTopic = true;

      const request = new CreateUserTopicDto();
      request.userId = this.appSession.userId;
      request.disciplineTaxonomyId = topic.id;
      request.type = UserTopicType.Following;

      this._userTopics.create(request)
          .pipe(takeUntil(this.destroyed$))
          .pipe(finalize(() => this.isFollowingTopic = false))
          .subscribe(_ => {
            key ? this.refreshTailoredTopics(key) : this.loadForYouTopics(false);
            this.notify.info(this.l('Community.Topics.Follow.Success', topic.name));
          });
  }

  handleTopicUnfollowClick(key: string, topic: any): void {
    this.isAllowLoading = false;
    this.isUnfollowingTopic = true;

    this._userTopics.deleteByTopicId(topic.id)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isUnfollowingTopic = false))
        .subscribe(_ => {
          key ? this.refreshTailoredTopics(key) : this.loadForYouTopics(false);
          this.notify.info(this.l('Community.Topics.Unfollow.Success', topic.name));
        });
  }

  handleTopicRemoveClick(key: string, topic: any): void {
    this.isAllowLoading = false;
    this.isRemovingTopic = true;

    const request = new CreateUserTopicDto();
    request.userId = this.appSession.userId;
    request.disciplineTaxonomyId = topic.id;
    request.type = UserTopicType.NotInterested;

    this._userTopics.create(request)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isRemovingTopic = false))
        .subscribe(_ => {
          key ? this.refreshTailoredTopics(key) : this.loadForYouTopics(false);
          this.notify.info(this.l('Community.Topics.NotInterested.Success', topic.name));
        });
  }

  private updateForYouTopicsMap(topics: any): void {
    if (this.isAllowLoading) this.forYouTopicsMap = Utils.toMap<any, any>(topics, t => t.id);
    else topics.forEach(t => Utils.assignToMap(this.forYouTopicsMap, t.id, t, true));
  }

  private updateTailoredTopicsMap(group: string, topics: any): void {
    if (this.isAllowLoading) this.tailoredTopicsMap.set(group, Utils.toMap<any, any>(topics, t => t.id));
    else {
      let groupMap = this.tailoredTopicsMap.get(group);
      if (groupMap) {
        topics.forEach(t => Utils.assignToMap(groupMap, t.id, t, true));
        this.tailoredTopicsMap.set(group, groupMap);
      }
    }
  }
}
