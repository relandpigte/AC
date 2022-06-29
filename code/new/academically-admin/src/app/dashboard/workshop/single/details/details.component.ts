import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { WorkshopService } from '@app/dashboard/workshop/_services/workshop.service';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import {
  DocumentDto,
  WorkshopsServiceProxy,
  WorkshopType,
  FileParameter,
  PricingType,
  SpokenLanguageDto,
  SpokenLanguagesServiceProxy,
  UpdateWorkshopDto,
  DocumentType,
  WorkshopDto,
} from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import * as _ from 'lodash';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AutoSaveComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  workshop: WorkshopDto;

  id: string;
  category: string;
  categories: string[] = [];
  workshopThumbnailDocument: FileParameter;
  defaultFile: DefaultFile;
  languages: SpokenLanguageDto[] = [];

  model = new UpdateWorkshopDto();
  isLoading = false;
  isUploadingImage = false;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;
  WorkshopType = WorkshopType;
  thumbnailDocument = new DocumentDto();

  get workshopType(): WorkshopType { return this.workshop?.type ?? WorkshopType.Single; }

  constructor(
    injector: Injector,
    private _workshopService: WorkshopService,
    private _workshopsService: WorkshopsServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._workshopService.workshopCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && this.id !== response.id) {
          this.id = response.id;
          this.getWorkshop();
        }
      });

    this.getLanguages();
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.workshopThumbnailDocument = files[0];
        this.uploadThumbnail();
      } else {
        this.workshopThumbnailDocument = undefined;
        if (!this.defaultFile || !this.defaultFile.name) {
          this.deleteThumbnail();
        }
      }
    });
    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.deleteThumbnail();
    });
  }

  onCategoryKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      const index = this.categories.findIndex(i => i.trim() === this.category.trim());
      if (index < 0) {
        this.categories.push(this.category.trim());
        this.category = undefined;
      }
      this.updateCategories();
    }
  }

  onRemoveCategoryClick(category: string): void {
    const index = this.categories.findIndex(e => e === category);
    if (index >= 0) {
      this.categories.splice(index, 1);
    }
    this.updateCategories();
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

  private uploadThumbnail(): void {
    this.isUploadingImage = true;
    this._uploadService.upload(this.workshopThumbnailDocument.data, DocumentType.WorkshopThumbnail, this.model.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isUploadingImage = false;
        })
      )
      .subscribe(response => {
        this.model.thumbnailDocumentId = response.id;
        this.thumbnailDocument = response;
        this.documentUploader.files = [];
        this.setDefaultFile();
      });
  }

  private deleteThumbnail(): void {
    this.isUploadingImage = true;
    if (this.thumbnailDocument && this.thumbnailDocument.id && this.model.thumbnailDocumentId) {
      this._uploadService.delete(this.thumbnailDocument, this.model.id)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isUploadingImage = false;
          })
        )
        .subscribe(() => {
          this.thumbnailDocument = new DocumentDto();
          this.model.thumbnailDocumentId = undefined;
        });
    }
  }

  private updateDetails(): void {
    if (!_.isNil(this.model.price) && !_.isNumber(this.model.price)) {
      return;
    }
    this._workshopsService.update(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._workshopService.workshopCreated = response;
      });
  }

  private getWorkshop(): void {
    this.isLoading = true;
    this._workshopsService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.workshop = response;
        this.model.init(response);
        if (this.model.categories) {
          this.categories = this.model.categories.split(',');
        }
        if (response.thumbnailDocument) {
          this.thumbnailDocument = response.thumbnailDocument;
          this.setDefaultFile();
        }
        this.modelToSave = this.model;
        this.initAutoSave(this.updateDetails);
      });
  }

  private setDefaultFile(): void {
    this.defaultFile = new DefaultFile();
    this.defaultFile.name = this.thumbnailDocument.originalFileName;
    this.defaultFile.url = this._uploadService.getFileUrl(this.thumbnailDocument);
    this.defaultFile.size = this.thumbnailDocument.size;
    this.documentUploader.defaultFile = this.defaultFile;
  }

  private updateCategories(): void {
    this.model.categories = this.categories.join(',');
  }
}
