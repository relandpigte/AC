import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';

import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { PostFocusField } from '@shared/enums/post/post-focus-field.enum';
import { FileUtils } from '@shared/helpers/file-utils';
import { AvailableServiceDto, PostsServiceProxy, PostType, ServicesType, SharedType, UpdatePostDto } from '@shared/service-proxies/service-proxies';
import { CommunityPostService } from '@shared/services/community-post.service';

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

  isCreating = false;
  isShowServicePicker = false;
  isShowEmojiPicker = false;
  sanitizedAttachmentUrl: SafeUrl;
  focusedField: string;
  caretPosition: number;

  @Input() allowTabs = true;
  @Input() canCancel = true;
  @Input() canRemoveAttachment = true;
  @Input() updateOnly = false;
  @Input() title: string;

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() onPostCreated = new EventEmitter<any>();

  private maxFileSize = fileUploadConfiguration.maxFileSize;
  private imageExtensions = fileUploadConfiguration.allowedImageExtensions;
  private videoExtensions = fileUploadConfiguration.videoExtensions;
  private fileExtensions = fileUploadConfiguration.allowedFileExtensions;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modal: BsModalRef,
    private _cdr: ChangeDetectorRef,
    private _postSub: CommunityPostService,
    private _postsService: PostsServiceProxy
  ) {
    super(injector);
  }

  get canAddAttachment(): boolean { return this.model && !this.model.file && !this.model.serviceId; }
  get canAddImage(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }
  get canAddFile(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }
  get canAddEmoticons(): boolean { return this.activeTab === PostTabs.QuickPost; }
  get canAddService(): boolean { return this.canAddAttachment && this.activeTab === PostTabs.QuickPost; }

  get sharedAttachment(): File { return this.model?.file; }
  get sharedPost(): any { return this.model?.sharedPost; }
  get sharedService(): any {
      switch (this.model?.sharedServiceType) {
          case ServicesType.Event:
            return this.model.sharedServiceEvent;
          case ServicesType.Course:
            return this.model.sharedServiceCourse;
          case ServicesType.Tutorial:
            return this.model.sharedServiceVideo;
          case ServicesType.Article:
            return this.model.sharedServiceArticle;
          case ServicesType.Coaching:
            return this.model.sharedServiceCoaching;
          case ServicesType.Workshop:
            return this.model.sharedServiceEvent;
          default:
            return null;
      }
  }

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

  ngOnInit(): void {}

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
      this.model.shareId,
      this.model.sharedType,
      this.model.sharedServiceType,
      this.model.topics,
      this.model.newTopics,
      [this.model.file].filter(x => x).map(f => FileUtils.getFileParameter(f))
    ).pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isCreating = false))
      .subscribe(_ => {
        this.onCloseClick();
        this.onPostCreated.emit();
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

  handleModelChanged(model: any): void {
    this.model = {...this.model, ...model};
    this.model.information = this.model?.information ?? this.model?.content ?? '';
    this._cdr.detectChanges();
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
    this.isShowServicePicker = false;
    this.selectedService = service;
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
      this.sanitizedAttachmentUrl = FileUtils.getSanitizedFileUrl(this, file);
    }
    this.fileInput.nativeElement.value = '';
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
}
