import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, GetDisciplineTaxonomyFollowerCountDto, UserTopicDto, UserTopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

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

    constructor(
        injector: Injector,
        private _userTopics: UserTopicsServiceProxy,
        private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    ) {
        super(injector);
    }

    get loading(): boolean { return this.isLoadingUserTopics || this.isUnfollowingTopic || this.isSearching; }

    ngOnInit(): void {
        this.loadUserTopics();
    }

    private loadUserTopics(): void {
        this.isLoadingUserTopics = true;
        this._userTopics.getAll(this.appSession.userId)
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

    handleOnSearch(searchFilter: string): void {
        this.searchFilter = searchFilter;
        this.isSearching = true;
        this.displayedUserTopics = _.clone(
            this.userTopics?.filter(t => t.disciplineTaxonomy.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
                .map(t => ({ ...t.disciplineTaxonomy, followers: this.followersMap.get(t.disciplineTaxonomyId) ?? 0 }))
        );
        this.isSearching = false;
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
                this.loadUserTopics();
            });
        }

    }
}
