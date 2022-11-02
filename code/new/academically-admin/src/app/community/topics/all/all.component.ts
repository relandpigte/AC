import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import * as _ from 'lodash';
import { TopicSorting } from '@shared/components/topic/topic.component';

@Component({
  selector: 'app-all-topics',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.less']
})
export class AllComponent extends AppComponentBase implements OnInit {

  parentTopics: any = this.chunkArrayInGroups(Array(12).fill([]).map(() => this.generateRandomTopic()), 3);
  forYouTopics: any = this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomTopic()), 3);
  tailoredTopics: any;

  isLoadingParentTopics = false;
  isLoadingForYouTopics = false;
  isLoadingTailoredTopics: { key: string, value: boolean };
  isFollowingTopic = false;
  isRemovingTopic = false;

  get isLoading(): boolean { return this.isLoadingParentTopics || this.isLoadingForYouTopics || Object.values(this.isLoadingTailoredTopics).some(t => t) || this.isFollowingTopic; }

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
      true,
      TopicSorting.ForYou
    )
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoadingParentTopics = false ))
    .subscribe(topics => {
      this.parentTopics = this.chunkArrayInGroups(topics, 3);
      this.getTailoredTopics(topics);
    });
  }

  private loadForYouTopics(): void {
    this.isLoadingForYouTopics = true;
    this._taxonomyService.getAllLastChildren(
      undefined,
      true,
      TopicSorting.ForYou
    )
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoadingForYouTopics = false ))
    .subscribe((topics) => {
      this.forYouTopics = this.chunkArrayInGroups(topics, 3)
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
        TopicSorting.Popular
      )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingTailoredTopics[t.id] = false ))
      .subscribe((topics) => this.tailoredTopics[t.id].items = this.chunkArrayInGroups(topics, 3));
    });
  }

  private refreshTailoredTopics(groupId: string): void {
    this.isLoadingTailoredTopics[groupId] = true;

    this._taxonomyService.getAll(
      groupId,
      undefined,
      true,
      true,
      TopicSorting.Popular
    )
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoadingTailoredTopics[groupId] = false ))
    .subscribe((topics) => this.tailoredTopics[groupId].items = this.chunkArrayInGroups(topics, 3));
  }

  handleTopicClick(topic: any): void {
    if (topic?.children?.length) this._router.navigate(['app', 'community', 'topics', 'view', topic.id]);
  }

  handleViewAllTopicsClick(topicId: string): void {
    this._router.navigate(['app', 'community', 'topics', 'view', topicId]);
  }

  handleTopicFollowClick(key: string, topic: any): void {
      this.isFollowingTopic = true;

      const request = new CreateUserTopicDto();
      request.userId = this.appSession.userId;
      request.disciplineTaxonomyId = topic.id;
      request.type = UserTopicType.Following;

      this._userTopics.create(request)
          .pipe(takeUntil(this.destroyed$))
          .pipe(finalize(() => this.isFollowingTopic = false))
          .subscribe(_ => {
            key ? this.refreshTailoredTopics(key) : this.loadForYouTopics();
            this.notify.info(this.l('Community.Topics.Follow.Success', topic.name));
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
          key ? this.refreshTailoredTopics(key) : this.loadForYouTopics();
          this.notify.info(this.l('Community.Topics.NotInterested.Success', topic.name));
        });
  }
}
