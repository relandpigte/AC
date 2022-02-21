import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { EventService } from '@app/events/_services/event.service';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import {
  DocumentDto,
  EventsServiceProxy,
  EventType,
  FileParameter,
  PricingType,
  SpokenLanguageDto,
  SpokenLanguagesServiceProxy,
  UpdateEventDto,
  DocumentType,
} from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

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
  eventThumbnailDocument: FileParameter;
  defaultFile: DefaultFile;
  languages: SpokenLanguageDto[] = [];

  model = new UpdateEventDto();
  isLoading = false;
  EditField = EditField;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;
  EventType = EventType;
  thumbnailDocument = new DocumentDto();
  eventType: EventType;

  constructor(
    injector: Injector,
    private _eventService: EventService,
    private _eventsService: EventsServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
    private _uploadService: UploadService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getLanguages();

    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.eventThumbnailDocument = files[0];
      } else {
        this.eventThumbnailDocument = undefined;
        this.model.thumbnailDocumentId = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.model.thumbnailDocumentId = undefined;
    });

    this._eventService.eventCreated$.subscribe(event => {
      if (event) {
        this.eventType = event.type;
        this.model.init(event);
        if (event.thumbnailDocument) {
          this.thumbnailDocument = event.thumbnailDocument;
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
    if (this.eventThumbnailDocument) {
      this._uploadService.upload(this.eventThumbnailDocument.data, DocumentType.EventThumbnail, this.model.id)
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
    this._eventsService.update(this.model).pipe(
      takeUntil(this.destroyed$),
      finalize(() => {
        this.isLoading = false;
      })
    )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        setTimeout(() => {
          this.editField = undefined;
          this.getEvent();
        });
      });
  }

  private getEvent(): void {
    this._eventsService.get(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._eventService.eventCreated = response;
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
