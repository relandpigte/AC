import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/articles/_services/article.service';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, SpokenLanguageDto, ArticleDto, PricingType, ArticlesServiceProxy, SpokenLanguagesServiceProxy, ArticleType } from '@shared/service-proxies/service-proxies';
import { takeUntil, finalize } from 'rxjs/operators';


enum EditField {
  Name = 1,
  Subtitle = 2,
  Categories = 3,
  Image = 4,
  Language = 5,
  Pricing = 6,
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
  articleThumbnailDocument: FileParameter;
  defaultFile: DefaultFile;
  languages: SpokenLanguageDto[] = [];

  model = new ArticleDto();
  isLoading = false;
  EditField = EditField;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;
  ArticleType = ArticleType;

  constructor(
    injector: Injector,
    private _articleService: ArticleService,
    private _articlesService: ArticlesServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.getLanguages();

    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.model = article;
        if (this.model.thumbnailDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = this.model.thumbnailDocument.originalFileName;
          this.defaultFile.url = this.model.thumbnailDocumentUrl;
          this.defaultFile.size = this.model.thumbnailDocument.size;
          this.documentUploader.defaultFile = this.defaultFile;
        }
        if (this.model.categories && this.model.categories.trim()) {
          this.categories = this.model.categories.split(',');
        }
      }
    });

    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.articleThumbnailDocument = files[0];
      } else {
        this.articleThumbnailDocument = undefined;
      }
    });
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.categories = this.categories.join(',');

    this._articlesService.updateDetails(
      this.model.name,
      this.model.description,
      this.model.categories,
      this.model.languageId,
      this.model.pricingType,
      this.articleThumbnailDocument,
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
