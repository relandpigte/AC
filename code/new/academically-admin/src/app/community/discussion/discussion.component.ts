import { Location } from '@angular/common';
import { Component, Injector, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, PostDto, PostsServiceProxy, PostType, UserDto, PostNotificationDto } from '@shared/service-proxies/service-proxies';
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
export class DiscussionComponent extends AppComponentBase {

    @Input() canFilter = false;

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
        private _modalService: BsModalService,
        private _postsService: PostsServiceProxy
    ) {
        super(injector);
        this._route.paramMap.subscribe(async paramMap => {
            if (paramMap.has('id')) {
                this.id = paramMap.get('id');
                this.loadDiscussion(this.id);
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

    private async loadDiscussion(id: string) {
        this.isLoadingPost = true;
        this._postsService.get(id)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingPost = false))
            .subscribe(async post => {
                this.discussion = post;
                this.discussionTopics = post.postTopics?.map?.(t => t.disciplineTaxonomy);
                this.loadOtherInfo();
            });
    }

    private async loadOtherInfo() {
        this.getChildren();
        this.getParticipants();
        this.getSubscriberIds();
        this.getRelatedDiscussions();
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
            .subscribe(async () => this.loadDiscussion(this.id));
    }

    navigateBack(): void {
        this._location.back();
    }

    getChildren(): void {
        this.isLoadingChildren = true;
        this._postsService.getAllPosts(undefined, this.discussion.id)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingChildren = false))
            .subscribe(children => {
                this.children = children;
            })
    }

    getParticipants(): void {
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

    getSubscriberIds(): void {
        this.isLoadingSubscriberIds = true;
        if (this.discussion) this.subscriberIds = this.discussion.postNotification?.map(n => n.creatorUserId);
        this.isLoadingSubscriberIds = false;
    }

    getRelatedDiscussions(): void {
        this.isLoadingRelatedDiscussions = true;
        this._postsService.getAllPosts(PostType.Discussion, undefined)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingRelatedDiscussions = false))
            .subscribe(discussions => {
                this.relatedDiscussions = discussions.filter(d => d.id !== this.discussion?.id);
                this.relatedDiscussions = _.take(this.relatedDiscussions, 4);
            });
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

    handleOnUpdatePost(post: PostDto): void {
        this.children = this.children.map(c => {
            if (c.id === post.id) return post;
            return c;
        });
    }

    handleFilteringChange(filter: PostFiltering): void {
        this.selectedFiltering = filter;
        this.getChildren();
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
