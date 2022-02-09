import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { FileParameter, CourseSectionDto, SpokenLanguageDto, PricingType, SpokenLanguagesServiceProxy, CourseSectionsServiceProxy } from '@shared/service-proxies/service-proxies';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { Router } from '@angular/router';
import { CourseSectionService } from '@app/courses/course-sections/_services/course-section.service';
import { takeUntil, finalize } from 'rxjs/operators';

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
  model: CourseSectionDto = new CourseSectionDto();
  isLoading = false;

  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  languages: SpokenLanguageDto[] = [];
  PricingType = PricingType;
  defaultFile: DefaultFile;
  editField: EditField;
  EditField = EditField;
  category: string;
  categories: string[] = [];

  constructor(
    injector: Injector,
    private _router: Router,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
    private _courseSectionsService: CourseSectionsServiceProxy,
    private _courseSectionService: CourseSectionService
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
        this.model = courseSection;
        if (this.model.imageDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = this.model.imageDocument.originalFileName;
          this.defaultFile.url = this.model.imageDocumentUrl;
          this.defaultFile.size = this.model.imageDocument.size;
          this.documentUploader.defaultFile = this.defaultFile;
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

    this._courseSectionsService.updateDetails(
      this.model.name,
      this.model.description,
      this.model.categories,
      this.model.approximateLessonDuration,
      this.courseSectionImageDocument,
      this.model.id,
    ).pipe(
      takeUntil(this.destroyed$),
      finalize(() => {
        this.isLoading = false;
      })
    )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        setTimeout(() => {
          this.editField = undefined;
        });
      });
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

}
