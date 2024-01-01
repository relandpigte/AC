import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { PostFocusField } from '@shared/enums/post/post-focus-field.enum';
import { FileUtils } from '@shared/helpers/file-utils';
import { AvailableServiceDto, PostsServiceProxy, PostType, SharedType, UpdatePostDto } from '@shared/service-proxies/service-proxies';
import { CommunityPostService } from '@shared/services/community-post.service';
import { ServiceCardUtils } from '@shared/helpers/service-card-utils';
import { LinkPreviewResponse, LinkPreviewService } from '@shared/services/link-preview.service';
import { Subject } from 'rxjs';

export enum PostTabs {
  QuickPost = 'quick-post',
  AddQuestion = 'add-question',
  AddDiscussion = 'add-discussion'
}

@Component({
  selector: 'app-upsert-post',
  templateUrl: './upsert-post.component.html',
  styleUrls: ['./upsert-post.component.scss']
})
export class UpsertPostComponent extends AppComponentBase implements OnInit {
  activeTab: string = PostTabs.QuickPost;
  allowedExtensions: string[] = [];

  parentPostId: string;
  model: any;
  selectedService: AvailableServiceDto;
  sharedLinks: LinkPreviewResponse[];

  isCreating = false;
  isShowServicePicker = false;
  isShowEmojiPicker = false;
  sanitizedAttachmentUrl: SafeUrl;
  focusedField: string;
  caretPosition: number;
  fileAttachment: File;

  @Input() allowTabs = true;
  @Input() canCancel = true;
  @Input() canRemoveAttachment = true;
  @Input() updateOnly = false;
  @Input() title: string;

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() onPostCreated = new EventEmitter<any>();

  linkPreviewTrigger$: Subject<void> = new Subject();

  private maxFileSize = fileUploadConfiguration.maxFileSize;
  private imageExtensions = fileUploadConfiguration.allowedImageExtensions;
  private videoExtensions = fileUploadConfiguration.videoExtensions;
  private fileExtensions = fileUploadConfiguration.allowedFileExtensions;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modal: BsModalRef,
    private _cdr: ChangeDetectorRef,
    private _linkPreviewService: LinkPreviewService,
    private _postSub: CommunityPostService,
    private _postsService: PostsServiceProxy
  ) {
    super(injector);

    this.linkPreviewTrigger$
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(1000))
      .subscribe(() => this.getLinkPreviews());
  }

  get canAddAttachment(): boolean { return this.model && !this.model.file && !this.model.serviceId; }
  get canAddImage(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }
  get canAddFile(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }
  get canAddEmoticons(): boolean { return this.activeTab === PostTabs.QuickPost; }
  get canAddService(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }

  get sharedPost(): any { return this.model?.sharedPost; }
  get sharedService(): any { return this.selectedService ?? ServiceCardUtils.getServiceData(this.model); }

  get tabTitle(): string {
    switch (this.model?.type) {
      case PostType.QuickPost:
        return 'Community.EditQuickPost';
      case PostType.Question:
        return 'Community.EditQuestion';
      case PostType.Discussion:
        return 'Community.EditDiscussion';
      default:
        return '';
    }
  }

  get isLoading(): boolean {
    return this.isCreating;
  }

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

  async ngOnInit(): Promise<void> {
    await this.getFileAttachment();
  }

  handleFocusChange(field: string): void {
    this.focusedField = field;
  }

  handleCaretChange(pos: number): void {
    this.caretPosition = pos;
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  navigateToAllTopics(): void {
    this.onCloseClick();
    this._router.navigate(['app', 'community', 'topics']);
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
      this.model.type,
      this.parentPostId,
      this.model.sharedId,
      this.model.sharedType,
      this.model.sharedServiceType,
      this.model.topics,
      this.model.newTopics,
      [this.model.file].filter(x => x).map(f => FileUtils.getFileParameter(f)),
      false
    ).pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isCreating = false))
      .subscribe(id => {
        this.onCloseClick();
        this.onPostCreated.emit(id);
        this._postSub.hasNewPost(null);
      });
  }

  handleUpdatePost(): void {
    this.isCreating = true;
    const request = new UpdatePostDto(this.model);

    if (this.model.type === 0 || this.model.type === 2) {
      request.content = this.model.information;
    }

    if (this.model.type === 2) {
      request.content = this.model.information;
    }

    this._postsService.update(request)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isCreating = false))
      .subscribe(_ => {
        this.onCloseClick();
        this.onPostCreated.emit();
        this._postSub.hasNewPost(null);
      });
  }

  async handleModelChanged(model: any) {
    this.model = {...this.model, ...model};
    this.model.information = this.model?.information ?? this.model?.content ?? '';
    this._cdr.detectChanges();
    this.linkPreviewTrigger$.next();
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
    this.fileAttachment = null;
    this.fileInput.nativeElement.value = '';
  }

  handleRemoveService(): void {
    this.model.sharedId = null;
    this.model.sharedServiceType = null;
    this.model.sharedType = null;
    this.selectedService = null;
  }

  handleRemovePost(): void {
    this.model.sharedPost = null;
    this.model.sharedId = null;
    this.model.sharedType = null;
  }

  handleOnAddService(service: AvailableServiceDto): void {
    this.model.sharedId = service.id;
    this.model.sharedType = SharedType.Service;
    this.model.sharedServiceType = service.serviceType;
    this.isShowServicePicker = false;

    this._postsService.getAvailableService(service.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(s => {
        this.selectedService = s;
      });
  }

  handleOnEmojiSelect(selected: Emoji): void {
    this.model.information = this.model.information ?? this.model.content;
    this.isShowEmojiPicker = false;

    const emoji: string = (selected.emoji as any).native;
    const {title, information} = this.model;
    const pos = this.caretPosition;
    switch (this.focusedField) {
      case PostFocusField.Title:
        this.model.title = `${title.slice(0, pos)}${emoji}${title.slice(pos)}`;
        break;
      default:
        this.model.information = `${information.slice(0, pos)}${emoji}${information.slice(pos)}`;
        break;
    }
  }

  onFileChange(e: any) {
    const file = e.target.files[0] as File;
    if (FileUtils.validateFile(this, [file], this.maxFileSize, 1, this.allowedExtensions)) {
      this.model.file = file;
      this.fileAttachment = file;
      this.sanitizedAttachmentUrl = FileUtils.getSanitizedFileUrl(this, file);
    }
    this.fileInput.nativeElement.value = '';
  }

  private isValidQuickPost(): boolean {
    return this.model && this.model.information || !!this.model.file || (!!this.model.sharedId &&
      !!this.model.sharedType && !!this.model.sharedServiceType);
  }

  private isValidQuestion(): boolean {
    return this.model && this.model.title && (this.model.topics?.length || this.model.newTopics?.length);
  }

  private isValidDiscussion(): boolean {
    return this.model && this.model.title && this.model.information && (this.model.topics?.length || this.model.newTopics?.length);
  }

  private async getFileAttachment(): Promise<void> {
    if (this.model?.postAttachments) {
      const [file] = this.model.postAttachments;
      if (file) {
        const document = file.document;
        if (document) {
          this.fileAttachment = await FileUtils.getFileBlob(file.documentUrl, document.name, document.fileType);
          this._cdr.detectChanges();
        }
      }
    }
  }

  private async getLinkPreviews() {
    this.sharedLinks = await this._linkPreviewService.getAllLinkPreviews(this.model.information);
  }
}
