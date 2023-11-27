import { Component, Injector, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';

import { CourseDto, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ShimmerType } from '@shared/enums/shimmer/shimmer-type.enum';
import { DashboardPagesService } from '@shared/services/dashboard-pages.service';
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';


@Component({
  selector: 'app-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.less']
})
export class PurchasedComponent extends AppComponentBase implements OnInit {
  allCourses: CourseDto[] = [];
  todoCourses: CourseDto[] = [];
  completedCourses: CourseDto[] = [];
  shimmerType = ShimmerType;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _dashboardPageService: DashboardPagesService,
    private _coursesService: CoursesServiceProxy
  ) {
    super(injector);
  }

  get isLoading$() { return this._dashboardPageService.isLoading$; }
  get totalCourses(): number { return this.allCourses?.length; }
  get totalTodoCourses(): number { return this.todoCourses?.length; }
  get totalCompletedCourses(): number { return this.completedCourses?.length; }

  ngOnInit(): void {
    this.initCourses();
  }

  handleRedirectToCourse(courseId: string): void {
    const url = `${AppConsts.appBaseUrl}/app/student-portal/${courseId}/home`;
    window.open(url, '_blank');
  }

  private initCourses(): void {
    this._dashboardPageService.isLoading$.next(true);
    this._coursesService.getEnrolledCoursesByUser()
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize((): void => {
        this._dashboardPageService.isLoading$.next(false);
      }))
      .subscribe((courses: CourseDto[]): void => {
        this.allCourses = courses;
        this.todoCourses = courses.filter(c => c.progress < 100);
        this.completedCourses = courses.filter(c => c.progress === 100);
      });
  }

  onPurchaseClick(course: CourseDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = { data: course };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => this.initCourses());
  }

  async onRedirection(course: CourseDto): Promise<void> {
    this._router.navigate(['app/course' , course.id, 'about']);
  }
}
