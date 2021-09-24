import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { CoursesServiceProxy, FileParameter, CourseDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseService } from '@app/courses/_services/course.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  course = new CourseDto();
  isLoading = false;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  courseImage: FileParameter;
  defaultFile: DefaultFile;

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._courseService.course$
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this.course = course;
        if (course.imageDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = course.imageDocument.originalFileName;
          this.defaultFile.url = course.courseImageUrl;
          this.defaultFile.size = course.imageDocument.size;
          this.documentUploader.defaultFile = this.defaultFile;
        }
      });

    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.courseImage = files[0];
      } else {
        this.courseImage = undefined;
      }
    });
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._coursesService.updateDetails(
      this.course.name,
      this.course.subtitle,
      this.course.description,
      this.courseImage,
      this.course.id,
    )
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(course => {
        this._courseService.course = course;
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }
}
