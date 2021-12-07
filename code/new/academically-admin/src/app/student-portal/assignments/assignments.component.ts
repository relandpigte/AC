import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CoursesServiceProxy,
  CourseDto,
  CourseAssignmentDto,
  CourseAssignmentsServiceProxy,
  CourseAssignmentDtoPagedResultDto,
  DocumentsServiceProxy,
  DocumentDto,
  CourseSectionStatus,
} from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { CreateEditComponent } from './_components/create-edit/create-edit.component';
import * as FileSaver from 'file-saver';

class PagedAssignmentRequestDto extends PagedAndSortedRequestDto {
  searchFilter: string;
  courseIdFilter: string;
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.less'],
  animations: [appModuleAnimation()],
})
export class AssignmentsComponent extends PagedListingComponentBase<CourseAssignmentDto> implements OnInit {
  courseId: string;
  searchFilter: string;
  assignments: CourseAssignmentDto[] = [];

  course = new CourseDto();
  CourseSectionStatus = CourseSectionStatus;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _modalService: BsModalService,
    private _coursesService: CoursesServiceProxy,
    private _courseAssignmentsService: CourseAssignmentsServiceProxy,
    private _documentsService: DocumentsServiceProxy,
  ) {
    super(injector);
    this.sorting = 'creationTime desc';
    this._route.parent.parent.parent.paramMap.subscribe(paramMap => {
      this.courseId = paramMap.get('course-id');
      this.getCourse();
    });
  }

  onUploadClick(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<CreateEditComponent>;
    modalSettings.initialState = {
      courseId: this.courseId,
    };
    const modal = this._modalService.show(CreateEditComponent, modalSettings).content;
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
        FileSaver.saveAs(url, document.name);
      });
  }

  protected list(
    request: PagedAssignmentRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.courseIdFilter = this.courseId;
    request.searchFilter = this.searchFilter;

    this._courseAssignmentsService
      .getAll(
        request.searchFilter,
        request.courseIdFilter,
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

  private getCourse(): void {
    this._coursesService.get(this.courseId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(course => {
        this.course = course;
      });
  }
}
