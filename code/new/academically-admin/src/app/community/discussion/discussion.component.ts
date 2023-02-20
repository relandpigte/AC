import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, PostDto, PostsServiceProxy, PostType, UserDto } from '@shared/service-proxies/service-proxies';
import { PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices, AppStateType } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import * as _ from 'lodash';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { UpsertPostComponent } from '../../../shared/modals/upsert-post/upsert-post.component';

enum PostFiltering {
    All = 'Community.Posts.Filtering.All',
    Post = 'Community.Posts.Filtering.Post',
    Question = 'Community.Posts.Filtering.Question',
    Discussion = 'Community.Posts.Filtering.Discussion'
}

enum PostSorting {
    Latest = 'Community.Posts.Sorting.Latest',
    Replied = 'Community.Posts.Sorting.Replied',
    Reacted = 'Community.Posts.Sorting.Reacted'
}

enum SubscribeType {
    subscribe = 'Subscribe',
    unsubscribe = 'Unsubscribe'
}

@Component({
    selector: 'app-discussion',
    templateUrl: './discussion.component.html',
    styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent extends AppComponentBase implements OnInit, OnDestroy {

    appStateConfig: AppStateConfig = { post: { load: true, update: true } };
    appStateServices: AppStateServices = { post: { type: PostsStateService, args: [this._postsService] } };
    postStateService: PostsStateService;

    private discussion: PostDto;
    children: PostDto[] = [];

    creator: UserDto;
    discussionTopics: DisciplineTaxonomyDto[];
    participants: UserDto[] = [];
    subscriberIds: number[] = [];
    relatedDiscussions: PostDto[] = [];

    isLoadingPost = false;
    isLoadingChildren = false;
    isLoadingParticipants = false;
    isLoadingSubscriberIds = false;
    isLoadingRelatedDiscussions = false;
    isUpdatingSubscribers = false;

    postFilteringEnum = PostFiltering;
    postSortingEnum = PostSorting;
    subscribeType = SubscribeType;

    selectedFiltering: PostFiltering = PostFiltering.All;
    selectedSorting: PostSorting = PostSorting.Latest;

    id: string;

    constructor(
        injector: Injector,
        private _location: Location,
        private _route: ActivatedRoute,
        private _router: Router,
        private _cdr: ChangeDetectorRef,
        private _modalService: BsModalService,
        private _postsService: PostsServiceProxy
    ) {
        super(injector);
        this._route.paramMap.subscribe(async paramMap => {
            if (paramMap.has('id')) {
                this.id = paramMap.get('id');
            }
        });
    }


    get isLoading(): boolean {
        return this.isLoadingPost || this.isLoadingChildren || this.isLoadingParticipants || this.isLoadingSubscriberIds ||
            this.isLoadingRelatedDiscussions || this.isUpdatingSubscribers;
    }
    get isOwner(): boolean { return this.appSession.userId === this.discussion?.creatorUserId; }
    get isSubscribedToNotifications(): boolean { return this.subscriberIds.includes(this.appSession.userId); }
    get discussionTitle(): string { return this.discussion?.title; }
    get discussionDescription(): string { return this.discussion?.content; }
    get postTypeFilter(): PostType {
        switch(this.selectedFiltering) {
          case PostFiltering.All:
            return undefined;
          case PostFiltering.Post:
            return PostType.QuickPost;
          case PostFiltering.Question:
            return PostType.Question;
          case PostFiltering.Discussion:
            return PostType.Discussion;
        }
    }
    get participantsCount(): number { return this.participants?.length ?? 0 + 1; }
    get postsCount(): number { return this.children?.length ?? 0; }

    async ngOnInit() {
        this.isLoadingPost = true;

        try {
            await this.initDiscussion();
            await this.initPostsAppStates();
            this.loadOtherInfo();
        } catch(err) {
            console.error(err);
        }

        this.isLoadingPost = false;
        this._cdr.detectChanges();
    }

    ngOnDestroy() {
        this.pubSubService.stop();
    }

    private async initDiscussion() {
        this.discussion = await this._postsService.get(this.id).toPromise();
    }

    private async initPostsAppStates() {
        await this.pubSubService.start(this, this.appStateConfig, this.appStateServices, [undefined, this.discussion.id]);
        this.postStateService = this.pubSubService.getStateService<PostsStateService>(AppStateType.Post);

        this.postStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingChildren = loading);

        this.postStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (this.postTypeFilter !== undefined && event.data.type !== this.postTypeFilter) return;
            switch(event.type) {
            case StateUpdateType.Add:
                this.children = [event.data].concat(this.children);
                break;
            case StateUpdateType.Update:
                this.children = this.children.map(p => p.id === event.data.id ? event.data : p);
                break;
            case StateUpdateType.Delete:
                this.children = this.children.filter(p => p.id != event.data.id);
                break;
            }
            this._cdr.detectChanges();
        });
        this.children = this.postStateService.getAllPosts();
    }

    private async loadOtherInfo() {
        this.getParticipants();
        this.getSubscriberIds();
        this.getRelatedDiscussions();
    }

    async getParticipants() {
        this.isLoadingParticipants = true;
        if (this.discussion) {
            this.creator = this.discussion.creatorUser;
            this.participants = [
                this.creator,
                ...this.discussion.participants.filter(p => p.id !== this.creator.id)
            ];
        }
        this.isLoadingParticipants = false;
    }

    async getSubscriberIds() {
        this.isLoadingSubscriberIds = true;
        if (this.discussion) this.subscriberIds = this.discussion.postNotification?.map(n => n.creatorUserId);
        this.isLoadingSubscriberIds = false;
    }

    async getRelatedDiscussions() {
        this.isLoadingRelatedDiscussions = true;
        const discussions = await this._postsService.getAllPosts(PostType.Discussion, undefined).toPromise();
        this.relatedDiscussions = _.take(discussions.filter(d => d.id !== this.discussion?.id), 4);
        this.isLoadingRelatedDiscussions = false;
    }

    handleAddPost(): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
            parentPostId: this.discussion.id,
            allowTabs: false,
            title: 'Community.QuickPost',
            activeTab: 'quick-post'
        };
        const modal = this._modalService.show(UpsertPostComponent, modalSettings).content;
        modal.onPostCreated
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {});
    }

    navigateBack(): void {
        this._location.back();
    }

    handleItemClick(type: string, item: any): void {
        switch(type) {
            case 'participants':
                break;
            case 'discussions':
                break;
            default:
        }
    }

    handleViewAllClick(type: string): void {
        switch(type) {
            case 'participants':
                break;
            case 'discussions':
                break;
            default:
                this._router.navigate(['app', 'community', 'following']);
        }
    }

    isSelectedFiltering(filter: PostFiltering): boolean {
        return this.selectedFiltering === filter;
    }

    isSelectedSorting(sort: PostSorting): boolean {
        return this.selectedSorting === sort;
    }

    isParticipantOwner(item: UserDto): boolean {
        return this.creator?.id === item?.id;
    }

    handleSortingChange(sort: PostSorting): void {
        this.selectedSorting = sort;
    }

    handleSubscribeClick(type: SubscribeType): void {
        this.isUpdatingSubscribers = true;
        const postId = this.discussion.id;
        const userId = this.appSession.userId;

        const service = type === SubscribeType.subscribe ? this._postsService.createPostNotification(postId, userId)
            : this._postsService.deletePostNotification(postId, userId);

        service.pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isUpdatingSubscribers = false))
            .subscribe(() => {
                if (type === SubscribeType.subscribe) this.subscriberIds.push(userId);
                else this.subscriberIds = this.subscriberIds.filter(s => s !== userId);
            });
    }
}
