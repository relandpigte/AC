import { Component, OnInit, ViewChild, Injector, AfterViewInit } from '@angular/core';
import { CourseDto, CourseSectionType, FileParameter, CourseSectionDto, CourseSectionPageDto } from '@shared/service-proxies/service-proxies';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { PageBuilderService } from './../../_services/page-builder.service';
import { takeUntil, finalize } from 'rxjs/operators';

export enum EnabledControl {
  isName,
  isDescription,
  isCategoriesTags,
  isCourseSectionPageImage,
  isDuration
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})

export class DetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: false }) documentUploader: DocumentUploaderComponent;

  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  isLoading: false
  isNameDisabled = true
  isDescriptionDisabled = true
  isCategoriesTagsDisabled = true
  isCourseSectionPageImageDisabled = true
  isDurationDisabled = true
  model = new CourseSectionDto();
  courseSectionPageModel = new CourseSectionPageDto();
  CourseSectionType = CourseSectionType
  EnabledControl = EnabledControl
  courseSectionImage: FileParameter;
  defaultFile: DefaultFile;
  categoryTags: string[];

  constructor(
    injector: Injector,
    private _pageBuilderService: PageBuilderService,

  ) {
    super(injector);
    this.model.course = new CourseDto();

  }

  ngOnInit(): void {
    this._pageBuilderService.courseSection$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(courseSection => {
        this.model = courseSection;
        this.initializeDocumentUploader();
      });
    this._pageBuilderService.courseSectionPage$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(courseSectionPage => {
        this.courseSectionPageModel = courseSectionPage;
        this.initializeDocumentUploader()
        if (courseSectionPage.imageDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = courseSectionPage.imageDocument.originalFileName;
          this.defaultFile.url = courseSectionPage.courseSectionPageImageUrl;
          this.defaultFile.size = courseSectionPage.imageDocument.size;
          if (this.model.type === CourseSectionType.Lesson) {
            this.documentUploader.defaultFile = this.defaultFile;
          }
        }
        if (this.courseSectionPageModel.categoriesTags) {
          this.categoryTags = JSON.parse(this.courseSectionPageModel.categoriesTags)
        }
      });
  }

  onEnableEditable(propName): void {
    switch (propName) {
      case EnabledControl.isName:
        this.isNameDisabled = false
        break
      case EnabledControl.isDescription:
        this.isDescriptionDisabled = false
        break
      case EnabledControl.isCategoriesTags:
        this.isCategoriesTagsDisabled = false
        break
      case EnabledControl.isCourseSectionPageImage:
        this.isCourseSectionPageImageDisabled = false
        break
      case EnabledControl.isDuration:
        this.isDurationDisabled = false
        break

    }
  }

  public prepareContentsForSaving(): CourseSectionDto {
    return this.model
  }

  public prepareContentsForCoursePage(): CourseSectionPageDto {
    this.courseSectionPageModel.categoriesTags = JSON.stringify(this.categoryTags);
    return this.courseSectionPageModel
  }
  public prepareContentsForImage(): FileParameter {
    return this.courseSectionImage
  }

  private initializeDocumentUploader(): void {
    setTimeout(() => {
      if (this.courseSectionPageModel.imageDocument) {
        this.defaultFile = new DefaultFile();
        this.defaultFile.name = this.courseSectionPageModel.imageDocument.originalFileName;
        this.defaultFile.url = this.courseSectionPageModel.courseSectionPageImageUrl;
        this.defaultFile.size = this.courseSectionPageModel.imageDocument.size;
        if (this.model.type === CourseSectionType.Lesson) {
          this.documentUploader.defaultFile = this.defaultFile;
        }
      }
      this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
        if (files && files.length) {
          this.courseSectionImage = files[0];
        } else {
          this.courseSectionImage = undefined;
        }
      });
      this.documentUploader.defaultFileRemoved.subscribe(() => {
        this.defaultFile = undefined;
      });

    });
  }

}
