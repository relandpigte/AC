import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SortOption } from '@shared/components/search/search.component';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, SearchDisciplineTaxonomyRequestDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';

import { finalize, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-more-topics',
    templateUrl: './more-topics.component.html',
    styleUrls: ['./more-topics.component.scss']
})
export class MoreTopicsComponent extends AppComponentBase implements OnInit {

    topics: any[] = [];

    searchFilter: string;

    isFollowingTopic = false;
    isUnfollowingTopic = false;
    isSearching = false;

    sort: SortOption = { label: 'ForYou', value: TopicSorting.ForYou };
    sortOptions = [
        { label: 'ForYou', value: TopicSorting.ForYou },
        { label: 'Popular', value: TopicSorting.Popular },
        { label: 'Recent', value: TopicSorting.Recent }
    ];

    constructor(
        injector: Injector,
        private _taxonomyService: DisciplineTaxonomiesServiceProxy,
        private _userTopics: UserTopicsServiceProxy
    ) {
        super(injector);
    }

    get loading(): boolean { return this.isFollowingTopic || this.isUnfollowingTopic || this.isSearching; }

    ngOnInit(): void {
    }

    handleOnSearch(searchFilter: string): void {
        this.searchFilter = searchFilter;

        this.isSearching = true;

        const request = new SearchDisciplineTaxonomyRequestDto();
        request.keyword = searchFilter;
        request.excludeFollowing = true;
        request.sorting = this.sort.value;

        this._taxonomyService.search(request)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isSearching = false))
            .subscribe(topics => this.topics = topics);
    }

    handleOnSort(sort: SortOption): void {
        this.sort = sort;
        this.handleOnSearch(this.searchFilter);
    }

    handleOnFollow(topic: DisciplineTaxonomyDto): void {
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
                this.handleOnSearch(this.searchFilter);
            });
    }

    handleOnRemove(topic: DisciplineTaxonomyDto): void {
        this.isUnfollowingTopic = true;

        const request = new CreateUserTopicDto();
        request.userId = this.appSession.userId;
        request.disciplineTaxonomyId = topic.id;
        request.type = UserTopicType.NotInterested;

        this._userTopics.create(request)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isUnfollowingTopic = false))
            .subscribe(_ => {
                this.notify.info(this.l('Community.Topics.NotInterested.Success', topic.name));
                this.handleOnSearch(this.searchFilter);
            });
    }
}
