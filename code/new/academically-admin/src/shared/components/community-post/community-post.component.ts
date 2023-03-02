
import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { FileUtils } from '@shared/helpers/file-utils';
import { AvailableServiceDto, DisciplineTaxonomyDto, PostsServiceProxy, PostType } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-community-post-card',
    templateUrl: './community-post.component.html',
    styleUrls: ['./community-post.component.scss']
})
export class CommunityPostCardComponent extends AppComponentBase implements OnChanges {
    @Input() closeHiddenPostAfter: number = 0;
    @Input() data: any;

    @Output() refresh = new EventEmitter();
    @Output() onUpdate = new EventEmitter();
    @Output() onChildrenUpdate = new EventEmitter();

    fileAttachment: File;
    serviceAttachment: AvailableServiceDto;
    userTopics: DisciplineTaxonomyDto[];
    isHidden = false;
    isHiding = false;
    hideTimer: any;
    showCommentsSection = true;

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _router: Router,
        private _postsServiceProxy: PostsServiceProxy,
        private _modalService: BsModalService,
    ) {
        super(injector);
    }

    get posterName(): string { return this.data.creatorUser?.fullName ?? 'Anonymous'; }
    get postDate(): string {
        const time = moment(this.data.creationTime);
        if (time.isSame(new Date(), 'day'))
            return time.format('h:mm a');
        else
            return time.format('MMM D, YYYY h:mm a');
    }

    get title(): string { return this.data.title; }
    get description(): string { return this.data.content; }
    get isOwner(): boolean {
        return this.appSession.userId === this.data?.creatorUserId;
    }

    get isQuickPost(): boolean { return this.data?.type === PostType.QuickPost; }
    get isQuestion(): boolean { return this.data?.type === PostType.Question; }
    get isDiscussion(): boolean { return this.data?.type === PostType.Discussion; }

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

    async ngOnChanges(changes: SimpleChanges) {
        if ('data' in changes && this.data) {
            this.userTopics = this.data.postTopics?.map?.(t => t.disciplineTaxonomy);
            await this.getFileAttachment();
            this.getServiceAttachment();
        }
    }

    private async getFileAttachment() {
        if (this.data.postAttachments) {
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

    private getServiceAttachment() {
        if (this.data.service) {
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

    goToDiscussion(): void {
        this._router.navigate(['app', 'community', 'discussion', this.data.id]);
    }

    onDeleteClick(id: string): void {
        this.message.confirm(
            this.l('DeletePostConfirmationMessage'),
            undefined,
            (result: boolean) => {
                if (result) {
                    this._postsServiceProxy.delete(id)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh.emit();
                    });
                }
            }
        );
    }

    onEditClick(data: any): void {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';

        const tabType = data?.type === 2 ? 'add-discussion' : data?.type === 1 ? 'add-question' : 'quick-post';
        modalSettings.initialState = {
            activeTab: tabType,
            updateOnly: true,
            model: {...data}
        };

        const modal = this._modalService.show(UpsertPostComponent, modalSettings).content;
        modal.onPostCreated.subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
            this.refresh.emit();
        });
    }

    onHideClick(id: string): void {
        this.message.confirm(
            this.l('AreYouSureWantToHideThisPost'),
            undefined,
            (result: boolean) => {
                if (result) {
                    this._postsServiceProxy.setPostVisibility(id, true, null, null, null)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe(() => {
                            this.isHidden = true;
                            this.isHiding = true;
                            if (this.closeHiddenPostAfter > 0) this.startHideTimer();
                    });
                }
            }
        );
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
}
