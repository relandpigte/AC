import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CoursesServiceProxy, StudentCoursesServiceProxy, StudentCourseSectionDto, StudentCourseSectionStatus } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RateAndReviewCourseComponent } from '../rate-and-review-course/rate-and-review-course.component';
import { StudentPortalService } from '@app/student-portal/_services/student-portal.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  animations: [appModuleAnimation()],
})
export class LayoutComponent extends AppComponentBase implements OnInit {
  courseId: string;
  model: CourseDto = new CourseDto();
  percentage: number;
  studentCourseSections: StudentCourseSectionDto[] = [];

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _modalService: BsModalService,
    private _studentPortalService: StudentPortalService,
    private _coursesService: CoursesServiceProxy,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
        this.getStudentCourseSections();
      }
    });
    this._studentPortalService.percentage$.subscribe(percentage => {
      this.percentage = percentage;
    });
    this._studentPortalService.sectionFinished$.subscribe(id => {
      if (id && this.studentCourseSections.length) {
        this.studentCourseSections.find(e => e.id === id).status = StudentCourseSectionStatus.Finished;
        this.updatePercentage();
      }
    });
  }

  ngOnInit(): void {
    this.getCoure();
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  onReviewClick(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      course: this.model,
    };
    this._modalService.show(RateAndReviewCourseComponent, modalSettings);
  }

  protected getCoure(): void {
    this._coursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.model = response;
      });
  }

  private getStudentCourseSections(): void {
    this._studentCoursesService.getByCourse(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.studentCourseSections = response.studentCourseSections;
        this.updatePercentage();
      });
  }

  private updatePercentage(): void {
    let percentage = 0;
    const finishedCount = this.studentCourseSections.filter(e => e.status === StudentCourseSectionStatus.Finished).length;
    if (finishedCount > 0) {
      const totalCount = this.studentCourseSections.length;
      percentage = Math.round((finishedCount / totalCount) * 100);
    }
    this._studentPortalService.percentage = percentage;
  }
}
