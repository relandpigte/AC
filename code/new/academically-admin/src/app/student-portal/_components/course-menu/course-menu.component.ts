import { Component, OnInit, Injector } from '@angular/core';
import { StudentCourseSectionDto, StudentCoursesServiceProxy, StudentCourseSectionStatus } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { StudentPortalService } from '@app/student-portal/_services/student-portal.service';

@Component({
  selector: 'app-course-menu',
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.less']
})
export class CourseMenuComponent extends AppComponentBase implements OnInit {
  courseId: string;
  studentCourseSections: StudentCourseSectionDto[] = [];
  StudentCourseSectionStatus = StudentCourseSectionStatus;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _studentPortalService: StudentPortalService,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
      }
    });
    this._studentPortalService.sectionFinished$.subscribe(id => {
      if (id && this.studentCourseSections.length) {
        this.studentCourseSections.find(e => e.id === id).status = StudentCourseSectionStatus.Finished;
      }
    });
  }

  ngOnInit(): void {
    this.getStudentCourseSections();
  }

  getLessonImageUrl(lessonImageUrl: string): string {
    if (lessonImageUrl) {
      return lessonImageUrl;
    }
    return '/assets/themes/dashkit/img/avatars/projects/project-1.jpg';
  }

  private getStudentCourseSections(): void {
    this._studentCoursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.studentCourseSections = response.studentCourseSections;
      });
  }
}
