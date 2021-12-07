import { Component, OnInit, Injector, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CourseAssignmentDto,
  StudentCourseSectionsServiceProxy,
  StudentCourseSectionDto,
  CourseAssignmentsServiceProxy,
  FileParameter,
} from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.less']
})
export class CreateEditComponent extends AppComponentBase implements OnInit {
  @Input() courseId: string;
  @Output() modalSaved = new EventEmitter();
  @ViewChild('documentUploader') documentUploaderComponent: DocumentUploaderComponent;
  studentCourseSections: StudentCourseSectionDto[] = [];

  model = new CourseAssignmentDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _studentCourseSectionsService: StudentCourseSectionsServiceProxy,
    private _courseAssignmentsService: CourseAssignmentsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCourseSections();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    const documentsToUpload = this.documentUploaderComponent.files.map(file => {
      const fileParameter: FileParameter = {
        fileName: file.name,
        data: file,
      };
      return fileParameter;
    });
    this._courseAssignmentsService.create(this.model.studentCourseSectionId, documentsToUpload)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.modalSaved.emit();
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  private getCourseSections(): void {
    this._studentCourseSectionsService.getAssignmentsAllowed(this.courseId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(responses => {
        this.studentCourseSections = responses;
      });
  }
}
