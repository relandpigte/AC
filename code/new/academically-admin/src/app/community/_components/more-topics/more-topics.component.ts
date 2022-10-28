import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SortOption } from '@shared/components/search/search.component';
import { Utils } from '@shared/helpers/utils';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, GetDisciplineTaxonomyFollowerCountDto, UserTopicDto, UserTopicsServiceProxy } from '@shared/service-proxies/service-proxies';

import { finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-more-topics',
    templateUrl: './more-topics.component.html',
    styleUrls: ['./more-topics.component.scss']
})
export class MoreTopicsComponent extends AppComponentBase implements OnInit {

    topics: any[] = [];
    followers: GetDisciplineTaxonomyFollowerCountDto[] = [];
    followersMap: Map<string, number> = new Map();

    userTopics: UserTopicDto[];
    userTopicMap: Map<string, UserTopicDto> = new Map();

    searchFilter: string;

    isLoadingUserTopics = false;
    isFollowingTopic = false;
    isSearching = false;

    sort: SortOption = { label: 'ForYou', value: 'foryou' };
    sortOptions = [
        { label: 'ForYou', value: 'foryou' },
        { label: 'Popular', value: 'popular' },
        { label: 'Recent', value: 'recent' }
    ];

    constructor(
        injector: Injector,
        private _taxonomyService: DisciplineTaxonomiesServiceProxy,
        private _userTopics: UserTopicsServiceProxy
    ) {
        super(injector);
    }

    get loading(): boolean { return this.isLoadingUserTopics || this.isFollowingTopic || this.isSearching; }

    ngOnInit(): void {
    }

    handleOnSearch(searchFilter: string): void {
        this.searchFilter = searchFilter;

        this.isSearching = true;
        this._taxonomyService.search(searchFilter, true, this.sort.value)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isSearching = false))
            .pipe(switchMap((topics) => {
                this.topics = topics.filter(t => !this.userTopicMap.has(t.id));
                return this._taxonomyService.getFollowerCount(topics.map(t => t.id));
            }))
            .subscribe(followers => {
                this.followersMap = Utils.toMap(followers, f => f.disciplineTaxonomyId, f => f.followerCount);
                this.topics = this.topics.map(t => ({ ...t, followers: this.followersMap.get(t.id) ?? 0 }) )
            });
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

        this._userTopics.create(request)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isFollowingTopic = false))
            .subscribe(_ => {
                this.notify.info(this.l('Community.Topics.Follow.Success', topic.name));
                this.handleOnSearch(this.searchFilter);
            });
    }
}
