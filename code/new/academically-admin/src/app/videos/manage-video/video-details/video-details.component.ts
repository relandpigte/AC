import { Component, OnInit, ChangeDetectionStrategy, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from '@app/videos/_services/video.service';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { DocumentDto, DocumentType, FileParameter, PricingType, SpokenLanguageDto, SpokenLanguagesServiceProxy, UpdateVideoDetailsDto, VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

enum EditField {
  Name = 1,
  Subtitle = 2,
  Categories = 3,
  Thumbnail = 4,
  Language = 5,
  Pricing = 6,
}

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.less'],
})
export class VideoDetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  videoThumbnail: FileParameter;
  model = new UpdateVideoDetailsDto();
  thumbnailDocument = new DocumentDto();
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
    private _videosService: VideosServiceProxy,
    private _videoService: VideoService,
    private _uploadService: UploadService,
  ) {
    super(injector);
    this.getLanguages();
  }

  ngOnInit(): void {
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.videoThumbnail = files[0];
      } else {
        this.videoThumbnail = undefined;
        this.model.thumbnailDocumentId = undefined;
      }
    });

    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.model.thumbnailDocumentId = undefined;
    });

    this._videoService.videoCreated$.subscribe(video => {
      if (video) {
        this.model.init(video);
        if (video.thumbnailDocument) {
          this.thumbnailDocument = video.thumbnailDocument;
          this.setDefaultFile();
        }

        if (this.model.categories && this.model.categories.trim()) {
          this.categories = this.model.categories.split(',');
        }
      }
    });
  }

  onBackClick(): void {
    this._router.navigate(['/app/videos/' + this.model.id + '/video']);
  }

  onPricingClick(pricingState: PricingType): void {
    if (this.model.pricingType === PricingType.Free) {
      this.model.price = 0;
    }
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
    if (this.videoThumbnail) {
      this._uploadService.upload(this.videoThumbnail.data, DocumentType.VideoThumbnail, this.model.id)
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
    this._videosService.updateDetails(this.model).pipe(
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
    this._videosService.get(this.model.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._videoService.videoCreated = response;
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
