import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { PostsServiceProxy, PostType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { finalize, takeUntil } from 'rxjs/operators';

export enum PostTabs {
    QuickPost = 'quick-post',
    AddQuestion = 'add-question',
    AddDiscussion = 'add-discussion'
};

@Component({
    selector: 'app-add-post',
    templateUrl: './add-post.component.html',
    styleUrls: ['./add-post.component.scss']
  })
  export class AddPostComponent extends AppComponentBase implements OnInit {

    activeTab: string = PostTabs.QuickPost;
    @Output() onPostCreated = new EventEmitter<any>();

    model: any;

    isCreating = false;

    constructor(
        injector: Injector,
      private _router: Router,
      private _modal: BsModalRef,
      private _cdr: ChangeDetectorRef,
      private _postsService: PostsServiceProxy
    ) {
        super(injector)
    }

    get canAddImage(): boolean { return this.activeTab === PostTabs.QuickPost; }
    get canAddFile(): boolean { return this.activeTab === PostTabs.QuickPost; }
    get canAddEmoticons(): boolean { return this.activeTab === PostTabs.QuickPost; }
    get canAddService(): boolean { return this.activeTab === PostTabs.QuickPost; }

    get isLoading(): boolean { return this.isCreating; }

    ngOnInit(): void {
    }

    onCloseClick(): void {
        this._modal.hide();
    }

    navigateToAllTopics(): void {
        this.onCloseClick();
        this._router.navigate(['app', 'community', 'topics' ]);
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab;
        this._cdr.detectChanges();
    }

    handleCreatePost(): void {
        this.isCreating = true;
        this._postsService.create(
            this.model.title,
            this.model.information,
            this.model.visibility,
            this.model.type,
            this.model.topics,
            this.model.newTopics,
            null
        )
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isCreating = false))
        .subscribe(_ => {
            this.onCloseClick();
            this.onPostCreated.emit();
        });
    }
}
