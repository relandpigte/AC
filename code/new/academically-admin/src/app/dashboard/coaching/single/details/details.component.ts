import { Component, Injector, OnInit, ViewChild, ElementRef } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { CoachingService } from '@app/dashboard/coaching/_services/coaching.service';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { SelectOption } from '@shared/components/service-create-quiz/service-create-quiz.component';
import {
  DocumentDto,
  CoachingsServiceProxy,
  CoachingType,
  FileParameter,
  PricingType,
  SpokenLanguageDto,
  SpokenLanguagesServiceProxy,
  DocumentType,
  CoachingDto,
  KeywordSearchStrategy,
  DisciplineTaxonomiesServiceProxy
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AutoSaveComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  @ViewChild('priceEl', { static: true }) priceInput: ElementRef;

  coaching: CoachingDto;

  id: string;
  category: string;
  categories: string[] = [];
  coachingThumbnailDocument: FileParameter;
  defaultFile: DefaultFile;
  languages: SpokenLanguageDto[] = [];

  model = new CoachingDto();
  isLoading = false;
  isUploadingImage = false;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;
  CoachingType = CoachingType;
  thumbnailDocument = new DocumentDto();

  topicsChoices: any[] = [];
  isLoadingTopics = false;
  selectedTopics: { id: string, name: string }[] = [];
  newSelectedTopics: { id: string, name: string }[] = [];

  cancelPolicyTimeSelection = [...Array(25).keys()];

  sessionLengthOptions: SelectOption[] = [
    { value: 1800, label: '30 minutes' },
    { value: 2700, label: '45 minutes' },
    { value: 3600, label: '60 minutes' },
  ];

  constructor(
    injector: Injector,
    private _coachingService: CoachingService,
    private _coachingsService: CoachingsServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
    private _uploadService: UploadService,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
  }

  get coachingType(): CoachingType { return this.coaching.type ?? CoachingType.Single; }
  get isServiceFree(): boolean { return PricingType.Free === this.model?.pricingType; }

  ngOnInit(): void {
    this._coachingService.coachingCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && this.id !== response.id) {
          this.id = response.id;
          this.getCoaching();
        }
      });

    // this.getLanguages();
    // this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
    //   if (files && files.length) {
    //     this.coachingThumbnailDocument = files[0];
    //     this.uploadThumbnail();
    //   } else {
    //     this.coachingThumbnailDocument = undefined;
    //     if (!this.defaultFile || !this.defaultFile.name) {
    //       this.deleteThumbnail();
    //     }
    //   }
    // });
    // this.documentUploader.defaultFileRemoved.subscribe(() => {
    //   this.deleteThumbnail();
    // });
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

  updateModelForTopics(): void {
    this.model.topics = this.selectedTopics.filter(t => t.id).map(t => t.id) ?? [];
    this.model.newTopics = this.newSelectedTopics.map(t => t.name);
  }

  handleTopicsModelUpdate(data: any): void {
    const { selected, newSelected } = data;
    this.selectedTopics = selected;
    this.newSelectedTopics = newSelected;
    this.updateModelForTopics();
  }

  handleTopicsKeywordUpdate(data: any): void {
    const { keyword, showLoading } = data;
    this._taxonomyService.getAllLastChildren(keyword, KeywordSearchStrategy.StartsWith, true, TopicSorting.Popular, undefined)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(topics => this.topicsChoices = topics.filter(t => !this.selectedTopics.some(x => x.id === t.id)));
  }

  onPricingClick(): void {
    setTimeout((): void => {
      if (this.model.pricingType === PricingType.Free) {
        this.model.price = undefined;
      } else {
        this.priceInput.nativeElement.focus();
        this.priceInput.nativeElement.select();
        this.priceInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }, 200);
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
    this._uploadService.upload(this.coachingThumbnailDocument.data, DocumentType.CoachingThumbnail, this.model.id)
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
    this._coachingsService.updateDetails(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._coachingService.coachingCreated = response;
      });
  }

  private getCoaching(): void {
    this.isLoading = true;
    this._coachingsService.get(this.id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        this.coaching = response;
        this.model.init(response);
        if (this.model.categories) {
          this.categories = this.model.categories.split(',');
        }
        if (response.thumbnailDocument) {
          this.thumbnailDocument = response.thumbnailDocument;
          this.setDefaultFile();
        }

        // let's reset the selected topics here
        this.selectedTopics = response?.coachingTopics?.map(e => {
          return { id: e.disciplineTaxonomy.id, name: e.disciplineTaxonomy.name };
        }) ?? [];
        this.newSelectedTopics = [];

        // add fresh topics to the model
        this.updateModelForTopics();

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
