import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { FileParameter, ArticleDto, SpokenLanguageDto, PricingType, SpokenLanguagesServiceProxy, ArticlesServiceProxy } from '@shared/service-proxies/service-proxies';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { Router } from '@angular/router';
import { ArticleService } from '@app/articles/_services/article.service';
import { takeUntil, finalize } from 'rxjs/operators';

enum EditField {
  Name = 1,
  Subtitle = 2,
  Categories = 3,
  Thumbnail = 4,
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
  articleThumbnail: FileParameter;
  model: ArticleDto = new ArticleDto();
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
    private _articlesService: ArticlesServiceProxy,
    private _articleService: ArticleService
  ) {
    super(injector);
    this.getLanguages();
  }

  ngOnInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.articleThumbnail = files[0];
      } else {
        this.articleThumbnail = undefined;
      }
    });

    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.model = article;
        if (this.model.thumbnailDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = this.model.thumbnailDocument.originalFileName;
          this.defaultFile.url = this.model.thumbnailUrl;
          this.defaultFile.size = this.model.thumbnailDocument.size;
          this.documentUploader.defaultFile = this.defaultFile;
        }
        if (this.model.categories && this.model.categories.trim()) {
          this.categories = this.model.categories.split(',');
        }
      }
    });
  }

  onBackClick(): void {
    this._router.navigate(['/app/articles/' + this.model.id + '/article']);
  }

  onPricingClick(pricingState: PricingType): void {
    if (this.model.pricingType === PricingType.Free) {
      this.model.price = 0;
    }
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.categories = this.categories.join(',');

    this._articlesService.updateDetails(
      this.model.id,
      this.articleThumbnail,
      this.model.name,
      this.model.description,
      this.model.thumbnailDocumentId,
      this.model.categories,
      this.model.languageId,
      this.model.price,
      this.model.pricingType
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
