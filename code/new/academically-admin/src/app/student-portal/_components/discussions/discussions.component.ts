import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CourseConversationsServiceProxy,
  CourseConversationDto,
  StudentCoursesServiceProxy,
  UserLoginInfoDto,
  ConversationReactionType,
  CourseConversationReactionDto,
} from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.less']
})
export class DiscussionsComponent extends AppComponentBase implements OnInit {
  @Input() isInCourse = true;
  @Input() isInTutorPortal = false;
  courseId: string;
  conversations: CourseConversationDto[] = [];
  isPosting = false;
  ReactionType = ConversationReactionType;
  inputLength = 0;

  _studentCourseId: string;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _courseConversationsService: CourseConversationsServiceProxy,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
      }
    });
  }
  @Input() set studentCourseId(value: string) {
    this._studentCourseId = value;
    this.getConversations();
  }

  ngOnInit(): void {
    if (!this.isInTutorPortal) {
      this.getStudentCourseByCourse();
    }
  }

  onFormSubmit(message: any, parentId?: string): void {
    this.isPosting = true;
    const model = new CourseConversationDto();
    model.studentCourseId = this._studentCourseId;
    model.parentId = parentId;
    model.message = message.value;
    if (model.message && model.message.trim()) {
      this._courseConversationsService.create(model)
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
    return conversationReactions.filter(e => e.creatorUserId === this.appSession.userId).length > 0;
  }

  isMyReaction(conversationReactions: CourseConversationReactionDto[], type: ConversationReactionType): boolean {
    return conversationReactions.filter(e => e.creatorUserId === this.appSession.userId && e.type === type).length > 0;
  }

  getReactionCount(conversationReactions: CourseConversationReactionDto[], type: ConversationReactionType): number {
    return conversationReactions.filter(e => e.type === type).length;
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

  private getStudentCourseByCourse(): void {
    this._studentCoursesService.getByCourse(this.courseId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(studentCourse => {
        this._studentCourseId = studentCourse.id;
        this.getConversations();
      });
  }

  private getStudentCourse(): void {
    this._studentCoursesService.get(this._studentCourseId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this.getConversations();
      });
  }

  private getConversations(): void {
    this._courseConversationsService.getAll(this._studentCourseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(conversations => {
        this.conversations = conversations;
      });
  }
}
