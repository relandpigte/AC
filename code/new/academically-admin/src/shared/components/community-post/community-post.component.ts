import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ReactionGroup } from '@shared/enums/post/reaction-group.enum';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { FileUtils } from '@shared/helpers/file-utils';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { AvailableServiceDto, DisciplineTaxonomyDto, PostDto, PostsServiceProxy, PostType, ReactionType, SharedType, UserDto } from '@shared/service-proxies/service-proxies';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { UserFollowingService } from '@shared/services/user-following.service';
import { CommunityDiscussionsComponent } from '../community-discussions/community-discussions.component';
import { PostsStateService } from '@shared/services/posts-state.service';

enum SubscribeType {
    subscribe = 'Subscribe',
    unsubscribe = 'Unsubscribe'
}

@Component({
    selector: 'app-community-post-card',
    templateUrl: './community-post.component.html',
    styleUrls: ['./community-post.component.scss']
})
export class CommunityPostCardComponent extends AppComponentBase implements OnChanges, OnInit {
    readonly showMoreLimit: number = 255;

    @Input() data: any;
    @Input() isLoading: boolean;
    @Input() closeHiddenPostAfter = 0;
    @Input() isHistoryCard: boolean;
    @Input() hideEdited: boolean;
    @Input() hideSharing: boolean;
    @Input() canOverrideOwner: boolean;
    @Input() reactionGroup: ReactionGroup = ReactionGroup.Emotions;
    @Input() isCommunity: boolean;

    @Output() refresh = new EventEmitter();
    @Output() onUpdate = new EventEmitter();
    @Output() onChildrenUpdate = new EventEmitter();
    @Output() onSharePost: EventEmitter<PostDto> = new EventEmitter<PostDto>();

    @ViewChild(CommunityDiscussionsComponent) commentsContainer: CommunityDiscussionsComponent;

    fileAttachment: File;
    serviceAttachment: AvailableServiceDto;
    userTopics: DisciplineTaxonomyDto[];
    isHidden = false;
    isPublic = false;
    isHiding = false;
    hideTimer: any;
    showComments = true;
    showAddComment = false;
    showMore = false;
    showUnfollow = false;

    isLoadingSubscriberIds = false;

