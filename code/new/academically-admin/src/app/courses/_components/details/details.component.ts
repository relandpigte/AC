import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, FileParameter, SpokenLanguageDto, SpokenLanguagesServiceProxy, PricingType, CoursesServiceProxy } from '@shared/service-proxies/service-proxies';
import { CourseService } from '@app/courses/_services/course.service';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { takeUntil, finalize } from 'rxjs/operators';


enum EditField {
  Name = 1,
  Subtitle = 2,
  Description = 3,
  Categories = 4,
  Image = 5,
  Language = 6,
  Pricing = 7,
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  editField: EditField;
  category: string;
  categories: string[] = [];
  courseImageDocument: FileParameter;
  defaultFile: DefaultFile;
  languages: SpokenLanguageDto[] = [];

  model = new CourseDto();
  isLoading = false;
  EditField = EditField;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
  ) {
    super(injector);
    this._courseService.course$.subscribe(course => {
      if (course) {
        this.model = course;
        if (this.model.imageDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = this.model.imageDocument.originalFileName;
          this.defaultFile.url = this.model.courseImageUrl;
          this.defaultFile.size = this.model.imageDocument.size;
          this.documentUploader.defaultFile = this.defaultFile;
        }
        if (this.model.categories && this.model.categories.trim()) {
          this.categories = this.model.categories.split(',');
        }
      }
    });
  }
  ngOnInit(): void {
    this.getLanguages();

    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.courseImageDocument = files[0];
      } else {
        this.courseImageDocument = undefined;
      }
    });
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.categories = this.categories.join(',');

    this._coursesService.updateDetails(
      this.model.name,
      this.model.subtitle,
      this.model.description,
      this.model.categories,
      this.model.languageId,
      this.model.pricingType,
      this.courseImageDocument,
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

  onPricingClick(pricingState: PricingType): void {
    if (this.model.pricingType === PricingType.Free) {
      this.model.price = 0;
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
