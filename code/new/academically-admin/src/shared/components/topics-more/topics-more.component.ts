import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SortOption } from '@shared/components/search/search.component';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { Utils } from '@shared/helpers/utils';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, SearchDisciplineTaxonomyRequestDto, UserTopicDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';

import * as _ from 'lodash';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-topics-more',
    templateUrl: './topics-more.component.html',
    styleUrls: ['./topics-more.component.scss']
})
export class TopicsMoreComponent extends AppComponentBase implements OnInit {

    topics: Map<string, DisciplineTaxonomyDto> = new Map();
    topicLoaders: Map<string, { isFollowingTopic?: boolean, isUnfollowingTopic?: boolean, isRemovingTopic?: boolean }> = new Map();

    searchFilter: string;

    isAllowLoading = true;
    isSearching = false;

    sort: SortOption = { label: 'ForYou', value: TopicSorting.ForYou };
    sortOptions = [
        { label: 'ForYou', value: TopicSorting.ForYou },
        { label: 'Popular', value: TopicSorting.Popular },
        { label: 'Recent', value: TopicSorting.Recent }
    ];

    searchProcess$ = (searchFilter: string, excludeFollowing = true) => {
        this.searchFilter = searchFilter;

        const request = new SearchDisciplineTaxonomyRequestDto();
        request.keyword = searchFilter;
        request.excludeFollowing = excludeFollowing;
        request.sorting = this.sort.value;
        request.take = 10;

        return this._taxonomyService.search(request)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => {
            this.isSearching = false;
        }));
    };

    constructor(
        injector: Injector,
        private _taxonomyService: DisciplineTaxonomiesServiceProxy,
        private _userTopics: UserTopicsServiceProxy
    ) {
        super(injector);
    }

    get isLoading(): boolean { return this.isSearching || this.isSomeTopicsLoading; }
    get isSomeTopicsLoading(): boolean { return Array.from(this.topicLoaders.keys()).some(k => this.isTopicLoading(k)); }
    get topicValues(): any { return Array.from(this.topics.values()) }

    ngOnInit(): void {
    }

    private updateSearchResults(topics: DisciplineTaxonomyDto[]): void {
        if (this.isAllowLoading) this.topics = Utils.toMap(topics, t => t.id);
        else topics.forEach(t => Utils.assignToMap(this.topics, t.id, t, true));
    }

    private updateTopicFromData(topic: DisciplineTaxonomyDto, type: UserTopicType): void {
        let existing = this.topics.get(topic.id);
        if (_.isNil(type)) {
            existing.userTopics = existing.userTopics.filter(u => !(u.userId === this.appSession.userId && u.type === UserTopicType.Following));
        } else {
            existing.userTopics.push({ userId: this.appSession.userId, type } as UserTopicDto);
        }
        this.topics.set(topic.id, existing);
    }

    isFollowed(topic: DisciplineTaxonomyDto): boolean {
        return topic.userTopics.some(u => u.userId === this.appSession.userId && u.type === UserTopicType.Following);
    }

    isTopicLoading(id: string, property?: string): boolean {
        const topicLoaders = this.topicLoaders.get(id);
        if (!topicLoaders) return false;
        if (property) return topicLoaders[property];
        else return Object.keys(topicLoaders).some(p => topicLoaders[p]);
    }

    setTopicLoading(id: string, property: string, value: boolean): void {
        if (!this.topicLoaders.has(id)) this.topicLoaders.set(id, {});
        const topicLoaders = this.topicLoaders.get(id);
        topicLoaders[property] = value;
        if (Object.keys(topicLoaders).every(p => !topicLoaders[p])) this.topicLoaders.delete(id);
        this.resetIsAllowLoading();
    }

    resetIsAllowLoading(): void {
        if (!this.isAllowLoading && !this.isSomeTopicsLoading) this.isAllowLoading = true;
    }

    isShowFollowButtons(topic: DisciplineTaxonomyDto): boolean {
        const isCurrentlyFollowing = this.isTopicLoading(topic.id, 'isFollowingTopic');
        const isCurrentlyUnfollowing = this.isTopicLoading(topic.id, 'isUnfollowingTopic');
        const isCurrentlyUnfollowed = !this.isFollowed(topic);

        return !isCurrentlyFollowing && (isCurrentlyUnfollowed || isCurrentlyUnfollowing);
    }

    isShowFollowingButtons(topic: DisciplineTaxonomyDto): boolean {
        const isCurrentlyUnfollowing = this.isTopicLoading(topic.id, 'isUnfollowingTopic');
        const isCurrentlyFollowing = this.isTopicLoading(topic.id, 'isFollowingTopic');
        const isCurrentlyFollowed = this.isFollowed(topic);

        return !isCurrentlyUnfollowing && (isCurrentlyFollowed || isCurrentlyFollowing);
    }

    handleOnSearch(searchFilter: string): void {
        this.isSearching = true;
        this.searchProcess$(searchFilter)
            .subscribe(topics => {
                this.updateSearchResults(topics);
            });
    }

    handleOnSort(sort: SortOption): void {
        this.sort = sort;
        this.handleOnSearch(this.searchFilter);
    }

    handleOnFollow(topic: DisciplineTaxonomyDto): void {
        this.isAllowLoading = false;
        this.setTopicLoading(topic.id, 'isFollowingTopic', true);

        const request = new CreateUserTopicDto();
        request.userId = this.appSession.userId;
        request.disciplineTaxonomyId = topic.id;
        request.type = UserTopicType.Following;

        this._userTopics.create(request)
            .pipe(switchMap(() => this.searchProcess$(this.searchFilter, false)))
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => {
                this.setTopicLoading(topic.id, 'isFollowingTopic', false);
                this.updateTopicFromData(topic, UserTopicType.Following);
            }))
            .subscribe((topics) => {
                this.notify.info(this.l('Community.Topics.Follow.Success', topic.name));
            });
    }

    handleOnUnfollow(topic: DisciplineTaxonomyDto): void {
        this.isAllowLoading = false;
        this.setTopicLoading(topic.id, 'isUnfollowingTopic', true);

        this._userTopics.deleteByTopicId(topic.id)
            .pipe(switchMap(() => this.searchProcess$(this.searchFilter, false)))
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => {
                this.setTopicLoading(topic.id, 'isUnfollowingTopic', false);
                this.updateTopicFromData(topic, null);
            }))
            .subscribe((topics) => {
                this.notify.info(this.l('Community.Topics.Unfollow.Success', topic.name));
            });
    }

    handleOnRemove(topic: DisciplineTaxonomyDto): void {
        this.isAllowLoading = false;
        this.setTopicLoading(topic.id, 'isRemovingTopic', true);

        const request = new CreateUserTopicDto();
        request.userId = this.appSession.userId;
        request.disciplineTaxonomyId = topic.id;
        request.type = UserTopicType.NotInterested;

        this._userTopics.create(request)
            .pipe(switchMap(() => this.searchProcess$(this.searchFilter, false)))
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.setTopicLoading(topic.id, 'isRemovingTopic', false)))
            .subscribe((topics) => {
                this.updateSearchResults(topics);
                this.topics.delete(topic.id);
                this.notify.info(this.l('Community.Topics.NotInterested.Success', topic.name));
            });
    }
}
