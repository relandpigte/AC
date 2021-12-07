import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CoursesServiceProxy, CourseDto, StudentCourseDto, StudentCoursesServiceProxy, StudentCourseDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';

class PagedCourseRequestDto extends PagedAndSortedRequestDto {
  searchFilter: string;
  courseIdFilter: string;
  minimumProgressFilter: number;
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.less'],
  animations: [appModuleAnimation()],
})
export class StudentsComponent extends PagedListingComponentBase<StudentCourseDto> implements OnInit {
  courseId: string;
  studentCourses: StudentCourseDto[] = [];

  headers: TableHeaderSortData[] = [
    { title: 'Name', sortColumn: 'creatorUser.name', colspan: 3 },
  ];

  model = new CourseDto();
  searchFilter = '';
  minimumProgressFilter: number;
  isLoading = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _coursesService: CoursesServiceProxy,
    private _studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this.pageSize = 5;
    this.sorting = this.headers[0].sortColumn;
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('course-id')) {
        this.courseId = paramMap.get('course-id');
        this.getCourse();
      }
    });
  }

  protected list(
    request: PagedCourseRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.courseIdFilter = this.courseId;
    request.minimumProgressFilter = this.minimumProgressFilter;
    request.searchFilter = this.searchFilter;

    if (request.sort.includes('creatorUser.name')) {
      if (request.sort.includes('desc')) {
        request.sort = `${request.sort}, creatorUser.surname desc`;
      } else {
        request.sort = `${request.sort}, creatorUser.surname`;
      }
    }

    this._studentCoursesService
      .getAllStudents(
        request.searchFilter,
        request.courseIdFilter,
        request.minimumProgressFilter,
        request.sort,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: StudentCourseDtoPagedResultDto) => {
        this.studentCourses = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private getCourse(): void {
    this.isLoading = true;
    this._coursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.model = response;
      });
  }
}
