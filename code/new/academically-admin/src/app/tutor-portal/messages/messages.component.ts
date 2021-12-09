import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { CoursesServiceProxy, CourseDto, CourseConversationsServiceProxy, GetStudentsCourseConversationDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less'],
  animations: [appModuleAnimation()],
})
export class MessagesComponent extends AppComponentBase implements OnInit {
  courseId: string;
  students: GetStudentsCourseConversationDto[] = [];
  selectedStudent: GetStudentsCourseConversationDto;

  model = new CourseDto();

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
    private _courseConversationsService: CourseConversationsServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
        this.getStudentCourse();
      }
    });
  }

  ngOnInit(): void {
  }

  onStudentClick(student: GetStudentsCourseConversationDto): void {
    this.selectedStudent = student;
  }

  private getStudentCourse(): void {
    this._coursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.model = response;
        this.getStudents();
      });
  }

  private getStudents(): void {
    this._courseConversationsService.getStudents(this.courseId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.students = responses;
        if (this.students && this.students.length) {
          this.selectedStudent = this.students[0];
        }
      });
  }
}
