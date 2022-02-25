import { Component, OnInit, Injector, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StudentCourseSectionDto, StudentCourseSectionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';

class PagedStudentCourseSectionDto extends PagedAndSortedRequestDto {
  courseSectionIdFilter: string;
}

@Component({
  selector: 'app-section-students-full',
  templateUrl: './section-students-full.component.html',
  styleUrls: ['./section-students-full.component.less']
})
export class SectionStudentsFullComponent extends PagedListingComponentBase<StudentCourseSectionDto> implements OnInit {
  @Input() courseSectionId: string;
  models: StudentCourseSectionDto[] = [];

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _studentCourseSectionsService: StudentCourseSectionsServiceProxy,
  ) {
    super(injector);
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  protected list(
    request: PagedStudentCourseSectionDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.courseSectionIdFilter = this.courseSectionId;

    this._studentCourseSectionsService
      .getAllInProgress(
        request.courseSectionIdFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe(result => {
        this.models = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
