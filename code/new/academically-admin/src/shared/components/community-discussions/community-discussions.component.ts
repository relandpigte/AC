import { Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CommentDto, ConversationReactionType,
  CourseConversationReactionDto, CourseConversationsServiceProxy, PostsServiceProxy
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-community-discussions',
  templateUrl: './community-discussions.component.html',
  styleUrls: ['./community-discussions.component.less']
})
export class CommunityDiscussionsComponent extends AppComponentBase implements OnInit, OnChanges {
  @Input() show = false;
  @Input() isInCourse = true;
  @Input() isInTutorPortal = false;
  @Input() postId: string;
  @Input() ctrlEnterToSubmit = false;

  @ViewChild('addCommentEl', { static: false }) addCommentEl: ElementRef;

  courseId: string;
  conversations: CommentDto[] = [];
  isPosting = false;
  ReactionType = ConversationReactionType;
  inputLength = 0;

  _postId: string;
  conversationReplyId: string;
  loadedReplyCount: number[] = [];
  skipCount: number[] = [];

  private _maxRepliesToLoad = 0; // load all

  constructor(
    injector: Injector,
    private _elRef: ElementRef,
    private _route: ActivatedRoute,
    private _courseConversationsService: CourseConversationsServiceProxy,

    private _postsServiceProxy: PostsServiceProxy
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
      }
    });
  }
  @Input() set studentCourseId(value: string) {
    this._postId = value;
    this.getConversations();
  }

  ngOnInit(): void {
    this.getConversations();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if ('show' in changes && changes?.show?.previousValue !== changes?.show?.currentValue && this.show) {
        setTimeout(() => this.addCommentEl.nativeElement.focus());
      }
  }

  onFormSubmit(message: any, parentId?: string): void {
    this.isPosting = true;
    const model = new CommentDto();
    model.referenceId = this.postId;
    model.parentId = parentId;
    model.body = message.value;
    if (model.body && model.body.trim()) {
      this._postsServiceProxy.createComment(model)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isPosting = false;
          })
        ).subscribe(newComment => {
          if (parentId) this.conversations = this.conversations.map(c => {
            if (c.id === parentId) {
              c.children.push(newComment);
              c.replyCount++;
              this.loadedReplyCount[c.id] = (this.loadedReplyCount[c.id] ?? 0) + 1;
            }
            return c;
          });
          else this.conversations.unshift(newComment);
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
        this.getConversations();
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
          this.getConversations();
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

  onLoadMoreRepliesClick(event: any, parent: CommentDto): void {
    event.preventDefault();
    this.getReplies(parent);
  }

  private getConversations(): void {
    this._postsServiceProxy.getAllComment(this.postId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(conversations => {
        this.conversations = conversations;
        _.each(this.conversations, comment => {
          this.loadedReplyCount[comment.id] = 0;
          this.getReplies(comment);
        });
      });
  }

  private getReplies(comment: CommentDto): void {
    let count = 0;
    if (_.isNil(this.skipCount[comment.id])) {
      this.skipCount[comment.id] = 0;
      count = 1;
    } else {
      const remainingReplyCount = comment.replyCount - this.loadedReplyCount[comment.id];
      if (remainingReplyCount % this._maxRepliesToLoad === 0)  count = this._maxRepliesToLoad;
      else count = this._maxRepliesToLoad > 0 ? this._maxRepliesToLoad : remainingReplyCount;
      this.skipCount[comment.id] += count;
    }

    this._postsServiceProxy.getAllCommentReplies(
      comment.id,
      this.loadedReplyCount[comment.id],
      count,
    )
    .pipe(takeUntil(this.destroyed$))
    .subscribe(response => {
      if (this.loadedReplyCount[comment.id] === 0) comment.children = response.items;
      else comment.children = [...comment.children, ...response.items];
      this.loadedReplyCount[comment.id] += response.items.length;
      comment.children = _.sortBy(comment.children, c => c.creationTime);
    });
  }

  initiateReply(conversation: CommentDto): void {
    this.conversationReplyId = this.conversationReplyId === conversation.id ? null : conversation.id;
    if (this.conversationReplyId === conversation.id) {
      setTimeout(() => {
        const addReplyEl = this._elRef.nativeElement.querySelector(`#add-reply-${conversation.id}`);
        if (addReplyEl) addReplyEl.focus();
      });
    }
  }
}
