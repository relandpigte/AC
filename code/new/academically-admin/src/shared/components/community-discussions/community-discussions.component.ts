import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CourseConversationsServiceProxy,
  CourseConversationDto,
  StudentCoursesServiceProxy,
  UserLoginInfoDto,
  ConversationReactionType,
  CourseConversationReactionDto,
  PostsServiceProxy,
  CommentDto,
} from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgModel, NgForm } from '@angular/forms';
import * as _ from 'lodash';
@Component({
  selector: 'app-community-discussions',
  templateUrl: './community-discussions.component.html',
  styleUrls: ['./community-discussions.component.less']
})
export class CommunityDiscussionsComponent extends AppComponentBase implements OnInit {
  @Input() isInCourse = true;
  @Input() isInTutorPortal = false;
  @Input() postId: string;

  courseId: string;
  conversations: CommentDto[] = [];
  isPosting = false;
  ReactionType = ConversationReactionType;
  inputLength = 0;

  _postId: string;
  isReplyButtonHidden = false; // will enchance later
  loadedReplyCount: number[] = [];
  skipCount: number[] = [];

  private _maxRepliesToLoad = 3;

  constructor(
    injector: Injector,
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
        ).subscribe(() => {
          this.getConversations();
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
    if (event.keyCode === 13) {
      form.ngSubmit.emit();
    }
    if (post) {
      setTimeout(() => {
        this.inputLength = post.value.length;
      });
    }
  }

  onLoadMoreRepliesClick(parent: CommentDto): void {
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
    console.log('get replies');
    let count = 0;
    if (_.isNil(this.skipCount[comment.id])) {
      this.skipCount[comment.id] = 0;
      count = 1;
    } else {
      if (this.skipCount[comment.id] === 0) {
        count = this._maxRepliesToLoad;
        this.skipCount[comment.id] = 1;
      } else {
        const remainingReplyCount = (this.loadedReplyCount[comment.id] - 1) % 3;
        if (remainingReplyCount === 0) {
          count = this._maxRepliesToLoad;
        } else {
          count = remainingReplyCount;
        }
        this.skipCount[comment.id] += count;
      }
    }

    this._postsServiceProxy.getAllCommentReplies(
      comment.id,
      this.skipCount[comment.id],
      count,
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        console.warn(response);
        if (this.loadedReplyCount[comment.id] === 0) {
          comment.children = response.items;
        } else {
          comment.children = [...comment.children, ...response.items];
        }
        this.loadedReplyCount[comment.id] += response.items.length;
      });
  }

  reply(): void {
    console.log(this.isReplyButtonHidden);
    this.isReplyButtonHidden = false;
    console.log(this.isReplyButtonHidden);
  }
}
