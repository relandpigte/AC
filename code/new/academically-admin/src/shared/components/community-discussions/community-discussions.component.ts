import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { AddServiceComponent } from '@shared/modals/add-service/add-service.component';
import { AvailableServiceDto, CommentDto, PostsServiceProxy, PostType } from '@shared/service-proxies/service-proxies';
import { CommentsStateService, MAX_COMMENT_LEVELS, MAX_REPLIES_TO_LOAD } from '@shared/services/comments-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

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

  @Input() foldSubject$ = new Subject();

  @Output() onReplyEmit = new EventEmitter<string>();
  @Output() onUpdateEmit = new EventEmitter<string>();

  @ViewChild('addCommentEl', { static: false }) addCommentEl: ElementRef;
  @ViewChildren(CommunityDiscussionsComponent) childDiscussions: QueryList<CommunityDiscussionsComponent>;

  commentsStateService: CommentsStateService;

  isPosting = false;
  isLoadingComments = false;

  comments: CommentDto[] = [];
  totalCommentsCount: number;

  commentReplyId: string;
  inputLength = 0;

  isShowServicePicker = false;
  selectedService: AvailableServiceDto;
  selectedServiceForChild: AvailableServiceDto;

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _elRef: ElementRef,
    private _modalService: BsModalService,
    private _hubService: HubService,
    private _postsServiceProxy: PostsServiceProxy
  ) {
    super(injector);
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
  get isExpanded(): boolean { return (this.totalCommentsCount > 1 && this.comments?.length === this.totalCommentsCount) || (this.totalCommentsCount === 1 && this.childDiscussions.toArray().some(c => c.isPartiallyExpanded)); }
  get isPartiallyExpanded(): boolean { return this.comments.length > 0 && this.totalCommentsCount >= this.comments.length; }
  get hasChildren(): boolean { return this.comments?.some(c => c.children?.length); }
  get isShowAddService(): boolean { return this.isTutor; }
  get isLoading(): boolean { return this.isLoadingComments; }

  ngOnInit(): void {
    this.initCommentsAppStates();
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

  protected onFormSubmit(message: any, parentId?: string): void {
    this.isPosting = true;
    const model = new CommentDto();
    model.referenceId = this.referenceId;
    model.parentId = parentId;
    model.body = message.value;
    model.serviceId = parentId ? this.selectedServiceForChild?.id : this.selectedService?.id;
    model.serviceType = parentId ? this.selectedServiceForChild?.serviceType : this.selectedService?.serviceType;

    if (model.body && model.body.trim()) {
      this._postsServiceProxy.createComment(model)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isPosting = false;
          })
        ).subscribe(() => {
          message.value = '';
          if (parentId) this.selectedServiceForChild = null;
          else this.selectedService = null;
          this.notify.success(this.l('SuccessfullyPosted'));
        });
    }
  }

  protected onMessageKeydown(event: any, form: NgForm, post?: any): void {
    if (event.keyCode === 13 && (!this.ctrlEnterToSubmit || (this.ctrlEnterToSubmit && event.ctrlKey))) {
      form.ngSubmit.emit();
      event.preventDefault();
    }
    if (post) setTimeout(() => this.inputLength = post.value.length);
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
        setTimeout(() => {
          const addReplyEl = this._elRef.nativeElement.querySelector(`#add-reply-${id}`);
          if (addReplyEl) addReplyEl.focus();
        });
      }
    } else {
      this.onReplyEmit.emit(this.parentId);
    }
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

  doAddComment(): void {
    this.showAddComment = true;
    setTimeout(() => this.addCommentEl?.nativeElement.focus());
  }
}
