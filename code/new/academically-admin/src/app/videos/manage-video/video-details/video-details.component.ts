import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from '@app/videos/_services/video.service';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import {
  DocumentDto,
  DocumentType,
  FileParameter,
  PricingType,
  SpokenLanguageDto,
  SpokenLanguagesServiceProxy,
  UpdateVideoDetailsDto,
  VideosServiceProxy
} from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import * as _ from 'lodash';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.less'],
})
export class VideoDetailsComponent extends AutoSaveComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  id: string;
  videoThumbnail: FileParameter;
  model = new UpdateVideoDetailsDto();
  thumbnailDocument = new DocumentDto();
  isLoading = false;
  isUploadingImage = false;

  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  languages: SpokenLanguageDto[] = [];
  PricingType = PricingType;
  defaultFile: DefaultFile;
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
  }

  ngOnInit(): void {
    this._videoService.videoCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && this.id !== response.id) {
          this.id = response.id;
          this.getVideo();
        }
      });

    this.getLanguages();
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.videoThumbnail = files[0];
        this.uploadThumbnail();
      } else {
        this.videoThumbnail = undefined;
        if (!this.defaultFile || !this.defaultFile.name) {
          this.deleteThumbnail();
        }
      }
    });
    this.documentUploader.defaultFileRemoved.subscribe(() => {
      this.deleteThumbnail();
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
    this._uploadService.upload(this.videoThumbnail.data, DocumentType.VideoThumbnail, this.model.id)
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
    if (!_.isNumber(this.model.price)) {
      return;
    }
    this._videosService.updateDetails(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._videoService.videoCreated = response;
      });
  }

  private getVideo(): void {
    this.isLoading = true;
    this._videosService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
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
