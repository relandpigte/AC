import { Component, OnInit, Injector } from '@angular/core';
import {
  StudentCourseDto,
  StudentCoursesServiceProxy,
  UserDto,
  CourseAssignmentDto,
  CourseAssignmentsServiceProxy,
  CourseAssignmentDtoPagedResultDto,
  DocumentDto,
  DocumentsServiceProxy,
  StudentCourseSectionDto,
  StudentCourseSectionsServiceProxy,
  CourseSectionType,
} from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize, filter } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import * as FileSaver from 'file-saver';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';

class PagedAssignmentRequestDto extends PagedAndSortedRequestDto {
  studentCourseIdFilter: string;
  searchFilter: string;
  courseSectionIdFilter: string;
  creationTimeFilter: Moment;
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.less'],
  animations: [appModuleAnimation()],
})
export class AssignmentsComponent extends PagedListingComponentBase<CourseAssignmentDto> implements OnInit {
  id: string;
  searchFilter: string;
  courseSectionIdFilter: string;
  creationTimeFilter: Date;
  assignments: CourseAssignmentDto[] = [];
  studentCourseSections: StudentCourseSectionDto[] = [];
  datePickerConfig: BsDatepickerConfig;

  model = new StudentCourseDto();
  CourseSectionType = CourseSectionType;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _studentCoursesService: StudentCoursesServiceProxy,
    private _courseAssignmentsService: CourseAssignmentsServiceProxy,
    private _documentsService: DocumentsServiceProxy,
    private _studentCourseSectionsService: StudentCourseSectionsServiceProxy,
  ) {
    super(injector);
    this.model.creatorUser = new UserDto();
    this.sorting = 'creationTime desc';
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.getStudentCourse();
      }
    });
  }

  get minimumProgressFilter(): number {
    let filterCount = 0;
    if (this.courseSectionIdFilter) {
      filterCount++;
    }
    if (this.creationTimeFilter) {
      filterCount++;
    }
    return filterCount;
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i].toLowerCase();
  }

  getFilename(fileName: string): string {
    const parts = fileName.split('.');
    parts.pop();
    return parts.join('.');
  }

  getExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.pop();
  }

  onDownloadClick(document: DocumentDto): void {
    this._documentsService.getSecuredUrl(document.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(url => {
        FileSaver.saveAs(url, document.originalFileName);
      });
  }

  onClearFiltersClick(): void {
    this.searchFilter = '';
    this.courseSectionIdFilter = undefined;
    this.creationTimeFilter = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedAssignmentRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.studentCourseIdFilter = this.id;
    request.searchFilter = this.searchFilter;
    request.courseSectionIdFilter = this.courseSectionIdFilter;
    if (this.creationTimeFilter) {
      request.creationTimeFilter = moment(this.creationTimeFilter);
    }

    this._courseAssignmentsService
      .getAll(
        request.studentCourseIdFilter,
        request.searchFilter,
        request.courseSectionIdFilter,
        request.creationTimeFilter,
        request.sort,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: CourseAssignmentDtoPagedResultDto) => {
        this.assignments = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private getStudentCourse(): void {
    this._studentCoursesService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        this.model = response;
        this.getCourseSections();
      });
  }

  private getCourseSections(): void {
    this._studentCourseSectionsService.getAssignmentsAllowed(this.model.courseId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.studentCourseSections = responses;
      });
  }
}
