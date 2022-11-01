import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-all-topics',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.less']
})
export class AllComponent extends AppComponentBase implements OnInit {

  parentTopics: any = this.chunkArrayInGroups(Array(12).fill([]).map(() => this.generateRandomTopic()), 3);
  forYouTopics: any = this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomTopic()), 3);
  tailoredTopics: any = { 'Topic': this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomCoaching()), 3) };

  isLoadingParentTopics = false;
  isLoadingForYouTopics = false;
  isLoadingTailoredTopics = false
  isFollowingTopic = false;
  isRemovingTopic = false;

  get isLoading(): boolean { return this.isLoadingParentTopics || this.isLoadingForYouTopics || this.isLoadingTailoredTopics || this.isFollowingTopic; }

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
    this._taxonomyService.getAll(undefined, true, 'foryou')
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoadingParentTopics = false ))
        .subscribe(topics => {
          this.parentTopics = this.chunkArrayInGroups(topics, 3);
          this.getTailoredTopics(topics);
        });
  }

  private loadForYouTopics(): void {
    this.isLoadingForYouTopics = true;
    this._taxonomyService.getAllLastChildren()
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isLoadingForYouTopics = false ))
        .subscribe((topics) => {
          this.forYouTopics = this.chunkArrayInGroups(topics, 3)
        });
  }

  private getTailoredTopics(source: any, count?: number): void {
    this.isLoadingTailoredTopics = true;
    const topics = count ? _.take(source, count) : source;
    this.tailoredTopics = topics.reduce((topics, t) => ({...topics, [t.name] : this.chunkArrayInGroups(t.children, 3) }), {});
    this.isLoadingTailoredTopics = false;
  }

  handleTopicClick(topic: any): void {
    if (topic?.children?.length) this._router.navigate(['app', 'community', 'topics', 'view', topic.id]);
  }

  handleTopicFollowClick(topic: any): void {
      this.isFollowingTopic = true;

      const request = new CreateUserTopicDto();
      request.userId = this.appSession.userId;
      request.disciplineTaxonomyId = topic.id;
      request.type = UserTopicType.Following;

      this._userTopics.create(request)
          .pipe(takeUntil(this.destroyed$))
          .pipe(finalize(() => this.isFollowingTopic = false))
          .subscribe(_ => {
              this.notify.info(this.l('Community.Topics.Follow.Success', topic.name));
          });
  }

  handleTopicRemoveClick(topic: any): void {
    this.isRemovingTopic = true;

    const request = new CreateUserTopicDto();
    request.userId = this.appSession.userId;
    request.disciplineTaxonomyId = topic.id;
    request.type = UserTopicType.NotInterested;

    this._userTopics.create(request)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isRemovingTopic = false))
        .subscribe(_ => {
            this.notify.info(this.l('Community.Topics.NotInterested.Success', topic.name));
        });
  }
}
