import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CommentDto, ConversationReactionType,
  CourseConversationReactionDto, CourseConversationsServiceProxy, PostsServiceProxy, PostType
} from '@shared/service-proxies/service-proxies';
import { CommentsStateService } from '@shared/services/comments-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';

export const MAX_REPLIES_TO_LOAD = 5;
export const MAX_COMMENT_LEVELS = 3;

@Component({
  selector: 'app-community-discussions',
  templateUrl: './community-discussions.component.html',
  styleUrls: ['./community-discussions.component.less']
})
export class CommunityDiscussionsComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() show = false;
  @Input() isInCourse = true;
  @Input() isInTutorPortal = false;
  @Input() isChild = false;
  @Input() level = 1;
  @Input() referenceId: string;
  @Input() parentId: string;
  @Input() postType: PostType;
  @Input() ctrlEnterToSubmit = false;

  @Output() onReplyEmit = new EventEmitter<string>();
  @Output() onUpdateEmit = new EventEmitter<string>();

  @ViewChild('addCommentEl', { static: false }) addCommentEl: ElementRef;

  commentsStateService: CommentsStateService;

  ReactionType = ConversationReactionType;

  isPosting = false;
  isLoadingComments = false;

  comments: CommentDto[] = [];
  totalCommentsCount: number;
  commentReplyId: string;
  inputLength = 0;

  loadedReplyCount: number[] = [];
  skipCount: number[] = [];



  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _elRef: ElementRef,
    private _hubService: HubService,
    private _courseConversationsService: CourseConversationsServiceProxy,
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
  get isExpanded(): boolean { return this.comments?.length === this.totalCommentsCount; }

  ngOnInit(): void {
    this.initCommentsAppStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if ('show' in changes && changes?.show?.previousValue !== changes?.show?.currentValue && this.show) {
        setTimeout(() => this.addCommentEl.nativeElement.focus());
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

    this.comments = this.commentsStateService.getAllComments({ direction: this.isChild ? 'asc' : 'desc' });
    this.totalCommentsCount = this.commentsStateService.totalCommentsCount;
  }

  onFormSubmit(message: any, parentId?: string): void {
    this.isPosting = true;
    const model = new CommentDto();
    model.referenceId = this.referenceId;
    model.parentId = parentId;
    model.body = message.value;
    if (model.body && model.body.trim()) {
      this._postsServiceProxy.createComment(model)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isPosting = false;
          })
        ).subscribe(() => {
          message.value = '';
          this.notify.success(this.l('SuccessfullyPosted'));
        });
    }
  }

  onReactClick(type: ConversationReactionType, conversationId: string): void {
    const model = new CourseConversationReactionDto();
    model.type = type;
    model.courseConversationId = conversationId;
    model.creatorUserId = this.appSession.userId;
    this._courseConversationsService.createReaction(model)
      .pipe(
        takeUntil(this.destroyed$),
      ).subscribe(() => {
        this.notify.success(this.l('SuccessfullyReacted'));
      });
  }

  onUnreactClick(conversationReactions: CourseConversationReactionDto[], type: ConversationReactionType): void {
    const conversationReaction = conversationReactions.find(e => e.creatorUserId === this.appSession.userId && e.type === type);
    if (conversationReaction) {
      this._courseConversationsService.deleteReaction(conversationReaction.id)
        .pipe(
          takeUntil(this.destroyed$),
        ).subscribe(() => {
          this.notify.success(this.l('ReactionRemoved'));
        });
    }
  }

  hasUserReacted(conversationReactions: CourseConversationReactionDto[]): boolean {
    return conversationReactions?.filter(e => e.creatorUserId === this.appSession.userId).length > 0;
  }

  isMyReaction(conversationReactions: CourseConversationReactionDto[], type: ConversationReactionType): boolean {
    return conversationReactions?.filter(e => e.creatorUserId === this.appSession.userId && e.type === type).length > 0;
  }

  getReactionCount(conversationReactions: CourseConversationReactionDto[], type: ConversationReactionType): number {
    return 0;
  }

  getViewCount(comment: CommentDto): number {
    const skipCount = this.loadedReplyCount[comment.id];
    return comment.replyCount - (skipCount == 0 ? 1 : skipCount);
  }

  onMessageKeydown(event: any, form: NgForm, post?: any): void {
    if (event.keyCode === 13 && (!this.ctrlEnterToSubmit || (this.ctrlEnterToSubmit && event.ctrlKey))) {
      form.ngSubmit.emit();
      event.preventDefault();
    }
    if (post) {
      setTimeout(() => {
        this.inputLength = post.value.length;
      });
    }
  }

  onFoldClick(): void {
    const finalize = () => {
      this.comments = this.commentsStateService.getAllComments({ direction: this.isChild ? 'asc' : 'desc' });
      this.commentsStateService.loading$.next(false);
      this._cdr.detectChanges();
    }

    this.commentsStateService.loading$.next(true);
    if (!this.isExpanded) {
      this._postsServiceProxy.getAllCommentsPaged(this.referenceId, this.parentId, this.comments.length, MAX_REPLIES_TO_LOAD)
        .subscribe(oldComments => {
          this.commentsStateService.pushMoreComments(oldComments.items);
          finalize();
        });
    } else {
      this.commentsStateService.removeComments(this.comments.slice(1));
      finalize();
    }
  }

  initiateReply(id: string): void {
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
  }
}
