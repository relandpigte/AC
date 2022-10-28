import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, GetDisciplineTaxonomyFollowerCountDto, UserTopicDto, UserTopicsServiceProxy, UserTopicType } from '@shared/service-proxies/service-proxies';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import { SortOption } from '@shared/components/search/search.component';

@Component({
    selector: 'app-following-topics',
    templateUrl: './following-topics.component.html',
    styleUrls: ['./following-topics.component.scss']
})
export class FollowingTopicsComponent extends AppComponentBase implements OnInit {

    userTopics: UserTopicDto[];
    displayedUserTopics: any[];

    followers: GetDisciplineTaxonomyFollowerCountDto[] = [];
    followersMap: Map<string, number> = new Map();

    searchFilter: string;

    isLoadingUserTopics = false;
    isUnfollowingTopic = false;
    isSearching = false;

    sort: SortOption = { label: 'ForYou', value: 'foryou' };
    sortOptions = [
        { label: 'ForYou', value: 'foryou' },
        { label: 'Popular', value: 'popular' },
        { label: 'Recent', value: 'recent' }
    ];

    constructor(
        injector: Injector,
        private _userTopics: UserTopicsServiceProxy,
        private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    ) {
        super(injector);
    }

    get loading(): boolean { return this.isLoadingUserTopics || this.isUnfollowingTopic || this.isSearching; }

    ngOnInit(): void {
    }

    handleOnSearch(searchFilter: string): void {
        this.searchFilter = searchFilter;

        this.isLoadingUserTopics = true;
        this._userTopics.search(searchFilter, this.sort.value, UserTopicType.Following)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingUserTopics = false))
            .pipe(switchMap((userTopics) => {
                this.userTopics = userTopics;
                return this._taxonomyService.getFollowerCount(this.userTopics.map(t => t.disciplineTaxonomyId));
            }))
            .subscribe(followers => {
                this.followersMap = Utils.toMap(followers, f => f.disciplineTaxonomyId, f => f.followerCount);
                this.displayedUserTopics = _.clone(this.userTopics.map(t => ({ ...t.disciplineTaxonomy, followers: this.followersMap.get(t.disciplineTaxonomyId) ?? 0 }) ));
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
