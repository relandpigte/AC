import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileUtils } from '@shared/helpers/file-utils';
import { AvailableServiceDto, PostsServiceProxy, PostType } from '@shared/service-proxies/service-proxies';
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
    selectedService: AvailableServiceDto;

    activeTab: string = PostTabs.QuickPost;
    allowedExtensions: string[] = [];

    isCreating = false;
    isShowServicePicker = false;

    @ViewChild('fileInput') fileInput: ElementRef;
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

    get canAddAttachment(): boolean { return this.model && !this.model.file && !this.model.serviceId; }
    get canAddImage(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }
    get canAddFile(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }
    get canAddEmoticons(): boolean { return this.activeTab === PostTabs.QuickPost; }
    get canAddService(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }

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
        this.model.file = null;
        this.model.serviceId = null;
        this.selectedService = null;
        this._cdr.detectChanges();
    }

    handleCreatePost(): void {
        this.isCreating = true;
        this._postsService.create(
            this.model.title,
            this.model.information,
            this.model.visibility,
            this.model.serviceId,
            this.model.type,
            this.model.topics,
            this.model.newTopics,
            [FileUtils.getFileParameter(this.model.file)]
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

    handleRemoveAttachment(): void {
        this.model.file = null;
        this.fileInput.nativeElement.value = '';
    }

    handleRemoveService(): void {
        this.model.serviceId = null;
        this.selectedService = null;
    }

    handleOnAddService(service: AvailableServiceDto): void {
        this.model.serviceId = service.id;
        this.selectedService = service;
        this.isShowServicePicker = false;
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
