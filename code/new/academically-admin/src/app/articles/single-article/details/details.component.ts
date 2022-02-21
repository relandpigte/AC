import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/articles/_services/article.service';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import {
  FileParameter,
  SpokenLanguageDto,
  DocumentType,
  PricingType,
  ArticlesServiceProxy,
  SpokenLanguagesServiceProxy,
  ArticleType,
  DocumentDto,
  UpdateArticleDetailsDto,
} from '@shared/service-proxies/service-proxies';
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

  model = new UpdateArticleDetailsDto();
  isLoading = false;
  EditField = EditField;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;
  ArticleType = ArticleType;
  thumbnailDocument = new DocumentDto();
  articleType: ArticleType;

  constructor(
    injector: Injector,
    private _articleService: ArticleService,
    private _articlesService: ArticlesServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getLanguages();

    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.articleThumbnailDocument = files[0];
      } else {
        this.articleThumbnailDocument = undefined;
        this.model.thumbnailDocumentId = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.model.thumbnailDocumentId = undefined;
    });

    this._articleService.articleCreated$.subscribe(article => {
      if (article) {
        this.articleType = article.type;
        this.model.init(article);
        if (article.thumbnailDocument) {
          this.thumbnailDocument = article.thumbnailDocument;
          this.setDefaultFile();
        }

        if (this.model.categories && this.model.categories.trim()) {
          this.categories = this.model.categories.split(',');
        }
      }
    });
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.categories = this.categories.join(',');
    if (this.thumbnailDocument.id && !this.model.thumbnailDocumentId) {
      this._uploadService.delete(this.thumbnailDocument, this.model.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.thumbnailDocument = new DocumentDto();
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
    if (this.articleThumbnailDocument) {
      this._uploadService.upload(this.articleThumbnailDocument.data, DocumentType.ArticleThumbnail, this.model.id)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(response => {
          this.model.thumbnailDocumentId = response.id;
          this.thumbnailDocument = response;
          this.documentUploader.files = [];
          this.setDefaultFile();
          this.updateDetails();
        });
    } else {
      this.updateDetails();
    }
  }

  private updateDetails(): void {
    this._articlesService.updateDetails(this.model).pipe(
      takeUntil(this.destroyed$),
      finalize(() => {
        this.isLoading = false;
      })
    )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        setTimeout(() => {
          this.editField = undefined;
          this.getVideo();
        });
      });
  }

  private getVideo(): void {
    this._articlesService.get(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._articleService.articleCreated = response;
      });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.thumbnailDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.thumbnailDocument);
    this.defaultFile.size = this.thumbnailDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }
}
