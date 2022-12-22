import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, PostDto, PostsServiceProxy, PostType, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddPostComponent } from '../../../shared/modals/add-post/add-post.component';
import * as _ from 'lodash';

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

@Component({
    selector: 'app-discussion',
    templateUrl: './discussion.component.html',
    styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent extends AppComponentBase implements OnInit {
    private discussion: PostDto;

    children: PostDto[] = [];

    discussionTopics: DisciplineTaxonomyDto[];
    participants: UserDto[] = [];
    relatedDiscussions: PostDto[] = [];

    isLoadingPost = false;
    isLoadingChildren = false;
    isLoadingParticipants = false;
    isLoadingRelatedDiscussions = false;

    postFilteringEnum = PostFiltering;
    postSortingEnum = PostSorting;

    selectedFiltering: PostFiltering = PostFiltering.All;
    selectedSorting: PostSorting = PostSorting.Latest;

    constructor(
        injector: Injector,
        private _location: Location,
        private _route: ActivatedRoute,
        private _router: Router,
        private _modalService: BsModalService,
        private _postsService: PostsServiceProxy,
        private _usersService: UserServiceProxy
    ) {
        super(injector);
        this._route.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.loadDiscussion(paramMap.get('id'));
            }
        });
    }

    get isLoading(): boolean { return this.isLoadingPost || this.isLoadingChildren || this.isLoadingParticipants || this.isLoadingRelatedDiscussions; }
    get isOwner(): boolean { return this.appSession.userId === this.discussion?.creatorUserId; }
    get discussionTitle(): string { return this.discussion?.title; }
    get discussionDescription(): string { return this.discussion?.content; }

    ngOnInit(): void {
        this.getParticipants();
        this.getRelatedDiscussions();
    }

    private loadDiscussion(id: string): void {
        this.isLoadingPost = true;
        this._postsService.get(id)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingPost = false))
            .subscribe(async post => {
                this.discussion = post;
                this.discussionTopics = post.postTopics?.map?.(t => t.disciplineTaxonomy);
                this.getChildren();
            });
    }

    handleAddPost(): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<AddPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
            parentPostId: this.discussion.id,
            allowTabs: false,
            title: 'Community.QuickPost',
            activeTab: 'quick-post'
        };
        const modal = this._modalService.show(AddPostComponent, modalSettings).content;
        modal.onPostCreated
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.getChildren());
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
        this._usersService.getAll('', true, 'creationTime desc', 0, 4)
          .pipe(takeUntil(this.destroyed$))
          .pipe(finalize(() => this.isLoadingParticipants = false))
          .subscribe(pagedUsers => {
            this.participants = pagedUsers.items ?? [];
            this.participants = _.take(this.participants, 4);
        });
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
}
