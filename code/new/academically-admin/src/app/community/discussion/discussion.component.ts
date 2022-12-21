import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { DisciplineTaxonomyDto, PostDto, PostsServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddPostComponent } from '../_modals/add-post/add-post.component';
import * as _ from 'lodash';
@Component({
    selector: 'app-discussion',
    templateUrl: './discussion.component.html',
    styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent extends AppComponentBase implements OnInit {
    private discussion: PostDto;

    discussionTopics: DisciplineTaxonomyDto[];
    participants: UserDto[] = [];

    isLoadingPost = false;

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

    get isLoading(): boolean { return this.isLoadingPost; }
    get isOwner(): boolean { return this.appSession.userId === this.discussion?.creatorUserId; }
    get discussionTitle(): string { return this.discussion?.title; }
    get discussionDescription(): string { return this.discussion?.content; }

    ngOnInit(): void {
        this.getParticipants();
    }

    private loadDiscussion(id: string): void {
        this.isLoadingPost = true;
        this._postsService.get(id)
            .pipe(takeUntil(this.destroyed$))
            .pipe(finalize(() => this.isLoadingPost = false))
            .subscribe(async post => {
                this.discussion = post;
                this.discussionTopics = post.postTopics?.map?.(t => t.disciplineTaxonomy);
            });
    }

    handleAddPost(tab: string): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<AddPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = { allowTabs: false, title: 'Community.QuickPost', activeTab: tab };
        this._modalService.show(AddPostComponent, modalSettings).content;
    }

    navigateBack(): void {
        this._location.back();
    }

    getParticipants(): void {
        this._usersService.getAll('', true, 'creationTime desc', 0, 4)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(pagedUsers => {
            this.participants = pagedUsers.items ?? [];
            this.participants = _.take(this.participants, 4);
        });
    }

    handleItemClick(type: string, item: any): void {
        switch(type) {
            case 'participants':
                break;
            default:

        }
    }

    handleViewAllClick(type: string): void {
        switch(type) {
            case 'participants':
                break;
            default:
                this._router.navigate(['app', 'community', 'following']);
        }
    }
}
