import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, UserTopicDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import { SortOption } from '@shared/components/search/search.component';
import { TopicSorting } from '@shared/components/topic/topic.component';
import * as _ from 'lodash';

@Component({
    selector: 'app-topics-following',
    templateUrl: './topics-following.component.html',
    styleUrls: ['./topics-following.component.scss']
})
export class TopicsFollowingComponent extends AppComponentBase implements OnInit {

    userTopics: UserTopicDto[];
    displayedUserTopics: DisciplineTaxonomyDto[];

    searchFilter: string;

    isLoadingUserTopics = false;
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
        private _userTopics: UserTopicsServiceProxy,
    ) {
        super(injector);
    }

    get loading(): boolean { return this.isLoadingUserTopics || this.isUnfollowingTopic || this.isSearching; }

    ngOnInit(): void {
    }

    handleOnSearch(searchFilter: string): void {
        this.searchFilter = searchFilter;

        this.isLoadingUserTopics = true;
        this._userTopics.getAll(searchFilter, this.appSession.userId, UserTopicType.Following, this.sort.value)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingUserTopics = false))
            .subscribe(userTopics => {
                this.userTopics = userTopics;
                this.displayedUserTopics = _.clone(userTopics.map(t => t.disciplineTaxonomy));
            });
    }

    handleOnSort(sort: SortOption): void {
        this.sort = sort;
        this.handleOnSearch(this.searchFilter);
    }

    handleOnUnfollow(topic: DisciplineTaxonomyDto): void {
        this.isUnfollowingTopic = true;

        const userTopic = this.userTopics.find(u => topic.id === u.disciplineTaxonomyId);

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