    subscriberIds: number[] = [];
    postsStateService: PostsStateService;

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _postsServiceProxy: PostsServiceProxy,
        private _modalService: BsModalService,
        private _userFollowingService: UserFollowingService,
        private _modalDialogService: ModalDialogService
    ) {
        super(injector);
    }

    get shimmerType() { return ShimmerType; }
    get isShowMore(): boolean { return this.description?.length > this.showMoreLimit; }
    get posterName(): string { return this.data?.creatorUser?.fullName ?? 'Anonymous'; }
    get postDate(): string {
        let time = null;
        if (this.data?.lastModificationTime) time = moment(this.data.lastModificationTime);
        else if (this.data?.creationTime) time = moment(this.data.creationTime);
        if (time) return this.convertMomentToPostDateAgo(time);
        return '';
    }

    get title(): string { return this.data?.title ?? ''; }
    get description(): string { return this.data?.content?.replace(/(\\r\\n|\\n|\\r|\\n\\r)/gm, ' ') ?? ''; }
    get isOwner(): boolean { return this.appSession.userId === this.data?.creatorUserId; }
    get isQuickPost(): boolean { return this.data?.type === PostType.QuickPost; }
    get isQuestion(): boolean { return this.data?.type === PostType.Question; }
    get isDiscussion(): boolean { return this.data?.type === PostType.Discussion; }
    get discussionTitle(): string { return this.data?.parent?.title; }
    get discussionParentId(): string { return this.data?.parent?.id; }

    get typeName(): string {
        switch (this.data?.type) {
            case PostType.Question:
                return 'question';
            case PostType.Discussion:
                return 'discussion';
            default:
                return 'post';
        }
    }
    get sharedPost(): any { return this.data?.sharedPost; }
    get sharedService(): any { return ServiceCardUtils.getServiceData(this.data); }
    get isEdited(): boolean { return this.data?.lastModificationTime != null; }
    get hasSharedPost(): boolean { return this.data?.sharedId && this.data?.sharedType === SharedType.Post; }
    get hasSharedService(): boolean { return this.data?.sharedId && this.data?.sharedType === SharedType.Service; }
    get isShowOwnerTag(): boolean { return this.isOwner || !this.isUserFollowing(this.data?.creatorUser) || (this.isUserFollowing(this.data?.creatorUser) && this.showUnfollow)}
    get ReactionGroup() { return ReactionGroup; }

    get isSubscribedToNotifications(): boolean { return this.subscriberIds?.includes(this.appSession.userId); }

    get IsLoading(): boolean { return this.isLoading || this.isLoadingSubscriberIds; }

    ngOnInit() {
        UserFollowingService.userFollowedChanged$.pipe(takeUntil(this.destroyed$))
            .subscribe((change) => {
                if (change > 0) this.showUnfollow = true;
            });
    }

    async ngOnChanges(changes: SimpleChanges) {
        if ('data' in changes && this.data) {
            this.userTopics = this.data?.postTopics?.map?.(t => t.disciplineTaxonomy);
            this.isHidden = this.data?.isHidden;
            this.isHiding = this.data?.isHidden;
            this.isPublic = this.data?.isPublic;

            await this.getFileAttachment();
            await this.getServiceAttachment();
            await this.getSubscriberIds();

        }
    }

    // Pass the emitted post data
    handleSharePost(event: Event): void {
        event.preventDefault();
        this.onSharePost.emit(this.data);
    }

    doAddComment(): void {
        this.showComments = true;
        this.commentsContainer.doAddComment();
    }

    doToggleComments(): void {
        this.showComments = !this.showComments;
        if (this.showAddComment) this.commentsContainer.doAddComment();
    }

    goToDiscussion(): void {
        if (this.data?.id) {
            const url = `${AppConsts.appBaseUrl}/app/community/discussion/${this.data?.id}`;
            window.open(url, '_blank');
        }
    }

    goToDiscussionFromPublic(): void {
        if (!!this.discussionParentId) {
            const url = `${AppConsts.appBaseUrl}/app/community/discussion/${this.discussionParentId}`;
            window.open(url, '_blank');
        }
    }

    goToHistory(): void {
        if (this.data?.id) {
            const url = `${AppConsts.appBaseUrl}/app/community/edit-history/${this.data?.id}`;
            window.open(url, '_blank');
        }
    }

    onDeleteClick(id: string): void {
        const options: ModalDialogOptions = {
            title: this.l('AreYouSure'),
            text: this.l('DeletePostConfirmationMessage'),
            confirmCb: (): void => {
                this._postsServiceProxy.delete(id)
                  .pipe(takeUntil(this.destroyed$))
                  .subscribe(() => {
                      this.notify.success(this.l('SuccessfullyDeleted'));
                      this.refresh.emit();
                  });
            }
        };
        this._modalDialogService.showConfirmDialog(options);
    }

    onEditClick(data: any): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';

        const tabType = data?.type === 2 ? 'add-discussion' : data?.type === 1 ? 'add-question' : 'quick-post';
        modalSettings.initialState = {
            activeTab: tabType,
            updateOnly: true,
            model: data,
            canRemoveAttachment: false
        };

        const modal = this._modalService.show(UpsertPostComponent, modalSettings).content;
        modal.onPostCreated.subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
            this.refresh.emit();
        });
    }

    onHideClick(id: string): void {
        this._postsServiceProxy.setPostVisibility(id, true, null, null, null)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.isHidden = true;
                this.isHiding = true;
                if (this.closeHiddenPostAfter > 0) {
                    this.startHideTimer();
                }
            });
    }

    onUndoHideClick(id: string): void {
        this._postsServiceProxy.setPostVisibility(id, false, null, null, null)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.isHidden = false;
                if (this.hideTimer) {
                    clearTimeout(this.hideTimer);
                }
        });
    }

    onCloseHideClick(id: string): void {
        if (this.hideTimer) clearTimeout(this.hideTimer);
        this.isHiding = false;
        this.isHidden = true;
        this.data.isHidden = true;
        this.onUpdate.emit(this.data);
    }

    handleCommentUpdates(): void {
        this.onChildrenUpdate.emit();
    }

    isUserFollowing(user: UserDto): boolean {
        if (!user) return false;
        return this._userFollowingService.isUserFollowing(user);
    }

    isUserLoading(userId: number): boolean {
        return this._userFollowingService.isUserLoading(userId?.toString());
    }

    handleUserFollow(user: UserDto): void {
        if (this.isUserFollowing(user)) {
            this._userFollowingService.onUnFollowUser(user);
        } else {
            this._userFollowingService.onFollowUser(user);
        }
    }

    private async getFileAttachment() {
        if (this.data?.postAttachments) {
            const [file] = this.data.postAttachments;
            if (file) {
                const document = file.document;
                if (document) {
                    this.fileAttachment = await FileUtils.getFileBlob(file.documentUrl, document.name, document.fileType);
                    this._cdr.detectChanges();
                }
            }
        }
    }

    private async getServiceAttachment() {
        if (this.data?.service) {
            this.serviceAttachment = this.data.service;
        }
    }

    private startHideTimer(): void {
        const self = this;
        this.hideTimer = setTimeout(() => {
            this.isHiding = false;
            this.data.isHidden = true;
            this.onUpdate.emit(this.data);
        }, 1000 * this.closeHiddenPostAfter);
    }

    private async getSubscriberIds() {
        this.isLoadingSubscriberIds = true;
        if (this.data) this.subscriberIds = this.data.postNotification?.map(n => n.creatorUserId);
        this.isLoadingSubscriberIds = false;
    }

    handleSubscribeClick(): void {
        if (this.data?.id) {
            const type = this.isSubscribedToNotifications ? SubscribeType.unsubscribe : SubscribeType.subscribe;
            const postId = this.data.id;
            const userId = this.appSession.userId;

            const service = type === SubscribeType.subscribe ? this._postsServiceProxy.createPostNotification(postId, userId)
                : this._postsServiceProxy.deletePostNotification(postId, userId);

            service.pipe(takeUntil(this.destroyed$))
                .subscribe(() => {
                    if (type === SubscribeType.subscribe) this.subscriberIds.push(userId);
                    else this.subscriberIds = this.subscriberIds.filter(s => s !== userId);
                });
        }
    }
}
