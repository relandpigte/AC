import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { StudentCoursesServiceProxy, StudentCourseDto, StudentCourseSectionStatus, StudentCourseSectionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { StudentPortalService } from '../_services/student-portal.service';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.less']
})
export class LearnComponent extends AppComponentBase implements OnInit {
  courseId: string;
  studentCourse: StudentCourseDto = new StudentCourseDto();
  currentCourseSectionId: string;
  currentSectionIndex = 0;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _studentPortalService: StudentPortalService,
    private _studentCoursesService: StudentCoursesServiceProxy,
    private _studentCourseSectionsService: StudentCourseSectionsServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
      }
    });
  }

  ngOnInit(): void {
    this.getStudentCourse();
  }

  onNextSection(): void {
    if (this.currentSectionIndex < this.studentCourse.studentCourseSections.length - 1) {
      const studentCourseSection = this.studentCourse.studentCourseSections[this.currentSectionIndex];
      studentCourseSection.status = StudentCourseSectionStatus.Finished;

      this._studentCourseSectionsService.updateStatus(
        studentCourseSection.id,
        StudentCourseSectionStatus.Finished
      )
        .pipe(
          takeUntil(this.destroyed$),
        )
        .subscribe(() => {
          this._studentPortalService.sectionFinished = studentCourseSection.id;
        });

      this.currentSectionIndex++;
      this.updateCurrentCourseSection();
    }
  }

  private getStudentCourse(): void {
    this._studentCoursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(studentCourse => {
        this.studentCourse = studentCourse;
        this.currentSectionIndex = this.studentCourse.studentCourseSections
          .findIndex(e => e.status !== StudentCourseSectionStatus.Finished);
        this.updateCurrentCourseSection();
      });
  }

  private updateCurrentCourseSection(): void {
    this.currentCourseSectionId = this.studentCourse.studentCourseSections[this.currentSectionIndex].courseSectionId;
    this.studentCourse.studentCourseSections[this.currentSectionIndex].status = StudentCourseSectionStatus.InProgress;
  }
}
