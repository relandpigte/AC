import { Component, OnInit, Injector } from '@angular/core';
import { MenuComponentBase } from '@app/student-portal/_models/menu-component-base';
import { StudentCourseSectionDto, StudentCourseSectionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-course-menu',
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.less']
})
export class CourseMenuComponent extends MenuComponentBase implements OnInit {
  studentCourseSections: StudentCourseSectionDto[] = [];

  constructor(
    injector: Injector,
    private _studentCourseSectionsService: StudentCourseSectionsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCoure();
    this.getStudentCourseSections();
  }

  private getStudentCourseSections(): void {
    this._studentCourseSectionsService.getAll(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(responses => {
        console.log(responses);
        this.studentCourseSections = responses;
      });
  }
}
