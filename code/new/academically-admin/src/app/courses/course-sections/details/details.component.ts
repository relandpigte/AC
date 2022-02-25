import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import {
  FileParameter,
  CourseSectionDto,
  SpokenLanguageDto,
  PricingType,
  SpokenLanguagesServiceProxy,
  CourseSectionsServiceProxy,
  DocumentType,
  DocumentDto,
  UpdateCourseSectionDetailsDto,
} from '@shared/service-proxies/service-proxies';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { Router } from '@angular/router';
import { CourseSectionService } from '@app/courses/course-sections/_services/course-section.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { UploadService } from '@app/_shared/services/upload.service';

enum EditField {
  Name = 1,
  Subtitle = 2,
  Categories = 3,
  Image = 4,
  Duration = 5,
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  courseSectionImageDocument: FileParameter;
  model = new UpdateCourseSectionDetailsDto();
  isLoading = false;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  languages: SpokenLanguageDto[] = [];
  defaultFile: DefaultFile;
  editField: EditField;
  category: string;
  categories: string[] = [];
  imageDocument = new DocumentDto();

  PricingType = PricingType;
  EditField = EditField;

  constructor(
    injector: Injector,
    private _router: Router,
    private _uploadService: UploadService,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
    private _courseSectionsService: CourseSectionsServiceProxy,
    private _courseSectionService: CourseSectionService,
  ) {
    super(injector);
    this.getLanguages();
  }

  ngOnInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.courseSectionImageDocument = files[0];
      } else {
        this.courseSectionImageDocument = undefined;
      }
    });

    this._courseSectionService.courseSectionCreated$.subscribe(courseSection => {
      if (courseSection) {
        this.model.init(courseSection);
        if (courseSection.imageDocument) {
          this.imageDocument = courseSection.imageDocument;
          this.setDefaultFile();
        }
        if (this.model.categories && this.model.categories.trim()) {
          this.categories = this.model.categories.split(',');
        }
      }
    });
  }

  onBackClick(): void {
    this._router.navigate(['/app/courseSections/' + this.model.id + '/courseSection']);
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.categories = this.categories.join(',');
    if (this.imageDocument.id && !this.model.imageDocumentId) {
      this._uploadService.delete(this.imageDocument, this.model.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.imageDocument = new DocumentDto();
          this.uploadAndUpdateDetails();
        });
    } else {
      this.uploadAndUpdateDetails();
    }
  }

  onEditClick(editField: EditField): void {
    this.editField = editField;
  }

  onCategoryKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      const index = this.categories.findIndex(i => i.trim() === this.category.trim());
      if (index < 0) {
        this.categories.push(this.category.trim());
        this.category = undefined;
      }
    }
  }

  onRemoveCategoryClick(category: string): void {
    const index = this.categories.findIndex(e => e === category);
    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  private getLanguages(): void {
    this._spokenLanguagesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(languages => {
        this.languages = languages;
      });
  }

  private uploadAndUpdateDetails(): void {
    if (this.courseSectionImageDocument) {
      this._uploadService.upload(this.courseSectionImageDocument.data, DocumentType.CourseSectionImage, this.model.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.model.imageDocumentId = response.id;
          this.imageDocument = response;
          this.documentUploader.files = [];
          this.setDefaultFile();
          this.updateDetails();
        });
    } else {
      this.updateDetails();
    }
  }

  private updateDetails(): void {
    this._courseSectionsService.updateDetails(this.model).pipe(
      takeUntil(this.destroyed$),
      finalize(() => {
        this.isLoading = false;
      })
    )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        setTimeout(() => {
          this.editField = undefined;
          this.getCourseSection();
        });
      });
  }

  private getCourseSection(): void {
    this._courseSectionsService.get(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._courseSectionService.courseSectionCreated = response;
      });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.imageDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.imageDocument);
    this.defaultFile.size = this.imageDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }

}
