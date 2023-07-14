import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, PostDto, PostsServiceProxy, PostType, SharedType, UserDto } from '@shared/service-proxies/service-proxies';
import { MAX_POSTS_TO_LOAD, PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { UserFollowingService } from '@shared/services/user-following.service';
import { AppConsts } from '@shared/AppConsts';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

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
    postsStateService: PostsStateService;

    discussion: PostDto;
    children: PostDto[] = Array(3).fill([]).map(() => this.generateRandomPost()) as PostDto[];
    totalChildrenCount: number;

    creator: UserDto;
    discussionTopics: DisciplineTaxonomyDto[];
    participants: UserDto[] = Array(3).fill([]).map(() => this.generateRandomUser()) as UserDto[];
    subscriberIds: number[] = [];
    relatedDiscussions: PostDto[] = Array(3).fill([]).map(() => this.generateRandomPost()) as PostDto[];

    isLoadingPost = true;
    isLoadingChildren = true;
    isLoadingParticipants = true;
    isLoadingSubscriberIds = true;
    isLoadingRelatedDiscussions = true;
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
        private _modalDialogService: ModalDialogService,
        private _hubService: HubService,
        private _postsService: PostsServiceProxy,
        private _userFollowingService: UserFollowingService
    ) {
        super(injector);
        this._route.paramMap.subscribe(async paramMap => {
            if (paramMap.has('id')) {
                this.id = paramMap.get('id');
            }
        });
    }

    get postsStateId(): string { return `posts-${this.discussionId}`; }
    get discussionId(): string { return this.discussion?.id; }
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
    get isEdited(): boolean { return this.discussion?.lastModificationTime != null; }
    get participantsCount(): number { return this.participants?.length ?? 0 + 1; }
    get postsCount(): number { return this.children?.length ?? 0; }
    get hiddenChildrenCount(): number { return this.totalChildrenCount - this.children.length; }
    get shimmerType() { return ShimmerType; }
    get postDate(): string {
        const time = moment(this.discussion.creationTime);
        return this.convertMomentToPostDateAgo(time);
    }

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

    handleDeleteDiscussion(): void {
        const options: ModalDialogOptions = {
            title: this.l('AreYouSure'),
            text: this.l('DeleteDiscussionConfirmationMessage'),
            confirmCb: (): void => {
                this._postsService.delete(this.discussion.id)
                  .pipe(takeUntil(this.destroyed$))
                  .subscribe(() => {
                      this.notify.success(this.l('SuccessfullyDeleted'));
                      setTimeout(() => this._router.navigate(['app', 'community', 'following']), 1000);
                  });
            }
        };
        this._modalDialogService.showConfirmDialog(options);
    }

    handleEditDiscussion(data: PostDto): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';

        modalSettings.initialState = {
            activeTab: 'add-discussion',
            updateOnly: true,
            model: data,
            canRemoveAttachment: false
        };

        const modal = this._modalService.show(UpsertPostComponent, modalSettings).content;
        modal.onPostCreated.subscribe(async () => {
            this.notify.success(this.l('SavedSuccessfully'));
            await this.initDiscussion();
        });
    }

    handleShareDiscussion(): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
            allowTabs: false,
            canRemoveAttachment: true,
            title: 'Community.SharePost',
            activeTab: 'quick-post',
            model: {
                sharedPost: this.discussion,
                sharedId: this.discussionId,
                sharedType: SharedType.Post
            }
        };
        this._modalService.show(UpsertPostComponent, modalSettings).content;
    }

    goToHistory(): void {
        const url = `${AppConsts.appBaseUrl}/app/community/edit-history/${this.discussion.id}`;
        window.open(url, '_blank');
    }

    private async initDiscussion() {
        this.discussion = await this._postsService.get(this.id, false, false).toPromise();
    }

    private async initPostsAppStates() {
        const appStateConfig: AppStateConfig = {
            [this.postsStateId]: {
                load: [undefined, this.discussionId, undefined, 0, MAX_POSTS_TO_LOAD],
                update: { postId: this.discussionId }
            }
        };
        const appStateServices: AppStateServices = {
            [this.postsStateId]: {
                type: PostsStateService,
                args: [this._hubService, this._postsService]
            }
        };
        await this.pubSubService.start(this, appStateConfig, appStateServices);
        this.postsStateService = this.pubSubService.getStateService<PostsStateService>(this.postsStateId);

        this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingChildren = loading);

        this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (this.postTypeFilter !== undefined && event.data.type !== this.postTypeFilter) return;
            switch(event.type) {
            case StateUpdateType.Add:
                this.children = [event.data].concat(this.children);
                this.totalChildrenCount++;
                break;
            case StateUpdateType.Update:
                this.children = this.children.map(p => p.id === event.data.id ? event.data : p);
                break;
            case StateUpdateType.Delete:
                this.children = this.children.filter(p => p.id != event.data.id);
                this.totalChildrenCount--;
                break;
            }
            this._cdr.detectChanges();
        });
        this.children = this.postsStateService.getAllPosts();
        this.totalChildrenCount = this.postsStateService.totalPostsCount;
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

    isParticipantSelf(item: UserDto): boolean {
        return this.appSession.userId === item?.id;
    }

    isParticipantOwner(item: UserDto): boolean {
        return this.creator?.id === item?.id;
    }

    handleSortingChange(sort: PostSorting): void {
        this.selectedSorting = sort;
    }

    handleSubscribeClick(type: SubscribeType): void {
        // This allows the shimmers to load the reason why the page flashes when button is clicked.
        // this.isUpdatingSubscribers = true;
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

    handleChildrenUpdate(post: PostDto) {
        this.postsStateService.updateChildrenCount(post);
    }

    onLoadMore(): void {
        // we don't need to display loader when loading more items.
        // this.postsStateService.loading$.next(true);
        const lastPostCreationTime = this.children?.[this.children.length - 1]?.creationTime;
        this._postsService.getAllPostsPaged(undefined, undefined, lastPostCreationTime, 0, MAX_POSTS_TO_LOAD)
            .subscribe(posts => {
              this.postsStateService.pushMorePosts(posts.items);
              this.children = this.postsStateService.getAllPosts();
            //   this.postsStateService.loading$.next(false);
              this._cdr.detectChanges();
            });
    }

    isUserFollowing(user: UserDto): boolean {
        return this._userFollowingService.isUserFollowing(user);
    }

    isUserLoading(userId: number): boolean {
        return this._userFollowingService.isUserLoading(userId.toString());
    }

    handleUserFollow(user: UserDto): void {
        if (this.isUserFollowing(user)) {
          this._userFollowingService.onUnFollowUser(user);
        } else {
          this._userFollowingService.onFollowUser(user);
        }
    }

}
