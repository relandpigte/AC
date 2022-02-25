import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { StudentCoursesServiceProxy, StudentCourseDto, StudentCourseSectionStatus, StudentCourseSectionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { StudentPortalService } from '../_services/student-portal.service';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RateAndReviewCourseComponent } from '../_components/rate-and-review-course/rate-and-review-course.component';

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
  percentage = 0;
  hasBeenProgressed = false;
  isWriteReviewShown = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _modalService: BsModalService,
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
    this._studentPortalService.percentage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(percentage => {
        this.percentage = percentage;
        if (this.hasBeenProgressed && !this.isWriteReviewShown && percentage >= 100) {
          this.showReviewModal();
        }
      });
  }

  ngOnInit(): void {
    this.getStudentCourse();
  }

  onNextSection(): void {
    this.hasBeenProgressed = true;
    if (this.currentSectionIndex <= this.studentCourse.studentCourseSections.length - 1) {
      const studentCourseSection = this.studentCourse.studentCourseSections[this.currentSectionIndex];
      if (studentCourseSection) {
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
  }

  onReviewClick(): void {
    this.showReviewModal();
  }

  private getStudentCourse(): void {
    this._studentCoursesService.getByCourse(this.courseId)
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
    const studentCourseSection = this.studentCourse.studentCourseSections[this.currentSectionIndex];
    if (studentCourseSection) {
      this.currentCourseSectionId = studentCourseSection.courseSectionId;

      this._studentCourseSectionsService.updateStatus(
        studentCourseSection.id,
        StudentCourseSectionStatus.InProgress
      )
        .pipe(
          takeUntil(this.destroyed$),
        )
        .subscribe(() => {
          studentCourseSection.status = StudentCourseSectionStatus.InProgress;
        });
    }
  }

  private showReviewModal(): void {
    this.isWriteReviewShown = true;
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      course: this.studentCourse.course,
    };
    this._modalService.show(RateAndReviewCourseComponent, modalSettings);
  }
}
