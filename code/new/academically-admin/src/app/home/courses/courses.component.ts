import { Component, OnInit, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { CourseDto, CoursesServiceProxy, CourseDtoPagedResultDto, CourseStatus } from '@shared/service-proxies/service-proxies';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from '@app/dashboard/courses/course-wizard/course-wizard.component';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less']
})
export class CoursesComponent extends PagedListingComponentBase<CourseDto> implements OnInit {
  courses: CourseDto[] = [];
  isLoading = false;
  CourseStatus = CourseStatus;

  headers: TableHeaderSortData[] = [
    { title: 'Name', sortColumn: 'name' },
    { title: 'Status', sortColumn: 'status', colspan: 2 },
  ];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
    this.sorting = 'creationTime desc';
  }

  onCreateClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CourseWizardComponent>;
    const modal = this._modalService.show(CourseWizardComponent, modalSettings).content;
    modal.courseSaved.subscribe(() => {
      this.refresh();
    });
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  onClearFiltersClick(): void {
    this.getDataPage(1);
  }

  onDeleteClick(id: string): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this._coursesService.delete(id)
            .pipe(
              takeUntil(this.destroyed$),
              finalize(() => {
                this.isLoading = false;
              }),
            )
            .subscribe(() => {
              this.notify.success('SuccessfullyDeleted');
              this.getDataPage(1);
            });
        }
      }
    );
  }

  protected list(
    request: PagedAndSortedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._coursesService
      .getAll(
        undefined,
        undefined,
        undefined,
        request.sort,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: CourseDtoPagedResultDto) => {
        this.courses = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
