import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CommentDto, CommentsServiceProxy, CommentReactionDto, CommentReactionType } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent extends AppComponentBase implements OnInit {
  @Input() set referenceId(value: string) {
    this._referenceId = value;
    this.getComments();
  }
  @Input() isSidebar = true;

  get referenceId() {
    return this._referenceId
  }

  comments: CommentDto[];
  isLoading = false;
  isCommentsLoading = false;
  newComment = new CommentDto();
  newReply = new CommentDto();
  isReplying: boolean[] = [];
  skipCount: number[] = [];
  loadedReplyCount: number[] = [];

  private _referenceId: string;
  private _maxRepliesToLoad = 3;

  constructor(
    injector: Injector,
    route: ActivatedRoute,
    private _commentsService: CommentsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {

  }

  onFormSubmit(): void {
    this.createComment();
  }

  onReplyFormSubmit(parent: CommentDto): void {
    this.createReply(parent);
  }

  onBodyKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.createComment();
    }
  }

  onReplyBodyKeydown(e: KeyboardEvent, parent: CommentDto): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.createReply(parent);
    }
  }

  onToggleReply(id: string): void {
    this.newReply = new CommentDto();
    this.isReplying = [];
    this.isReplying[id] = true;
  }

  onLoadMoreRepliesClick(parent: CommentDto): void {
    this.getReplies(parent);
  }

  onLikeClick(comment: CommentDto): void {
    const reaction = new CommentReactionDto();
    reaction.commentId = comment.id;
    reaction.type = CommentReactionType.Like;
    this._commentsService.createReaction(reaction)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        comment.commentReactions.push(response);
      });
  }

  onUnlikeClick(comment: CommentDto): void {
    const index = comment.commentReactions.findIndex(e => e.creatorUserId === this.appSession.userId);
    if (index >= 0) {
      this._commentsService.deleteReaction(comment.commentReactions[index].id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          comment.commentReactions.splice(index, 1);
        });
    }
  }

  checkIfReacted(comment: CommentDto): boolean {
    return comment.commentReactions.filter(e => e.creatorUserId === this.appSession.userId).length > 0;
  }

  private createComment(): void {
    if (this.newComment && this.newComment.body && this.newComment.body.trim() && !this.isLoading) {
      this.isLoading = true;
      this.newComment.referenceId = this._referenceId;
      this._commentsService.create(this.newComment)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(response => {
          this.notify.success(this.l('SuccessfullySubmitted'));
          this.newComment = new CommentDto();
          response.commentReactions = [];
          response.children = [];
          response.replyCount = 0;
          this.comments.unshift(response);
          this.loadedReplyCount[response.id] = 0;
        });
    }
  }

  private createReply(parent: CommentDto): void {
    if (this.newReply && this.newReply.body && this.newReply.body.trim() && !this.isLoading) {
      this.isLoading = true;
      this.newReply.referenceId = this._referenceId;
      this.newReply.parentId = parent.id;
      this._commentsService.create(this.newReply)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(response => {
          this.notify.success(this.l('SuccessfullySubmitted'));
          this.newReply = new CommentDto();
          response.commentReactions = [];
          response.replyCount = 0;
          parent.children = [response, ...parent.children];
          parent.replyCount++;
          this.loadedReplyCount[parent.id]++;
          this.skipCount[parent.id]++;
          this.isReplying = [];
        });
    }
  }

  private getComments(): void {
    this.isCommentsLoading = true;
    this.comments = [];
    this.skipCount = [];
    this.loadedReplyCount = []
    this.isReplying = [];
    this._commentsService.getAll(this._referenceId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isCommentsLoading = false;
        })
      )
      .subscribe(responses => {
        this.comments = responses;
        _.each(this.comments, comment => {
          this.loadedReplyCount[comment.id] = 0;
          this.getReplies(comment);
        });
      })
  }

  private getReplies(comment: CommentDto): void {
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

    this._commentsService.getAllReplies(
      comment.id,
      this.skipCount[comment.id],
      count,
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (this.loadedReplyCount[comment.id] === 0) {
          comment.children = response.items;
        } else {
          comment.children = [...comment.children, ...response.items];
        }
        this.loadedReplyCount[comment.id] += response.items.length;
      });
  }
}
