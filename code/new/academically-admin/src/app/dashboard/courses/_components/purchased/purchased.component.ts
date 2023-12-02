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
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';


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
    private _modalDialogService: ModalDialogService,
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

  onReview(data: any): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<LeaveReviewComponent>;
    modalSettings.class = 'modal-sm modal-dialog-centered modal-service-rating';
    modalSettings.initialState = { data };
    const modal = this._modalService.show(LeaveReviewComponent, modalSettings);

    modal.content.onCloseModal.subscribe((): void => {
      this._modalService.hide();
    });

    modal.content.onReviewSuccess.subscribe((): void => {
      setTimeout((): void => {
        const modalConfirmationSettings = this.defaultModalSettings as ModalOptions<LeaveReviewConfirmationComponent>;
        modalConfirmationSettings.class = 'modal-sm modal-rating-success modal-dialog-centered';
        modalConfirmationSettings.initialState = {
          reviewURL: `app/course/${data.id}/reviews`,
          title: this.l('ReviewSubmitted'),
          subTitle: this.l('ThankYouForReviewing')
        };
        this._modalService.show(LeaveReviewConfirmationComponent, modalSettings);
      }, 200);
    });
  }

  handleRedirectToCourse(courseId: string): void {
    const url = `${AppConsts.appBaseUrl}/app/student-portal/${courseId}/home`;
    window.open(url, '_blank');
  }

  onRearrangeSessionClick(course: CourseDto): void {
  }

  onCancelSessionClick(course: CourseDto): void {
    const options: ModalDialogOptions = {
      title: this.l('Bookings.Cancellation.Confirm.Title'),
      text: this.l('Bookings.Cancellation.Confirm.Subtitle'),
      confirmCb: (): void => {
        const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
        modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
        modalSettings.initialState = { data: course, isCancellation: true };
        const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

        purchaseModal.content.onPaid.subscribe((): void => this.initCourses());
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onRepurchaseClick(course: CourseDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<BookingServiceComponent>;
    modalSettings.class = 'modal-lg modal-dialog-centered modal-dialog-booking';
    modalSettings.initialState = { data: course };
    const purchaseModal = this._modalService.show(BookingServiceComponent, modalSettings);

    purchaseModal.content.onPaid.subscribe((): void => this.initCourses());
  }

  async onRedirection(course: CourseDto): Promise<void> {
    this._router.navigate(['app/course' , course.id, 'about']);
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
}
