import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

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
  export class AddPostComponent implements OnInit {

    activeTab: string = PostTabs.QuickPost;

    isCreating = false;

    constructor(
      private _router: Router,
      private _modal: BsModalRef,
      private _cdr: ChangeDetectorRef,
      private _postsService: PostsServiceProxy
    ) {
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
    }
}
