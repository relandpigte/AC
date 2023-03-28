import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, UserTopicDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import { SortOption } from '@shared/components/search/search.component';
import { TopicSorting } from '@shared/components/topic/topic.component';
import * as _ from 'lodash';
import { Utils } from '@shared/helpers/utils';

@Component({
    selector: 'app-topics-following',
    templateUrl: './topics-following.component.html',
    styleUrls: ['./topics-following.component.scss']
})
export class TopicsFollowingComponent extends AppComponentBase implements OnInit {

    userTopics: Map<string, UserTopicDto> = new Map();
    topicLoaders: Map<string, { isUnfollowingTopic?: boolean }> = new Map();

    searchFilter: string;

    isAllowLoading = true;
    isLoadingUserTopics = false;
    isSearching = false;

    sort: SortOption = { label: 'ForYou', value: TopicSorting.ForYou };
    sortOptions = [
        { label: 'ForYou', value: TopicSorting.ForYou },
        { label: 'Popular', value: TopicSorting.Popular },
        { label: 'Recent', value: TopicSorting.Recent }
    ];

    searchProcess$ = (searchFilter: string) => {
        this.searchFilter = searchFilter;

        return this._userTopicsService.getAll(searchFilter, this.appSession.userId, UserTopicType.Following, this.sort.value)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => {
                this.isSearching = false;
            }));
    };

    constructor(
        injector: Injector,
        private _userTopicsService: UserTopicsServiceProxy,
    ) {
        super(injector);
    }

    get isLoading(): boolean { return this.isLoadingUserTopics || this.isSearching || this.isSomeTopicsLoading; }
    get isSomeTopicsLoading(): boolean { return Array.from(this.topicLoaders.keys()).some(k => this.isTopicLoading(k)); }

    get displayedUserTopics(): any { return Array.from(this.userTopics.values()).map(t => t.disciplineTaxonomy); }

    ngOnInit(): void {
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

    handleOnSearch(searchFilter: string, ): void {
        this.isSearching = true;
        this.searchProcess$(searchFilter)
            .subscribe(topics => {
                this.updateSearchResults(topics);
            });
    }

    private updateSearchResults(userTopics: UserTopicDto[]): void {
        if (this.isAllowLoading) this.userTopics = Utils.toMap(userTopics, t => t.id);
        else userTopics.forEach(t => Utils.assignToMap(this.userTopics, t.id, t, true));
    }

    handleOnSort(sort: SortOption): void {
        this.sort = sort;
        this.handleOnSearch(this.searchFilter);
    }

    handleOnUnfollow(topic: DisciplineTaxonomyDto): void {
        this.isAllowLoading = false;
        this.setTopicLoading(topic.id, 'isUnfollowingTopic', true);

        const userTopic = Array.from(this.userTopics.values()).find(t => t.disciplineTaxonomyId === topic.id);

        if (userTopic) {
            this._userTopicsService.delete(userTopic.id)
            .pipe(switchMap(() => this.searchProcess$(this.searchFilter)))
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.setTopicLoading(topic.id, 'isUnfollowingTopic', false)))
            .subscribe(_ => {
                this.userTopics.delete(userTopic.id);
                this.notify.info(this.l('Community.Topics.Unfollow.Success', topic.name));
            });
        }
    }
}
