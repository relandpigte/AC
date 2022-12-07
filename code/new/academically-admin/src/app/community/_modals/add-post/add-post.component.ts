import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { SafeStyle, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileUtils } from '@shared/helpers/file-utils';
import { PostsServiceProxy, PostType } from '@shared/service-proxies/service-proxies';
import { CommunityPostService } from '@shared/services/community-post.service';
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
    model: any;

    activeTab: string = PostTabs.QuickPost;
    allowedExtensions: string[] = [];

    isCreating = false;

    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('videoAttachment') videoAttachment: ElementRef;
    @Output() onPostCreated = new EventEmitter<any>();

    private maxFileSize = fileUploadConfiguration.maxFileSize;
    private imageExtensions = fileUploadConfiguration.allowedImageExtensions;
    private videoExtensions = fileUploadConfiguration.videoExtensions;
    private fileExtensions = fileUploadConfiguration.allowedFileExtensions;

    sanitizedAttachmentUrl: SafeUrl;

    constructor(
        injector: Injector,
        private _router: Router,
        private _modal: BsModalRef,
        private _cdr: ChangeDetectorRef,
        private _postSub: CommunityPostService,
        private _postsService: PostsServiceProxy
    ) {
        super(injector)
    }

    get fileAttachment(): File { return this.model?.file; }
    get fileAttachmentName(): string { return this.fileAttachment?.name; }
    get fileAttachmentType(): string { return FileUtils.getFileExtension(this.fileAttachmentName).replace(/\./g, ''); }
    get fileAttachmentSize(): string { return this.formatBytes(this.fileAttachment?.size, 2); }
    get isImageAttachment(): boolean { return this.imageExtensions.some(x => x === `.${FileUtils.getFileExtension(this.fileAttachment?.name)}`); }
    get isVideoAttachment(): boolean { return this.videoExtensions.some(x => x === `.${FileUtils.getFileExtension(this.fileAttachment?.name)}`); }
    get isFileAttachment(): boolean { return this.fileExtensions.some(x => x === `.${FileUtils.getFileExtension(this.fileAttachment?.name)}`); }
    get isShowAttachmentInfo(): boolean { return !this.isImageAttachment; }
    get isVideoPlaying(): boolean {
        const video = this.videoAttachment?.nativeElement;
        return video && !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    }

    get canAttachFile(): boolean { return this.model && !this.model.file; }
    get canAddImage(): boolean { return this.canAttachFile && this.activeTab === PostTabs.QuickPost; }
    get canAddFile(): boolean { return this.canAttachFile && this.activeTab === PostTabs.QuickPost; }
    get canAddEmoticons(): boolean { return this.activeTab === PostTabs.QuickPost; }
    get canAddService(): boolean { return this.activeTab === PostTabs.QuickPost; }

    get isLoading(): boolean { return this.isCreating; }
    get isModelValid(): boolean {
        switch (this.model?.type) {
            case PostType.QuickPost:
                return this.isValidQuickPost();
            case PostType.Question:
                return this.isValidQuestion();
            case PostType.Discussion:
                return this.isValidDiscussion();
            default:
                return false;
        }
    }

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
            this._postSub.hasNewPost(null);
        });
    }

    private isValidQuickPost(): boolean {
        return this.model && this.model.information;
    }

    private isValidQuestion(): boolean {
        return this.model && this.model.title && (this.model.topics?.length || this.model.newTopics?.length);
    }

    private isValidDiscussion(): boolean {
        return this.model && this.model.title && this.model.information && (this.model.topics?.length || this.model.newTopics?.length);
    }

    handleImageUploadBtnClick(): void {
        this.allowedExtensions = [...this.imageExtensions, ...this.videoExtensions];
        setTimeout(() => this.fileInput.nativeElement.click());
    }

    handleFileUploadBtnClick(): void {
        this.allowedExtensions = this.fileExtensions;
        setTimeout(() => this.fileInput.nativeElement.click());
    }

    togglePlayVideo(): void {
        if (this.isVideoPlaying) this.videoAttachment.nativeElement.pause();
        else this.videoAttachment.nativeElement.play()
    }

    removeAttachment(): void {
        this.model.file = null;
        this.fileInput.nativeElement.value = '';
    }

    onFileChange(e: any) {
        const file = e.target.files[0] as File;
        if (FileUtils.validateFile(this, [file], this.maxFileSize, 1, this.allowedExtensions)) {
            this.model.file = file;
            this.sanitizedAttachmentUrl = FileUtils.getSanitizedFileUrl(this, file);
        }
        this.fileInput.nativeElement.value = '';
    }
}
