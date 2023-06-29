import { Component, OnInit, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { CourseDto, CourseType, CourseStatus, CoursesServiceProxy, CourseDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CourseWizardComponent } from '../course-wizard/course-wizard.component';
import { takeUntil, finalize } from 'rxjs/operators';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';

class PagedCourseRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchFilter: string;
  statusFilter: CourseStatus;
}

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.less']
})
export class TeachingComponent extends PagedListingComponentBase<CourseDto> implements OnInit {
  courses: CourseDto[] = [];
  isLoading = false;
  CourseType = CourseType;
  searchFilter = '';
  statusFilter: CourseStatus;
  CourseStatus = CourseStatus;

  headers: TableHeaderSortData[] = [
    { title: 'Name', sortColumn: 'name' },
    { title: 'Status', sortColumn: 'status', colspan: 2 },
  ];

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _coursesService: CoursesServiceProxy,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this.sorting = this.headers[0].sortColumn;
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
    this.searchFilter = '';
    this.statusFilter = undefined;
    this.getDataPage(1);
  }

  onDeleteClick(id: string): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: undefined,
      confirmCb: (): void => {
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
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onViewCourse(course: CourseDto) {

  }

  protected list(
    request: PagedCourseRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.userIdFilter = this.appSession.userId;
    request.searchFilter = this.searchFilter;
    request.statusFilter = this.statusFilter;

    this._coursesService
      .getAll(
        request.userIdFilter,
        request.searchFilter,
        request.statusFilter,
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
