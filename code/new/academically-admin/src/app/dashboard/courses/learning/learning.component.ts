import { Component, OnInit, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { StudentCoursesServiceProxy, StudentCourseDtoPagedResultDto, StudentCourseDto } from '@shared/service-proxies/service-proxies';
import { TableHeaderSortData } from '@shared/components/table-header-sort/table-header-sort.component';
import { finalize } from 'rxjs/operators';

class PagedCourseRequestDto extends PagedAndSortedRequestDto {
  searchFilter: string;
}

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.less']
})
export class LearningComponent extends PagedListingComponentBase<StudentCourseDto> implements OnInit {
  studentCourses: StudentCourseDto[] = [];
  isLoading = false;
  searchFilter = '';

  headers: TableHeaderSortData[] = [
    { title: 'Name', sortColumn: 'course.name', colspan: 2 },
  ];

  constructor(
    injector: Injector,
    private studentCoursesService: StudentCoursesServiceProxy,
  ) {
    super(injector);
    this.sorting = this.headers[0].sortColumn;
  }

  getCourseImageUrl(courseImageUrl: string): string {
    if (courseImageUrl) {
      return courseImageUrl;
    }
    return 'assets/themes/dashkit/img/covers/profile-cover-1.jpg';
  }

  onClearFiltersClick(): void {
    this.searchFilter = '';
    this.getDataPage(1);
  }

  protected list(
    request: PagedCourseRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.searchFilter = this.searchFilter;

    this.studentCoursesService
      .getAll(
        request.searchFilter,
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
}
