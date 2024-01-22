import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { DefaultFile, DocumentUploaderComponent } from '@app/_shared/components/document-uploader/document-uploader.component';
import { CourseService } from '@app/courses/_services/course.service';
import { AutoSaveComponentBase } from '@shared/auto-save-component-base';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import { CourseDto, CourseType, CoursesServiceProxy, FileParameter, PricingType, ProfilesServiceProxy, SpokenLanguageDto, SpokenLanguagesServiceProxy, TimeZoneDto, TimeZonesServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { finalize, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent extends AutoSaveComponentBase implements OnInit {
  @ViewChild(DocumentUploaderComponent, { static: true }) documentUploader: DocumentUploaderComponent;
  @ViewChild('priceEl', { static: true }) priceInput: ElementRef;

  user: UserDto = new UserDto();

  category: string;
  courseImageDocument: FileParameter;
  defaultFile: DefaultFile;

  languages: SpokenLanguageDto[] = [];
  categories: string[] = [];
  currencies: { label: string, value: any }[] = [{ label: '£ GBP', value: 'gbp' }];
  timeZones: TimeZoneDto[] = [];

  model = new CourseDto();
  isLoading = false;
  allowedImageExtensions = fileUploadConfiguration.allowedImageExtensions;
  PricingType = PricingType;

  CourseType = CourseType;

  datePickerConfig: BsDatepickerConfig;
  cohortStartDate: Date;
  cohortEndDate: Date;

  constructor(
    injector: Injector,
    private _courseService: CourseService,
    private _coursesService: CoursesServiceProxy,
    private _timeZonesService: TimeZonesServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _spokenLanguagesService: SpokenLanguagesServiceProxy,
  ) {
    super(injector);

    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }
  ngOnInit(): void {
    this.getLanguages();
    this.getUser();

    this._courseService.course$.subscribe(course => {
      if (course) {
        const now = new Date();

        this.model = course;
        this.model.pricingType = this.model.price ? PricingType.FixedPrice : PricingType.Free;
        this.model.currencyId = this.model.currencyId || 'gbp';

        if (course.startDate) {
          this.cohortStartDate = this.convertMomentToDate(course.startDate);
        } else {
          this.cohortStartDate = now;
          this.model.startDate = moment(now);
          this.model.startTime = moment(now).format('hh:MM A');
        }

        if (course.endDate) {
          this.cohortEndDate = this.convertMomentToDate(course.endDate);
        } else {
          this.cohortEndDate = now;
          this.model.endDate = moment(now);
          this.model.endTime = moment(now).format('hh:MM A');
        }

        if (this.model.imageDocument) {
          this.defaultFile = new DefaultFile();
          this.defaultFile.name = this.model.imageDocument.originalFileName;
          this.defaultFile.url = this.model.courseImageUrl;
          this.defaultFile.size = this.model.imageDocument.size;
          this.documentUploader.defaultFile = this.defaultFile;
        }

        if (this.model.categories?.trim()) {
          this.categories = this.model.categories.split(',');
        }

        this.intervalMs = 2_000;
        this.modelToSave = this.model;
        this.initAutoSave(this.onAutoSave);
      }
    });

    this.documentUploader.filesChanged.subscribe((files: FileParameter[]) => {
      if (files?.length) {
        this.courseImageDocument = files[0];
      } else {
        this.courseImageDocument = undefined;
      }
    });
  }

  get isStandardType(): boolean { return this.model?.type === CourseType.Standard; }
  get isCohortType(): boolean { return this.model?.type === CourseType.Cohort; }
  get selectedCurrencyLabel(): string { return this.currencies.find(c => c.value === this.model.currencyId).label; }

  onCourseTypeClick(type: CourseType): void {
    this.model.type = type;
    if (type === CourseType.Standard) {
      this.model.startDate = undefined;
      this.model.startTime = undefined;
      this.model.endDate = undefined;
      this.model.endTime = undefined;
      this.model.numberOfPlaces = undefined;
    }
  }

  onAutoSave(): void {
    if (!this.model.name) return;
    this.onFormSubmit(true);
  }

  onFormSubmit(silent?: boolean): void {
    this.isLoading = !silent;
    this.model.categories = this.categories.join(',');

    this._coursesService.updateDetails(
      this.model.name,
      this.model.subtitle,
      this.model.description,
      this.model.categories,
      this.model.languageId,
      this.model.pricingType,
      this.courseImageDocument,
      this.model.type,
      this.model.price,
      this.model.numberOfPlaces,
      this.model.startDate,
      this.model.startTime,
      this.model.endDate,
      this.model.endTime,
      this.model.id,
    ).pipe(
      takeUntil(this.destroyed$),
      finalize(() => {
        this.isLoading = false;
      })
    )
      .subscribe(() => {
        if (!silent) this.notify.success(this.l('SavedSuccessfully'));
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
    }
  }

  onRemoveCategoryClick(category: string): void {
    const index = this.categories.findIndex(e => e === category);
    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  onPricingClick(): void {
    setTimeout(() => {
      if (this.model.pricingType === PricingType.Free) {
        this.model.price = undefined;
      } else {
        this.priceInput.nativeElement.focus();
        this.priceInput.nativeElement.select();
        this.priceInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    })

  }

  onCohortStartDateTimeChange(): void {
    if (this.cohortStartDate) {
      this.model.startDate = this.convertDateToMoment(this.cohortStartDate);
    }
  }

  onCohortEndDateTimeChange(): void {
    if (this.cohortEndDate) {
      this.model.endDate = this.convertDateToMoment(this.cohortEndDate);
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

  private getTimeZones(): void {
    this._timeZonesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(timeZones => {
        this.timeZones = timeZones;
      });
  }

  private getUser(): void {
    this._profilesService.get(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.getTimeZones();
        })
      )
      .subscribe(user => {
        this.user = user;
      });
  }

  onTimeZoneChange(timeZoneId: string): void {
    // this.isLoading = true;
    // const timeZone = this.timeZones.find(e => e.id === timeZoneId);
    // this._timeZonesService.updateUserTimeZone(timeZone)
    //   .pipe(
    //     takeUntil(this.destroyed$),
    //     finalize(() => {
    //       this.isLoading = false;
    //       abp.timing.timeZoneInfo.iana.timeZoneId = timeZone.ianaName;
    //       moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
    //     }),
    //   )
    //   .subscribe(() => {
    //     this.notify.success(this.l('TimeZoneUpdatedMessage'));
    //   });
  }
}
