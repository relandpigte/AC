import { Component, OnInit, Injector } from '@angular/core';
import { ForumsServiceProxy, ForumDto, CreateForumReplyDto, ReactionDto, ReactionsServiceProxy, ReactionType, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { appModuleAnimation } from '@shared/animations/routerTransition';

class PagedEventRequestDto extends PagedAndSortedRequestDto {
}

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.less'],
  animations: [appModuleAnimation()],
})
export class ForumsComponent extends PagedListingComponentBase<ForumDto> implements OnInit {
  forums: ForumDto[] = [];
  replies: CreateForumReplyDto[] = [];
  reactions: ReactionDto[][] = [];
  greetings: string;
  user: UserLoginInfoDto = new UserLoginInfoDto();
  ReactionType = ReactionType;

  constructor(
    injector: Injector,
    private _forumsService: ForumsServiceProxy,
    private _reactionsService: ReactionsServiceProxy,
  ) {
    super(injector);
    this.user = this.appSession.user;
  }

  ngOnInit(): void {
    this.greetings = this.getGreetings();
  }

  getGreetings(): string {
    const title = 'Questions and Answers';
    return title;
  }

  onDeleteClick(forum: ForumDto): void {
    this.message.confirm(
      this.l('DeleteFormConfirmationMessage'),
      undefined,
      result => {
        if (result) {
          this._forumsService.delete(forum.id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
              this.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            });
        }
      }
    );
  }

  onFormSubmit(forum: ForumDto): void {
    this.replies[forum.id].forumId = forum.id;
    this._forumsService.createReply(this.replies[forum.id])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(reply => {
        this.notify.success('SuccessfullySubmitted');
        forum.forumReplies.push(reply);
        this.replies[forum.id] = new CreateForumReplyDto();
      });
  }

  onReactClick(forum: ForumDto, type: ReactionType): void {
    this._reactionsService.save(forum.id, type)
      .subscribe(() => {
        this.getReactions(forum);
      });
  }

  getReactionCount(forum: ForumDto, type: ReactionType): number {
    if (this.reactions[forum.id]) {
      return this.reactions[forum.id].filter(e => e.type === type).length;
    }

    return 0;
  }

  hasReacted(forum: ForumDto, type: ReactionType): boolean {
    return this.reactions[forum.id]
      .filter(e => e.type === type && e.creatorUserId === this.appSession.userId).length > 0;
  }

  protected list(
    request: PagedEventRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.maxResultCount = 100;

    this._forumsService
      .getAll(
        request.skipCount,
        request.maxResultCount,
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        _.each(result.items, forum => {
          this.replies[forum.id] = new CreateForumReplyDto();
          this.getReactions(forum);
        });
        this.forums = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private getReactions(forum: ForumDto): void {
    this._reactionsService.getAll(forum.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.reactions[forum.id] = responses;
      });
  }
}
