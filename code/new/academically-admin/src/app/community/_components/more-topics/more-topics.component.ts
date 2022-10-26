import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { CreateUserTopicDto, DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, GetDisciplineTaxonomyFollowerCountDto, UserTopicDto, UserTopicsServiceProxy } from '@shared/service-proxies/service-proxies';

import { finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-more-topics',
    templateUrl: './more-topics.component.html',
    styleUrls: ['./more-topics.component.scss']
})
export class MoreTopicsComponent extends AppComponentBase implements OnInit {

    topics: DisciplineTaxonomyDto[] = [];
    followers: GetDisciplineTaxonomyFollowerCountDto[] = [];
    followersMap: Map<string, number> = new Map();

    userTopics: UserTopicDto[];
    userTopicMap: Map<string, UserTopicDto> = new Map();

    searchFilter: string;

    isLoadingUserTopics = false;
    isFollowingTopic = false;
    isSearching = false;

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

    getFollowerCount(topicId: string): number {
        return this.followersMap.get(topicId) ?? 0;
    }

    handleOnSearch(searchFilter: string): void {
        this.searchFilter = searchFilter;

        this.isSearching = true;
        this._userTopics.getAll(this.appSession.userId)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isSearching = false))
            .pipe(switchMap((userTopics) => {
                this.userTopics = userTopics;
                this.userTopicMap = Utils.toMap(userTopics, u => u.disciplineTaxonomyId);
                return this._taxonomyService.search(searchFilter);
            }))
            .pipe(switchMap((topics) => {
                this.topics = topics.filter(t => !this.userTopicMap.has(t.id));
                return this._taxonomyService.getFollowerCount(topics.map(t => t.id));
            }))
            .subscribe(followers => {
                this.followersMap = Utils.toMap(followers, f => f.disciplineTaxonomyId, f => f.followerCount);
            });
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
