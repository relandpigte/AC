import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { EventService } from '@app/dashboard/events/_services/event.service';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { UploadService } from '@app/_shared/services/upload.service';
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
  TimeZoneDto,
  TimeZonesServiceProxy,
  KeywordSearchStrategy,
  DisciplineTaxonomiesServiceProxy,
  EventRecursionType,
  DayOfWeek, EventDto
} from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { TopicSorting } from '@shared/components/topic/topic.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AutoSaveComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;

  id: string;
  category: string;
  categories: string[] = [];
  eventThumbnailDocument: FileParameter;
  defaultFile: DefaultFile;
  languages: SpokenLanguageDto[] = [];
  datePickerConfig: BsDatepickerConfig;

  model = new EventDto();
  isLoading = false;
  isUploadingImage = false;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;
  EventType = EventType;
  thumbnailDocument = new DocumentDto();

  timeZones: TimeZoneDto[] = [];
  userTimeZone: TimeZoneDto = new TimeZoneDto();
  topicsChoices: any[] = [];
  isLoadingTopics = false;
  selectedTopics: { id: string, name: string }[] = [];
  newSelectedTopics: { id: string, name: string }[] = [];

  eventDateTime: Date;
  eventDateTimeEnd: Date;
  endDate: Date;

  scheduleWeekValues: DayOfWeek[] = [];
  scheduleMonthsValues: Date[];

  cancelPolicyTimeSelection = [...Array(25).keys()];

  readonly EventRecursionType = EventRecursionType;
  constructor(
    injector: Injector,
    private _eventService: EventService,
    private _eventsService: EventsServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
    private _uploadService: UploadService,
    private _timeZonesService: TimeZonesServiceProxy,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy
  ) {
    super(injector);
    this.getTimeZones();
  }

  ngOnInit(): void {
    this._eventService.eventCreated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.id && this.id !== response.id) {
          this.id = response.id;
          this.getEvent();
        }
      });

    this.getLanguages();
    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files && files.length) {
        this.eventThumbnailDocument = files[0];
        this.uploadThumbnail();
      } else {
        this.eventThumbnailDocument = undefined;
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

  onTimeZoneChange(timeZoneId: string): void {}

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

  onEventDateTimeChange(): void {
    if (this.eventDateTime) {
      this.model.eventDateTime = this.convertDateToMoment(this.eventDateTime);
    }
  }

  onEventDateTimeEndChange(): void {
    if (this.eventDateTimeEnd) {
      this.model.eventDateTimeEnd = this.convertDateToMoment(this.eventDateTimeEnd);
    }
  }

  onEventEndDateChange(): void {
    if (this.endDate) {
      this.model.endDate = this.convertDateToMoment(this.endDate);
    }
  }

  onRecursionTypeChange(): void {
    switch (this.model.recursionType) {
      case EventRecursionType.Daily:
        this.scheduleWeekValues = undefined;
        this.scheduleMonthsValues = undefined;
        this.convertSessionWeeks();
        this.convertSessionForMonth();
        break;
      case EventRecursionType.Weekly:
        this.scheduleMonthsValues = undefined;
        this.convertSessionForMonth();
        break;
      case EventRecursionType.Monthly:
        this.scheduleWeekValues = undefined;
        this.convertSessionWeeks();
        break;
    }
  }

  private convertSessionWeeks(): void {
    this.model.sessionDaysOfWeek = JSON.stringify(this.scheduleWeekValues);
  }

  private convertSessionForMonth(): void {
    if (this.scheduleMonthsValues && this.scheduleMonthsValues.length) {
      const daysOfMonth = this.scheduleMonthsValues.map(date => {
        return date.getDate();
      });
      this.model.sessionDaysOfMonth = JSON.stringify(daysOfMonth);
    } else {
      this.model.sessionDaysOfMonth = undefined;
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

  private uploadThumbnail(): void {
    this.isUploadingImage = true;
    this._uploadService.upload(this.eventThumbnailDocument.data, DocumentType.EventThumbnail, this.model.id)
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
    this._eventsService.updateDetails(this.model)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        this._eventService.eventCreated = response;
      });
  }

  private getEvent(): void {
    this.isLoading = true;
    this._eventsService.get(this.id)
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

        if (response.eventDateTime) {
          this.eventDateTime = this.convertMomentToDate(response.eventDateTime);
        }

        if (response.eventDateTimeEnd) {
          this.eventDateTimeEnd = this.convertMomentToDate(response.eventDateTimeEnd);
        }

        if (response.endDate) {
          this.endDate = this.convertMomentToDate(response.endDate);
        }

        // let's reset the selected topics here
        this.selectedTopics = response?.eventTopics?.map(e => {
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

  private getTimeZones(): void {
    forkJoin([
      this._timeZonesService.getAll(),
      this._timeZonesService.getByUser(this.currentUserId)
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([timeZones, userTimeZone]): void => {
        this.timeZones = timeZones;
        this.userTimeZone = userTimeZone;
      });
  }
}
