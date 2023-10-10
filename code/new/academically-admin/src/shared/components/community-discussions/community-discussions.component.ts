import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { debounceTime, finalize, take, takeUntil } from 'rxjs/operators';

import { SafeUrl } from '@angular/platform-browser';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { PostTypeReactionGroup } from '@shared/enums/post/reaction-group.enum';
import { FileUtils } from '@shared/helpers/file-utils';
import { AddServiceComponent } from '@shared/modals/add-service/add-service.component';
import { CommentHistoryComponent } from '@shared/modals/comment-history/comment-history.component';
import { AvailableServiceDto, CommentDto, CommentsServiceProxy, PostType, PostsServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { CommentsStateService, MAX_COMMENT_LEVELS, MAX_REPLIES_TO_LOAD } from '@shared/services/comments-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { LinkPreviewResponse, LinkPreviewService } from '@shared/services/link-preview.service';


@Component({
  selector: 'app-community-discussions',
  templateUrl: './community-discussions.component.html',
  styleUrls: ['./community-discussions.component.less']
})
export class CommunityDiscussionsComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() show = false;
  @Input() showAddComment = false;
  @Input() isChild = false;
  @Input() level = 1;
  @Input() referenceId: string;
  @Input() parentId: string;
  @Input() postType: PostType;
  @Input() ctrlEnterToSubmit = false;
  @Input() postCreatorId: number;
  @Input() isSidebar = false;

  @Input() foldSubject$ = new Subject();

  @Output() onReplyEmit = new EventEmitter<string>();
  @Output() onUpdateEmit = new EventEmitter<string>();
  @Output() onDeleteComment = new Subject<void>();

  @ViewChild('addCommentEl', { static: false }) addCommentEl: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('childFileInput') childFileInput: ElementRef;
  @ViewChild('editCommentReply') editCommentReply: ElementRef;
  @ViewChildren(CommunityDiscussionsComponent) childDiscussions: QueryList<CommunityDiscussionsComponent>;

  commentsStateService: CommentsStateService;

  isPosting = false;
  isLoadingComments: boolean = true;
  isUpdatingComment: boolean;

  comments: CommentDto[] = [];
  totalCommentsCount: number;

  commentReplyId: string;
  commentEditId: string;
  inputLength = 0;

  isShowServicePicker = false;
  selectedService: AvailableServiceDto;
  selectedServiceForChild: AvailableServiceDto;

  taggedPerson: UserDto;

  sanitizedAttachmentUrl: SafeUrl;
  sanitizedChildAttachmentUrl: SafeUrl;
  fileAttachment: File;
  childFileAttachment: File;
  sharedLinks: LinkPreviewResponse[];
  childSharedLinks: LinkPreviewResponse[];

  linkPreviewTrigger$: Subject<string> = new Subject();
  childLinkPreviewTrigger$: Subject<string> = new Subject();

  allowedExtensions: string[] = [];
  private maxFileSize = fileUploadConfiguration.maxFileSize;
  private imageExtensions = fileUploadConfiguration.allowedImageExtensions;
  private videoExtensions = fileUploadConfiguration.videoExtensions;
  private fileExtensions = fileUploadConfiguration.allowedFileExtensions;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _elRef: ElementRef,
    private _modalService: BsModalService,
    private _hubService: HubService,
    private _postsServiceProxy: PostsServiceProxy,
    private _modalDialogService: ModalDialogService,
    private _linkPreviewService: LinkPreviewService,
    private _commentServiceProxy: CommentsServiceProxy
  ) {
    super(injector);

    this.linkPreviewTrigger$
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(1000))
      .subscribe(async message => this.sharedLinks = await this._linkPreviewService.getAllLinkPreviews(message));

    this.childLinkPreviewTrigger$
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(1000))
      .subscribe(async message => this.childSharedLinks = await this._linkPreviewService.getAllLinkPreviews(message));
  }

  get commentsStateId(): string { return `comments-${this.referenceId}-${this.parentId}`; }
  get typeName(): string {
    switch (this.postType) {
        case PostType.Question:
            return 'answers';
        default:
            return 'comments';
    }
  }
  get hiddenCommentsCount(): number { return this.totalCommentsCount - this.comments.length; }
  get isExpanded(): boolean {
    return (this.totalCommentsCount > 1 && this.comments?.length === this.totalCommentsCount) ||
      (this.totalCommentsCount === 1 && this.childDiscussions.toArray().some(c => c.isPartiallyExpanded));
  }
  get isPartiallyExpanded(): boolean { return this.comments.length > 0 && this.totalCommentsCount >= this.comments.length; }
  get hasChildren(): boolean { return this.comments?.some(c => c.children?.length); }
  get isShowAddService(): boolean { return this.isTutor; }
  get isPostOwner(): boolean { return this.appSession.userId === this.postCreatorId; }
  get reactionGroup() { return PostTypeReactionGroup[this.postType]; }

  async ngOnInit(): Promise<void> {
    await this.initCommentsAppStates();
    this.initSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.show?.firstChange === false) {
      if ('show' in changes && changes?.show?.previousValue !== changes?.show?.currentValue) {
        if (this.show) this.doAddComment();
        else this.foldSubject$.next();
      }
    }
  }

  isUserCanDeleteComment(userId: number): boolean {
    return this.appSession.userId === userId || this.isCurrentUserAdmin || this.isPostOwner;
  }

  isUserCanEditComment(userId: number): boolean {
    return this.appSession.userId === userId;
  }

  isCurrentUserCan(userId: number): boolean {
    return this.isUserCanEditComment(userId) || this.isUserCanDeleteComment(userId);
  }

  handleDeleteComment(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteCommentConfirmationMessage'),
      confirmCb: (): void => {
        this._commentServiceProxy.deleteComment(id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(async () => {
            this.notify.success(this.l('CommentSuccessfullyDeleted'));
            if (!this.comments.length) {
              this.onDeleteComment.next();
              this._postsServiceProxy.getAllCommentsPaged(this.referenceId, this.parentId, this.comments.length, MAX_REPLIES_TO_LOAD)
                .subscribe(oldComments => {
                  this.commentsStateService.pushMoreComments(oldComments.items);
                  this.comments = this.commentsStateService.getAllComments({ direction: this.isChild ? 'asc' : 'desc' }).slice(0, 1);
                  this._cdr.detectChanges();
                });
            }
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  isCommentEdited(comment: CommentDto): boolean {
    return comment?.lastModificationTime != null;
  }

  handleEditComment(commentId: string): void {
    this.commentEditId = commentId;
    this.taggedPerson = this.comments.find(c => c.id === commentId)?.taggedUser;
    setTimeout(() => this.placeCaretAtEnd(this.editCommentReply.nativeElement));
    this._cdr.detectChanges();
  }

  handleCommentHistoryPopup(commentId: string): void {
    this._commentServiceProxy.get(commentId, true)
      .pipe(takeUntil(this.destroyed$), take(1))
      .subscribe((c: CommentDto) => {
        const modalSettings = this.defaultModalSettings as ModalOptions<CommentHistoryComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-comment-history ';
        modalSettings.initialState = {
          data: c
        };
        const history = this._modalService.show(CommentHistoryComponent, modalSettings).content;
    });
  }

  protected onEditCommentSubmit(message: HTMLDivElement, comment: CommentDto): void {
    const updated = new CommentDto(comment);
    const body = message.innerHTML?.trim();
    this.isUpdatingComment = true;

    if (body && body !== updated.body) {
      this._commentServiceProxy.update(
        updated.referenceId,
        updated.parentId,
        body,
        this.taggedPerson?.id,
        updated.parentId ? this.selectedServiceForChild?.id : this.selectedService?.id,
        updated.parentId ? this.selectedServiceForChild?.serviceType : this.selectedService?.serviceType,
        [updated.parentId ? this.fileAttachment : this.childFileAttachment].filter(x => x).map(f => FileUtils.getFileParameter(f)),
        updated.id
      ).pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isUpdatingComment = false;
        })
      ).subscribe((c: CommentDto) => {
        this.commentEditId = null;
        this.taggedPerson = null;
        this.handleRemoveAttachment(!!c.parentId);
        if (c.parentId) {
          this.selectedServiceForChild = null;
        } else {
          this.selectedService = null;
        }
        this.notify.success(this.l('CommentSuccessfullyUpdated'));
      });

      this._cdr.detectChanges();
    }
  }

  private async initCommentsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.commentsStateId]: {
        load: [this.referenceId, this.parentId, 0, 1],
        update: { referenceId: this.referenceId, parentId: this.parentId }
      }
    };
    const appStateServices: AppStateServices = {
      [this.commentsStateId]: {
          type: CommentsStateService,
          args: [this._hubService, this._postsServiceProxy]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.commentsStateService = this.pubSubService.getStateService<CommentsStateService>(this.commentsStateId);

    this.commentsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingComments = loading);

    this.commentsStateService.comments$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch(event.type) {
        case StateUpdateType.Add:
          this.comments = this.isChild ? this.comments.concat(event.data) : [event.data].concat(this.comments);
          this.totalCommentsCount++;
          break;
        case StateUpdateType.Update:
          this.comments = this.comments.map(c => c.id === event.data.id ? event.data : c);
          break;
        case StateUpdateType.Delete:
          this.comments = this.comments.filter(c => c.id != event.data.id);
          this.totalCommentsCount--;
          break;
      }
      this.onUpdateEmit.emit();
      this._cdr.detectChanges();
    });

    this.comments = this.isChild ? [] : this.commentsStateService.getAllComments({ direction: this.isChild ? 'asc' : 'desc' });
    this.totalCommentsCount = this.commentsStateService.totalCommentsCount;
    this.showAddComment = !!this.totalCommentsCount;
  }

  private initSubscriptions(): void {
    this.foldSubject$
      .subscribe(() => {
        this.commentsStateService.removeComments(this.comments.slice(1));
        this.comments = this.isChild ? [] : this.commentsStateService.getAllComments({ direction: this.isChild ? 'asc' : 'desc' });
        this._cdr.detectChanges();
      });
  }

  private placeCaretAtEnd(div: HTMLDivElement): void {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(div);
    range.collapse(false);
    selection.addRange(range);
    div.focus();
  }

  protected onFormSubmit(message: any, parentId?: string): void {
    this.isPosting = true;
    console.log(message.innerHTML);
    const body = message.value || message.innerHTML;
    if (body?.trim()) {
      this._postsServiceProxy.createComment(
        this.referenceId,
        parentId,
        body,
        this.taggedPerson?.id,
        parentId ? this.selectedServiceForChild?.id : this.selectedService?.id,
        parentId ? this.selectedServiceForChild?.serviceType : this.selectedService?.serviceType,
        [parentId ? this.fileAttachment : this.childFileAttachment].filter(x => x).map(f => FileUtils.getFileParameter(f))
      )
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isPosting = false;
          })
        ).subscribe(() => {
          message.value = '';
          message.innerHTML = '';
          message.blur();
          this.taggedPerson = null;
          this.handleRemoveAttachment(!!parentId);
          if (parentId) this.selectedServiceForChild = null;
          else this.selectedService = null;
          this.notify.success(this.l('SuccessfullyPosted'));
        });
      this._cdr.detectChanges();
    }
  }

  protected onMessageKeydown(event: any, form: NgForm, post?: { el: any, isChild: boolean }): void {
    const isCursorAtTheStart = (el) => {
      const range = window.getSelection().getRangeAt(0)
      const pre_range = document.createRange();
      pre_range.selectNodeContents(el);
      pre_range.setEnd(range.startContainer, range.startOffset);
      const text = pre_range.cloneContents();
      return text.textContent.length === 0;
    };

    if (event.keyCode === 13 && (!this.ctrlEnterToSubmit || (this.ctrlEnterToSubmit && event.ctrlKey))) {
      form.ngSubmit.emit();
      event.preventDefault();
    }
    if (event.keyCode === 8) {
      if (!event.target?.innerHTML || isCursorAtTheStart(event.target)) this.taggedPerson = null;
    }
    if (post) {
      setTimeout(() => {
        const contentValue = post.el.value ?? post.el.innerHTML;
        this.inputLength = contentValue.length
        if (post?.isChild) this.childLinkPreviewTrigger$.next(contentValue);
        else this.linkPreviewTrigger$.next(contentValue);
      });
    }

    // Escape [exit when editing comment]
    if (event.keyCode === 27 && this.commentEditId) this.commentEditId = null;
  }

  protected onFoldClick(): void {
    this.commentsStateService.loading$.next(true);
    if (!this.isExpanded) {
      this._postsServiceProxy.getAllCommentsPaged(this.referenceId, this.parentId, this.comments.length, MAX_REPLIES_TO_LOAD)
        .subscribe(oldComments => {
          this.commentsStateService.pushMoreComments(oldComments.items);
          this.comments = this.commentsStateService.getAllComments({ direction: this.isChild ? 'asc' : 'desc' });
          this.commentsStateService.loading$.next(false);
          this._cdr.detectChanges();
        });
    } else {
      this.commentsStateService.loading$.next(false);
      this.foldSubject$.next();
      this.selectedService = null;
      this.selectedServiceForChild = null;
    }
  }

  protected initiateReply(id: string): void {
    if (this.level < MAX_COMMENT_LEVELS) {
      this.commentReplyId = this.commentReplyId === id ? null : id;
      if (this.commentReplyId === id) {
        setTimeout(() => this._elRef.nativeElement.querySelector(`#add-reply-${id}`)?.focus());
      }
    } else {
      this.onReplyEmit.emit(this.parentId);
    }
    this.taggedPerson = this.comments.find(c => c.id === id)?.creatorUser;
    this.selectedServiceForChild = null;
  }

  protected toggleServicePicker(isForChild?: boolean): void {
    this.isShowServicePicker = !this.isShowServicePicker;
    if (!this.isShowServicePicker) return;
    const modalSettings = this.defaultModalSettings as ModalOptions<AddServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered';
    modalSettings.initialState = { selectedService: isForChild ? this.selectedService : this.selectedServiceForChild };

    const modal = this._modalService.show(AddServiceComponent, modalSettings).content;
    modal.onAdd.subscribe((service) => this.handleOnAddService(service, isForChild));
  }

  private handleOnAddService(service: AvailableServiceDto, isForChild?: boolean): void {
    if (isForChild) this.selectedServiceForChild = service;
    else this.selectedService = service;
    this.isShowServicePicker = false;
  }

  protected hasAttachedService(comment: CommentDto): boolean {
    return !!(comment?.article ?? comment?.coaching ?? comment?.course ?? comment?.event ?? comment?.video);
  }

  protected getAttachedService(comment: CommentDto): any {
    return comment?.article ?? comment?.coaching ?? comment?.course ?? comment?.event ?? comment?.video;
  }

  handleRemoveAttachment(isChild = false): void {
    if (isChild) {
      this.childFileAttachment = null;
      this.childFileInput.nativeElement.value = '';
    } else {
      this.fileAttachment = null;
      this.fileInput.nativeElement.value = '';
    }
  }

  handleImageUploadBtnClick(isChild = false): void {
    this.allowedExtensions = [...this.imageExtensions, ...this.videoExtensions];
    setTimeout(() => {
      if (isChild) this.childFileInput.nativeElement.click();
      else this.fileInput.nativeElement.click();
    });
  }

  handleFileUploadBtnClick(isChild = false): void {
    this.allowedExtensions = this.fileExtensions;
    setTimeout(() => {
      if (isChild) this.childFileInput.nativeElement.click();
      else this.fileInput.nativeElement.click();
    });
  }

  onFileChange(e: any, isChild = false) {
    const file = e.target.files[0] as File;
    if (FileUtils.validateFile(this, [file], this.maxFileSize, 1, this.allowedExtensions)) {
      if (isChild) {
        this.childFileAttachment = file;
        this.sanitizedChildAttachmentUrl = FileUtils.getSanitizedFileUrl(this, file);
      } else {
        this.fileAttachment = file;
        this.sanitizedAttachmentUrl = FileUtils.getSanitizedFileUrl(this, file);
      }
    }
    if (isChild) this.childFileInput.nativeElement.value = '';
    else this.fileInput.nativeElement.value = '';
  }

  doAddComment(): void {
    this.showAddComment = true;
    setTimeout(() => this.addCommentEl?.nativeElement?.focus());
  }
}
