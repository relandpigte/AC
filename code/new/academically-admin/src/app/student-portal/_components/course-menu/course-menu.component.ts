import { Component, OnInit, Injector } from '@angular/core';
import { StudentCourseSectionDto, StudentCourseSectionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-menu',
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.less']
})
export class CourseMenuComponent extends AppComponentBase implements OnInit {
  courseId: string;
  studentCourseSections: StudentCourseSectionDto[] = [];

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _studentCourseSectionsService: StudentCourseSectionsServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.paramMap.subscribe(paramMap => {
      console.log(paramMap.has('course-id'));
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
      }
    });
  }

  ngOnInit(): void {
    this.getStudentCourseSections();
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  private getStudentCourseSections(): void {
    this._studentCourseSectionsService.getAll(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(responses => {
        this.studentCourseSections = responses;
      });
  }
}
