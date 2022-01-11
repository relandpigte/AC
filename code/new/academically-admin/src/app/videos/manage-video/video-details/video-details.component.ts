import { Component, OnInit, ChangeDetectionStrategy, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from '@app/videos/_services/video.service';
import { DocumentUploaderComponent, DefaultFile } from '@app/_shared/components/document-uploader/document-uploader.component';
import { AppComponentBase } from '@shared/app-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { FileParameter, PricingType, SpokenLanguageDto, SpokenLanguagesServiceProxy, VideoDto, VideosServiceProxy } from '@shared/service-proxies/service-proxies';
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
  model: VideoDto = new VideoDto();
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
    private _videoService: VideoService
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
      }
    });

    this._videoService.videoCreated$.subscribe(video => {
      if (video) {
        this.model = video;
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

    this._videosService.updateDetails(
      this.model.id,
      this.videoThumbnail,
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
